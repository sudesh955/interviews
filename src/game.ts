import { IncomingMessage, OutgoingMessage } from "http";
import { Readable } from "stream";

class Game extends Readable {
  max: number;
  cursor: number;

  constructor(max: number) {
    super();
    this.max = max;
    this.cursor = 1;
  }

  _read(size: number) {
    const max = this.max;
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
      if (cursor % 1000 === 0 || cursor === max) {
        str += "\n";
      } else {
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
  new Game(1e6).pipe(res);
}
