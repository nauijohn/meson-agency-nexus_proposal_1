class StreamProcessor extends AudioWorkletProcessor {
  queue = [];

  constructor() {
    super();
    this.port.onmessage = (event) => {
      if (event.data?.float32) {
        this.queue.push(event.data.float32);
      }
    };
  }

  process(inputs, outputs) {
    console.log("Processing audio frame..");
    const output = outputs[0][0];
    output.fill(0);

    let offset = 0;
    while (this.queue.length && offset < output.length) {
      const chunk = this.queue[0];
      const toCopy = Math.min(chunk.length, output.length - offset);
      output.set(chunk.subarray(0, toCopy), offset);
      offset += toCopy;

      if (toCopy < chunk.length) {
        this.queue[0] = chunk.subarray(toCopy);
      } else {
        this.queue.shift();
      }
    }

    return true;
  }
}

registerProcessor("stream-processor", StreamProcessor);
