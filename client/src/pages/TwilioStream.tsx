import { useEffect, useRef, useState } from "react";

interface LiveCall {
  callSid: string;
  audioNode: AudioWorkletNode;
}

function TwilioStreamPage() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [ready, setReady] = useState(false);
  const [liveCalls, setLiveCalls] = useState<LiveCall[]>([]);

  // -----------------------------
  // Helpers
  // -----------------------------
  const pcm16ToFloat32 = (pcm16: Int16Array) => {
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = (pcm16[i] / 32768) * 0.95; // reduce clipping
    }
    return float32;
  };

  const startAudio = async () => {
    if (!audioCtxRef.current) return;
    await audioCtxRef.current.resume();
    setReady(true);
    console.log("AudioContext resumed");
  };

  // -----------------------------
  // WebSocket & AudioWorklet Setup
  // -----------------------------
  useEffect(() => {
    const ws = new WebSocket(
      "wss://epiploic-temperance-unwhimperingly.ngrok-free.dev/twilio-audio",
    );
    ws.binaryType = "arraybuffer";

    const audioCtx = new AudioContext({ sampleRate: 8000 });
    audioCtxRef.current = audioCtx;

    // Load AudioWorklet
    audioCtx.audioWorklet
      .addModule("/audio/stream-processor.js") // create this file in /public
      .then(() => console.log("AudioWorklet loaded"))
      .catch(console.error);

    ws.onopen = () => console.log("WS connected");
    ws.onclose = () => console.log("WS closed");
    ws.onerror = (err) => console.error("WS error:", err);

    ws.onmessage = async (event) => {
      // -----------------------------
      // Handle string messages safely
      // -----------------------------
      if (typeof event.data === "string") {
        let msg;
        try {
          msg = JSON.parse(event.data);
        } catch {
          console.warn("Skipping non-JSON message:", event.data);
          return;
        }

        if (msg.type === "call-start") {
          console.log("Call started:", msg.callSid);

          if (!audioCtxRef.current || !ready) return;

          const workletNode = new AudioWorkletNode(
            audioCtxRef.current,
            "stream-processor",
          );
          workletNode.connect(audioCtxRef.current.destination);

          setLiveCalls((prev) => [
            ...prev,
            { callSid: msg.callSid, audioNode: workletNode },
          ]);
        }

        if (msg.type === "call-end") {
          console.log("Call ended:", msg.callSid);
          setLiveCalls((prev) =>
            prev.filter((c) => {
              if (c.callSid === msg.callSid) {
                c.audioNode.disconnect();
                return false;
              }
              return true;
            }),
          );
        }

        return;
      }

      // -----------------------------
      // Handle PCM16 audio chunks
      // -----------------------------
      let arrayBuffer: ArrayBuffer;
      if (event.data instanceof ArrayBuffer) arrayBuffer = event.data;
      else if (event.data instanceof Blob)
        arrayBuffer = await event.data.arrayBuffer();
      else return console.warn("Unknown data type:", event.data);

      const float32Array = pcm16ToFloat32(new Int16Array(arrayBuffer));

      // Broadcast to all live calls
      liveCalls.forEach((c) =>
        c.audioNode.port.postMessage({ float32: float32Array }),
      );
    };

    return () => {
      ws.close();
      liveCalls.forEach((c) => c.audioNode.disconnect());
    };
  }, [ready, liveCalls]);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div>
      {!ready ? (
        <button onClick={startAudio}>🔊 Click to Enable Audio</button>
      ) : liveCalls.length > 0 ? (
        <div>
          {liveCalls.map((c) => (
            <div key={c.callSid}>📞 Live Call: {c.callSid}</div>
          ))}
        </div>
      ) : (
        <div>Waiting for call…</div>
      )}
    </div>
  );
}

export default TwilioStreamPage;
