import {
  useEffect,
  useRef,
} from "react";

function TwilioStreamPage() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const pcmQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const ws = new WebSocket(
      "wss://epiploic-temperance-unwhimperingly.ngrok-free.dev/twilio-audio",
    );
    ws.binaryType = "arraybuffer";

    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    function playQueue() {
      if (pcmQueueRef.current.length === 0) {
        isPlayingRef.current = false;
        return;
      }

      const chunk = pcmQueueRef.current.shift()!;
      const buffer = audioCtx.createBuffer(1, chunk.length, 8000); // Twilio 8kHz
      buffer.getChannelData(0).set(chunk);

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();

      source.onended = () => {
        playQueue(); // play next chunk
      };
    }

    ws.onmessage = async (event) => {
      if (typeof event.data === "string") {
        // Could be logs, welcome messages, or control events
        console.log("Text message from backend:", event.data);
        return;
      }

      // Now we know it's binary (ArrayBuffer or Blob)
      let arrayBuffer: ArrayBuffer;
      if (event.data instanceof ArrayBuffer) {
        arrayBuffer = event.data;
      } else if (event.data instanceof Blob) {
        arrayBuffer = await event.data.arrayBuffer();
      } else {
        console.error("Unknown data type:", event.data);
        return;
      }

      const dataView = new DataView(arrayBuffer);
      const float32Array = new Float32Array(arrayBuffer.byteLength / 2);

      for (let i = 0; i < float32Array.length; i++) {
        float32Array[i] = dataView.getInt16(i * 2, true) / 32768;
      }

      // Push chunk to queue and play
      pcmQueueRef.current.push(float32Array);
      if (!isPlayingRef.current) {
        isPlayingRef.current = true;
        playQueue();
      }
    };

    return () => ws.close();
  }, []);

  return <div>Live Twilio Audio Stream</div>;
}

export default TwilioStreamPage;
