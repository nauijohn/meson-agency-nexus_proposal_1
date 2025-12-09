import React, { useRef } from "react";

function PlayTwilioAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  // μ-law → PCM16 decoder using lookup table
  const MULAW_DECODE_TABLE = new Int16Array(256);
  for (let i = 0; i < 256; i++) {
    const mu = i ^ 0xff;
    const sign = mu & 0x80 ? -1 : 1;
    const exponent = (mu >> 4) & 0x07;
    const mantissa = mu & 0x0f;
    const sample = ((mantissa << 4) + 0x08) << exponent;
    MULAW_DECODE_TABLE[i] = sign * (sample - 0x84);
  }

  const decodeMulaw = (mulawBase64: string): Float32Array => {
    const mulawBuf = Uint8Array.from(atob(mulawBase64), (c) => c.charCodeAt(0));
    const float32 = new Float32Array(mulawBuf.length);
    for (let i = 0; i < mulawBuf.length; i++) {
      float32[i] = MULAW_DECODE_TABLE[mulawBuf[i]] / 32768;
    }
    return float32;
  };

  const playAudio = (mulawBase64: string) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext({ sampleRate: 8000 });
    }
    const audioCtx = audioCtxRef.current;

    const float32 = decodeMulaw(mulawBase64);
    const buffer = audioCtx.createBuffer(1, float32.length, 8000);
    buffer.getChannelData(0).set(float32);

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);

    // Resume context on user gesture (required in Chrome)
    if (audioCtx.state === "suspended") {
      audioCtx.resume().then(() => source.start());
    } else {
      source.start();
    }
  };

  const handleClick = () => {
    const exampleBase64 =
      "3m926GV252Zl7/dvevHxcvzqd/7s9mz97H5ta+l+ZP30dHv7du/5a+3xb/v//Px+fX76+3t29Ptwce79bvR2fu/6dXPr73B36vpu/fr/fH998vpsft5vXuPuZPzuZ+9+be1o6u1ieeDuX2jg4mFo7N9pY9/wXfnXWGLXaWbhc2Te7m1g7cxOUMbwSO7OXlji5W93amrW+E/c0VFizW9P2g==";

    playAudio(exampleBase64);
  };

  return (
    <div>
      <button onClick={handleClick}>Play Twilio Audio</button>
    </div>
  );
}

export default PlayTwilioAudio;
