class StreamProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.queue = [];
    this.port.onmessage = (e) => {
      if (e.data?.float32) this.queue.push(e.data.float32);
    };
  }

  process(inputs, outputs) {
    const output = outputs[0][0];
    output.fill(0);

    let offset = 0;
    while (this.queue.length && offset < output.length) {
      const chunk = this.queue[0];
      const len = Math.min(chunk.length, output.length - offset);

      // Copy chunk to output
      output.set(chunk.subarray(0, len), offset);
      offset += len;

      if (len < chunk.length) {
        this.queue[0] = chunk.subarray(len);
      } else {
        this.queue.shift();
      }
    }

    return true;
  }
}

registerProcessor("stream-processor", StreamProcessor);
