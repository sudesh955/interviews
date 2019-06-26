import { join } from "path";
import { createReadStream } from "fs";
import { createServer, IncomingMessage, OutgoingMessage } from "http";

import { game } from "./game";
import { invoice } from "./invoice";

function requestListener(req: IncomingMessage, res: OutgoingMessage) {
  const url = req.url;
  if (url.startsWith("/game")) {
    game(req, res);
  } else if (url.startsWith("/invoice")) {
  } else {
    res.setHeader("content-type", "text/html");
    createReadStream(join(process.cwd(), "index.html")).pipe(res);
  }
}

export function start(cb: () => any) {
  createServer(requestListener).listen(3000, cb);
}

if (require.main === module) {
  start(() => console.log("http://localhost:3000"));
}
