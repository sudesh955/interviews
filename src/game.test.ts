import { Readable } from "stream";
import { Game } from "./game";

function streamToData(stream: Readable) {
  return new Promise<string>((resolve, reject) => {
    let data = "";
    stream.on("data", chunk => {
      data += chunk.toString();
    });
    stream.on("end", () => resolve(data));
    stream.on("error", err => reject(err));
  });
}

const tests = [
  /** test line width */
  {
    max: 10,
    lineWidth: 5,
    output: "1,2,3,marco,5\n6,polo,marco,9,10\n"
  },
  /** test marco,marco,marcopolo */
  {
    max: 30,
    lineWidth: 1000,
    output:
      "1,2,3,marco,5,6,polo,marco,9,10,11,marco,13,polo,15,marco,17,18,19,marco,polo,22,23,marco,25,26,27,marcopolo,29,30\n"
  }
];

(async () => {
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const output = await streamToData(new Game(test.max, test.lineWidth));
    if (output !== test.output) {
      console.error(
        "Test failed",
        `Expected ${JSON.stringify(test.output)}, Got ${JSON.stringify(output)}`
      );
    } else {
      console.log("Test passed");
    }
  }
})().catch(console.error);
