import {
  RawData,
  Server,
} from "ws";

import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { FrontendAudioGateway } from "./frontend.gateway";

export interface TwilioMediaEvent {
  event: "media";
  sequenceNumber: string;
  media: {
    track: string; // usually "inbound" or "outbound"
    chunk: string; // chunk number
    timestamp: string; // timestamp in ms
    payload: string; // Base64 PCM audio
  };
  streamSid: string;
}

export interface TwilioStopEvent {
  event: "stop";
  sequenceNumber: string;
  streamSid: string;
  stop: {
    accountSid: string;
    callSid: string;
  };
}

export interface TwilioStartEvent {
  event: "start";
  sequenceNumber: string;
  streamSid: string;
  start: {
    accountSid: string;
    streamSid: string;
    callSid: string;
    tracks: string[];
    mediaFormat: {
      encoding: "audio/x-mulaw";
      sampleRate: number; // 8000
      channels: number; // 1
    };
    customParameters: Record<string, string>;
  };
}

export type TwilioStreamEvent =
  | TwilioStartEvent
  | TwilioMediaEvent
  | TwilioStopEvent;

function decodeMulaw(mulawBuffer: Buffer): Int16Array {
  const pcm = new Int16Array(mulawBuffer.length);

  for (let i = 0; i < mulawBuffer.length; i++) {
    const mu = mulawBuffer[i] ^ 0xff; // μ-law is bit-inverted

    const sign = mu & 0x80;
    const exponent = (mu >> 4) & 0x07;
    const mantissa = mu & 0x0f;

    // μ-law decode formula
    let sample = ((mantissa << 4) + 0x08) << exponent;

    sample -= 0x84; // bias

    if (sign !== 0) sample = -sample;

    pcm[i] = sample;
  }

  return pcm;
}

// μ-law (8-bit) → PCM16 (Int16Array)
function decodeMulaw2(mulawBuffer: Buffer): Int16Array {
  const pcm = new Int16Array(mulawBuffer.length);

  for (let i = 0; i < mulawBuffer.length; i++) {
    const mu = mulawBuffer[i] ^ 0xff;

    const sign = mu & 0x80;
    const exponent = (mu >> 4) & 0x07;
    const mantissa = mu & 0x0f;

    let sample = ((mantissa << 4) + 0x08) << exponent;
    sample -= 0x84;

    if (sign !== 0) sample = -sample;

    pcm[i] = sample;
  }

  return pcm;
}

function decodeMulaw3(mulaw: Buffer): Int16Array {
  const pcm = new Int16Array(mulaw.length);
  for (let i = 0; i < mulaw.length; i++) {
    const mu = mulaw[i] ^ 0xff;
    const sign = mu & 0x80;
    const exponent = (mu >> 4) & 0x07;
    const mantissa = mu & 0x0f;
    let sample = ((mantissa << 4) + 0x08) << exponent;
    sample -= 0x84;
    if (sign !== 0) sample = -sample;
    pcm[i] = sample;
  }
  return pcm;
}

// Precomputed μ-law table
const MULAW_DECODE_TABLE = new Int16Array(256);
for (let i = 0; i < 256; i++) {
  const mu = i ^ 0xff;
  const sign = mu & 0x80 ? -1 : 1;
  const exponent = (mu >> 4) & 0x07;
  const mantissa = mu & 0x0f;
  const sample = ((mantissa << 4) + 0x08) << exponent;
  MULAW_DECODE_TABLE[i] = sign * (sample - 0x84);
}

// Decode μ-law buffer to PCM16
function decodeMulawProper(mulaw: Buffer): Int16Array {
  const pcm16 = new Int16Array(mulaw.length);
  for (let i = 0; i < mulaw.length; i++) {
    pcm16[i] = MULAW_DECODE_TABLE[mulaw[i]];
  }
  return pcm16;
}

function decodeMulaw4(mulaw: Buffer): Int16Array {
  const BIAS = 0x84; // standard
  const MAX = 32635; // max 16-bit PCM magnitude
  const pcm = new Int16Array(mulaw.length);

  for (let i = 0; i < mulaw.length; i++) {
    const mu = ~mulaw[i] & 0xff; // invert all bits
    const sign = mu & 0x80;
    const exponent = (mu >> 4) & 0x07;
    const mantissa = mu & 0x0f;
    let sample = ((mantissa << 4) + 0x08) << exponent; // decode
    sample -= BIAS;
    if (sign !== 0) sample = -sample;
    if (sample > MAX) sample = MAX;
    if (sample < -MAX) sample = -MAX;
    pcm[i] = sample;
  }

  return pcm;
}

function decodeMulaw5(mulaw: Buffer): Int16Array {
  const pcm = new Int16Array(mulaw.length);
  for (let i = 0; i < mulaw.length; i++) {
    const MULAW_MAX = 0x1fff; // 13-bit max
    const MULAW_BIAS = 33;

    let u_val = mulaw[i] ^ 0xff;
    let t = ((u_val & 0x0f) << 3) + MULAW_BIAS;
    t <<= (u_val & 0x70) >> 4;
    pcm[i] = u_val & 0x80 ? MULAW_BIAS - t : t - MULAW_BIAS;
  }
  return pcm;
}

// μ-law → PCM16 → Float32
function decodeMulawToFloat32(mulaw: Buffer): Float32Array {
  const table = new Int16Array(256);
  for (let i = 0; i < 256; i++) {
    const mu = i ^ 0xff;
    const sign = mu & 0x80 ? -1 : 1;
    const exponent = (mu >> 4) & 0x07;
    const mantissa = mu & 0x0f;
    table[i] = sign * ((((mantissa << 4) + 8) << exponent) - 132);
  }

  const float32 = new Float32Array(mulaw.length);
  for (let i = 0; i < mulaw.length; i++) {
    float32[i] = table[mulaw[i]] / 32768;
  }
  return float32;
}

@WebSocketGateway({
  path: "/twilio-stream",
  transport: ["websocket"], // forces raw ws
  cors: true,
})
export class TwilioStreamGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly frontendAudioGateway: FrontendAudioGateway) {}

  afterInit(server: Server) {
    console.log("WS server ready for Twilio");

    function toStringMessage(msg: RawData): string {
      if (typeof msg === "string") return msg;

      if (msg instanceof Buffer) return msg.toString("utf8");

      if (Array.isArray(msg)) {
        return Buffer.concat(msg).toString("utf8");
      }

      // ArrayBuffer
      if (msg instanceof ArrayBuffer) {
        return Buffer.from(msg).toString("utf8");
      }

      return "";
    }

    server.on("connection", (socket) => {
      console.log("Twilio connected to WebSocket");

      socket.on("message", (msg) => {
        const messageString = toStringMessage(msg);
        console.log("Raw text from Twilio:", messageString);

        const twilioMessage = JSON.parse(messageString) as TwilioStreamEvent;

        const streamToCall: Record<string, string> = {};

        // switch (twilioMessage.event) {
        //   case "start":
        //     streamToCall[twilioMessage.start.streamSid] =
        //       twilioMessage.start.callSid;

        //     this.frontendAudioGateway.broadcastAudio2(
        //       JSON.stringify({
        //         type: "call-start",
        //         callSid: twilioMessage.start.callSid,
        //         streamSid: twilioMessage.start.streamSid,
        //       }),
        //     );
        //     break;

        //   case "media": {
        //     const callSid = streamToCall[twilioMessage.streamSid] || "unknown";
        //     this.frontendAudioGateway.broadcastAudio2(
        //       JSON.stringify({
        //         type: "media",
        //         callSid, // now properly attached
        //         streamSid: twilioMessage.streamSid,
        //         payload: twilioMessage.media.payload,
        //       }),
        //     );
        //     break;
        //   }

        //   case "stop":
        //     this.frontendAudioGateway.broadcastAudio2(
        //       JSON.stringify({
        //         type: "call-end",
        //         callSid: streamToCall[twilioMessage.streamSid] || "unknown",
        //         streamSid: twilioMessage.streamSid,
        //       }),
        //     );
        //     // cleanup mapping
        //     delete streamToCall[twilioMessage.streamSid];
        //     break;
        // }

        switch (twilioMessage.event) {
          case "start":
            this.frontendAudioGateway.broadcastAudio2(
              JSON.stringify({
                type: "call-start",
                callSid: twilioMessage.start.callSid,
                streamSid: twilioMessage.start.streamSid,
              }),
            );
            break;

          // case "media": {
          //   const mulaw = Buffer.from(twilioMessage.media.payload, "base64");
          //   const float32 = decodeMulawToFloat32(mulaw);

          //   // send raw Float32
          //   this.frontendAudioGateway.broadcastAudio4(float32.buffer);
          //   break;
          // }

          case "media": {
            console.log("Decoding μ-law media chunk from Twilio...");
            // console.log("twilioMessage:", twilioMessage);
            // const mulaw = Buffer.from(twilioMessage.media.payload, "base64");
            // // send raw μ-law bytes to frontend
            // this.frontendAudioGateway.broadcastAudio4(mulaw.buffer);

            const mulaw = Buffer.from(twilioMessage.media.payload, "base64");

            // Important: slice the underlying ArrayBuffer to avoid extra bytes
            const raw = mulaw.buffer.slice(
              mulaw.byteOffset,
              mulaw.byteOffset + mulaw.byteLength,
            );

            this.frontendAudioGateway.broadcastAudio4(raw);
            break;
          }

          // case "media": {
          //   const mulaw = Buffer.from(twilioMessage.media.payload, "base64");
          //   const pcm16 = decodeMulaw5(mulaw);
          //   // your decoder
          //   const sendBuffer = Buffer.alloc(pcm16.length * 2);
          //   for (let i = 0; i < pcm16.length; i++) {
          //     sendBuffer.writeInt16LE(pcm16[i], i * 2);
          //   }
          //   this.frontendAudioGateway.broadcastAudio3(sendBuffer);
          //   break;
          // }

          case "stop":
            this.frontendAudioGateway.broadcastAudio2(
              JSON.stringify({
                type: "call-end",
                callSid: twilioMessage.stop.callSid,
                streamSid: twilioMessage.streamSid,
              }),
            );
            break;
        }
      });

      socket.on("close", () => {
        console.log("Twilio disconnected");
      });
    });
  }
}
