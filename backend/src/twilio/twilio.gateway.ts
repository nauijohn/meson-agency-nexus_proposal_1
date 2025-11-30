import { RawData, Server } from "ws";

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

export type TwilioStreamEvent = TwilioMediaEvent | TwilioStopEvent;

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

        if (twilioMessage.event === "media") {
          // TypeScript now knows this is TwilioMediaEvent
          const audioBuffer = Buffer.from(
            twilioMessage.media.payload,
            "base64",
          );

          console.log("audioBuffer: ", audioBuffer);

          // Send audioBuffer to frontend, e.g., via WebSocket
          this.frontendAudioGateway.broadcastAudio(audioBuffer);
        }

        if (twilioMessage.event === "stop") {
          console.log(`Call ${twilioMessage.stop.callSid} has ended`);
        }
      });

      socket.on("close", () => {
        console.log("Twilio disconnected");
      });
    });
  }

  // afterInit(server: any) {
  //   console.log("server: ", server);
  //   console.log("Twilio Stream WS initialized");
  // }

  // handleConnection(client: any, ...args: any[]) {
  //   console.log("New client connected to Twilio Stream Gateway");
  //   this.server.on("connection", (ws) => {
  //     ws.on("message", (message) => {
  //       let msgString: string;

  //       if (typeof message === "string") {
  //         msgString = message; // already a string
  //       } else if (message instanceof Buffer) {
  //         msgString = message.toString("utf8"); // decode buffer
  //       } else {
  //         // fallback for other types
  //         msgString = JSON.stringify(message);
  //       }

  //       console.log("Received message from client:", msgString);
  //     });

  //     ws.send("Welcome to the Twilio Stream Gateway!");
  //   });
  // }
}
