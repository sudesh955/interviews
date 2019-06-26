import { IncomingMessage, OutgoingMessage } from "http";
import { Readable } from "stream";

export class Game extends Readable {
  max: number;
  cursor: number;
  lineWidth: number;

  constructor(max: number, lineWidth: number) {
    super();
    this.max = max;
    this.cursor = 1;
    this.lineWidth = lineWidth;
  }

  _read(_size: number) {
    const { max, lineWidth } = this;
    const size = _size - 8;
    let cursor: number = this.cursor;
    let str: string = "";
    while (cursor <= max && str.length < size) {
      if (cursor % 28 === 0) {
        str += "marcopolo";
      } else if (cursor % 4 === 0) {
        str += "marco";
      } else if (cursor % 7 === 0) {
        str += "polo";
      } else {
        str += cursor;
      }
      if (cursor % lineWidth === 0 || cursor === max) {
        str += "\n";
      } else if (cursor !== max) {
        str += ",";
      }
      cursor++;
    }
    this.push(str);
    if (cursor > max) {
      this.push(null);
    } else {
      this.cursor = cursor;
    }
  }
}

export function game(req: IncomingMessage, res: OutgoingMessage) {
  const match = req.url.match(/(\d+)/);
  new Game(match === null ? 1e6 : parseInt(match[1]), 1000).pipe(res);
}
