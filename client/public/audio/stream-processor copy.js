class StreamProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.queue = [];

    // oversampling
    this.last = 0;

    // 4th order band-pass filter (telephony 300–3400 Hz)
    this.x1 = this.x2 = this.x3 = this.x4 = 0;
    this.y1 = this.y2 = this.y3 = this.y4 = 0;

    // Butterworth 4th order coefficients
    this.b = [0.2066, 0, -0.4131, 0, 0.2066];
    this.a = [1, -1.3693, 1.2391, -0.5514, 0.1115];

    this.dePrev = 0;

    this.port.onmessage = (e) => {
      if (e.data?.float32) this.queue.push(e.data.float32);
    };
  }

  deEmphasis(x) {
    const ALPHA = 0.9;
    const y = x + ALPHA * this.dePrev;
    this.dePrev = y;
    return y;
  }

  bandPass(x) {
    const y =
      this.b[0] * x +
      this.b[1] * this.x1 +
      this.b[2] * this.x2 +
      this.b[3] * this.x3 +
      this.b[4] * this.x4 -
      this.a[1] * this.y1 -
      this.a[2] * this.y2 -
      this.a[3] * this.y3 -
      this.a[4] * this.y4;

    this.x4 = this.x3;
    this.x3 = this.x2;
    this.x2 = this.x1;
    this.x1 = x;

    this.y4 = this.y3;
    this.y3 = this.y2;
    this.y2 = this.y1;
    this.y1 = y;

    return y;
  }

  process(inputs, outputs) {
    const output = outputs[0][0];
    output.fill(0);

    let offset = 0;

    while (this.queue.length && offset < output.length) {
      const chunk = this.queue[0];
      const toCopy = Math.min(chunk.length, output.length - offset);

      for (let i = 0; i < toCopy; i++) {
        const s = chunk[i];

        // 2× oversample
        const mid = (this.last + s) * 0.5;
        this.last = s;

        // Process mid-sample
        let cleanMid = this.bandPass(this.deEmphasis(mid));
        // Process real sample
        let clean = this.bandPass(this.deEmphasis(s));

        // average
        output[offset + i] = (clean + cleanMid) * 0.9;
      }

      offset += toCopy;

      if (toCopy < chunk.length) this.queue[0] = chunk.subarray(toCopy);
      else this.queue.shift();
    }

    return true;
  }
}

registerProcessor("stream-processor", StreamProcessor);
