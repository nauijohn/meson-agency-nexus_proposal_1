import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type LiveCall = {
  callSid: string;
  streamSid: string;
  status: "active" | "ended";
  listening: boolean;
};

export default function TwilioStreamLive() {
  const [liveCalls, setLiveCalls] = useState<LiveCall[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRefs = useRef<Record<string, AudioContext>>({});
  const workletRefs = useRef<Record<string, AudioWorkletNode>>({});
  const queueRefs = useRef<Record<string, Float32Array[]>>({});

  const MULAW_TABLE = useMemo(() => {
    const table = new Int16Array(256);
    for (let i = 0; i < 256; i++) {
      const mu = ~i & 0xff;
      const sign = mu & 0x80 ? -1 : 1;
      const exponent = (mu >> 4) & 0x07;
      const mantissa = mu & 0x0f;
      let sample = ((mantissa << 4) + 8) << exponent;
      sample -= 132;
      table[i] = sign * sample;
    }
    return table;
  }, []);

  const decodeMulawToFloat32 = useCallback(
    (buffer: Uint8Array) => {
      const float32 = new Float32Array(buffer.length);
      for (let i = 0; i < buffer.length; i++) {
        float32[i] = MULAW_TABLE[buffer[i]] / 32768;
      }
      return float32;
    },
    [MULAW_TABLE],
  );

  const resample = useCallback(
    (input: Float32Array, srcRate: number, dstRate: number) => {
      if (srcRate === dstRate) return input;
      const ratio = srcRate / dstRate;
      const output = new Float32Array(Math.floor(input.length / ratio));
      for (let i = 0; i < output.length; i++) {
        const idx = i * ratio;
        const i0 = Math.floor(idx);
        const i1 = Math.min(i0 + 1, input.length - 1);
        const frac = idx - i0;
        output[i] = input[i0] * (1 - frac) + input[i1] * frac;
      }
      return output;
    },
    [],
  );

  useEffect(() => {
    const ws = new WebSocket(
      "wss://epiploic-temperance-unwhimperingly.ngrok-free.dev/twilio-audio",
    );
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => console.log("WS connected");
    ws.onclose = () => console.log("WS closed");
    ws.onerror = console.error;

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        try {
          const msg = JSON.parse(event.data);
          switch (msg.type) {
            case "call-start":
              setLiveCalls((prev) => [
                ...prev,
                {
                  callSid: msg.callSid,
                  streamSid: msg.streamSid,
                  status: "active",
                  listening: false,
                },
              ]);
              queueRefs.current[msg.streamSid] = [];
              break;
            case "call-end":
              setLiveCalls((prev) =>
                prev.map((c) =>
                  c.streamSid === msg.streamSid ? { ...c, status: "ended" } : c,
                ),
              );
              break;
          }
        } catch {}
        return;
      }

      if (event.data instanceof ArrayBuffer) {
        const active = liveCalls.find((c) => c.listening);
        if (!active) return;
        const float32 = decodeMulawToFloat32(new Uint8Array(event.data));
        const audioCtx = audioCtxRefs.current[active.streamSid];
        const resampled = audioCtx
          ? resample(float32, 8000, audioCtx.sampleRate)
          : float32;

        if (!queueRefs.current[active.streamSid])
          queueRefs.current[active.streamSid] = [];
        queueRefs.current[active.streamSid].push(resampled);
      }
    };

    return () => ws.close();
  }, [decodeMulawToFloat32, liveCalls, resample]);

  const startListening = useCallback(
    async (call: LiveCall) => {
      if (call.listening) return;

      const audioCtx = new AudioContext();
      if (audioCtx.state === "suspended") await audioCtx.resume();
      audioCtxRefs.current[call.streamSid] = audioCtx;

      // Gentle filters for clarity
      const highpass = audioCtx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = 80;

      const lowpass = audioCtx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 3400;

      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 1.1;

      await audioCtx.audioWorklet.addModule("/audio/stream-processor.js");
      const node = new AudioWorkletNode(audioCtx, "stream-processor");

      node
        .connect(highpass)
        .connect(lowpass)
        .connect(gainNode)
        .connect(audioCtx.destination);
      workletRefs.current[call.streamSid] = node;

      // Feed queued chunks every 20ms to prevent crackle
      const interval = setInterval(() => {
        const q = queueRefs.current[call.streamSid];
        if (q?.length) node.port.postMessage({ float32: q.shift() });
      }, 20);

      setLiveCalls((prev) =>
        prev.map((c) =>
          c.streamSid === call.streamSid ? { ...c, listening: true } : c,
        ),
      );

      const stopWatcher = setInterval(() => {
        const liveCall = liveCalls.find((c) => c.streamSid === call.streamSid);
        if (!liveCall || liveCall.status === "ended") {
          clearInterval(interval);
          node.disconnect();
          audioCtx.close();
          delete workletRefs.current[call.streamSid];
          delete audioCtxRefs.current[call.streamSid];
          delete queueRefs.current[call.streamSid];
          clearInterval(stopWatcher);
        }
      }, 500);
    },
    [liveCalls],
  );

  return (
    <div>
      <h2>Live Calls</h2>
      {liveCalls.length === 0 && <p>No live calls</p>}
      <ul>
        {liveCalls.map((c) => (
          <li key={c.streamSid}>
            Call SID: {c.callSid} | Status: {c.status}{" "}
            {c.listening ? "(Listening)" : ""}
            {c.status === "active" && !c.listening && (
              <button onClick={() => startListening(c)}>Listen 🔊</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
