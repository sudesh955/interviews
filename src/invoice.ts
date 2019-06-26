import { Transform } from "stream";
import { IncomingMessage, OutgoingMessage } from "http";

class ParserStream extends Transform {
  constructor() {
    super();
  }
  _transform(chunk, encoding, callback) {}
}

export function invoice(req: IncomingMessage, res: OutgoingMessage) {}

/** This is map of each segment to an index
 *  _      * 0 *
 * |_| === 1 2 3
 * |_|     4 5 6
 */

const mapOfDigits = new Map<number, number>();
{
  const eight = (1 << 7) - 1;
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
      console.log(str, offset, JSON.stringify(lines[1][offset + 1]));
      throw new Error(`Unexpected segments ${digit.toString(2)}`);
    }
    value = value * 10 + d;
  }
  return value;
}
