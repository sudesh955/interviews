import { Transform, TransformCallback } from "stream";
import { IncomingMessage, OutgoingMessage } from "http";

class ParserStream extends Transform {
  data: string;

  constructor() {
    super();
    this.data = "";
  }

  _transform(chunk: any, encoding: string, callback: TransformCallback) {
    /** according to input specification each invoice number will be (27 * 3 + 4) byte long */
    const length = 85;
    let data = this.data + encoding === "buffer" ? chunk.toString() : chunk;
    const outputs: number[] = [];
    while (data.length >= length) {
      outputs.push(parse(data.substr(0, length - 1)));
      data = data.substr(length);
    }
    this.data = data;
    callback(null, outputs.join("\n"));
  }
}

export function invoice(req: IncomingMessage, res: OutgoingMessage) {
  const parser = new ParserStream();
  req.pipe(parser);
  parser.pipe(res);
}

/** This is map of each segment of 7-segment display to an index
 *  _      * 0 *
 * |_| === 1 2 3
 * |_|     4 5 6
 *
 * We use bits on a number to mark which segments of 7-segment display is on.
 * e.g. if 1st bit is set then first segment(top most) is on.
 * So every digit will be represented by a number in which corresponding bits are set.
 * Here we create a map that will map numbers to digit.
 * Since it can be tedious to type all set bits and take a "bitwise or". We build those
 * numbers from each other.
 * e.g.
 *  For digit 8 the number will be 0b111111.
 *  if we unset bit for 3rd segment in number of 8, it will become number for 6.
 */

const mapOfDigits = new Map<number, number>();
{
  const eight = 0b111111;
  const six = eight - (1 << 3);
  const nine = eight - (1 << 4);
  const five = six - (1 << 4);
  const two = eight - (1 << 1) - (1 << 6);
  const three = eight - (1 << 1) - (1 << 4);
  const one = (1 << 3) | (1 << 6);
  const four = nine - (1 << 0) - (1 << 5);
  const seven = one + (1 << 0);
  const zero = eight - (1 << 2);
  mapOfDigits.set(zero, 0);
  mapOfDigits.set(one, 1);
  mapOfDigits.set(two, 2);
  mapOfDigits.set(three, 3);
  mapOfDigits.set(four, 4);
  mapOfDigits.set(five, 5);
  mapOfDigits.set(six, 6);
  mapOfDigits.set(seven, 7);
  mapOfDigits.set(eight, 8);
  mapOfDigits.set(nine, 9);
}

/**
 * We check for every segment. If segment in not off we set corresponding bit.
 * After all segments are processed, We will get a number that will be a key of
 * `mapOfDigits`. If this key does not exists in `mapOfDigits` then it is invalid
 * number.
 */

export function parse(str: string): number {
  const lines = str.split("\n");
  let value = 0;
  for (let offset = 0; offset < 27; offset += 3) {
    let digit = 0;
    if (lines[0][offset + 1] !== " ") {
      digit = digit | (1 << 0);
    }
    if (lines[1][offset] !== " ") {
      digit = digit | (1 << 1);
    }
    if (lines[1][offset + 1] !== " ") {
      digit = digit | (1 << 2);
    }
    if (lines[1][offset + 2] !== " ") {
      digit = digit | (1 << 3);
    }
    if (lines[2][offset] !== " ") {
      digit = digit | (1 << 4);
    }
    if (lines[2][offset + 1] !== " ") {
      digit = digit | (1 << 5);
    }
    if (lines[2][offset + 2] !== " ") {
      digit = digit | (1 << 6);
    }
    const d = mapOfDigits.get(digit);
    if (d == null) {
      console.error(str, offset, JSON.stringify(lines[1][offset + 1]));
      throw new Error(`Unexpected segments ${digit.toString(2)}`);
    }
    value = value * 10 + d;
  }
  return value;
}
