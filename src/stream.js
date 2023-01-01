/* eslint-disable no-console */

import { pipe } from "it-pipe";
import * as lp from "it-length-prefixed";
import map from "it-map";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import fs from "fs";

export function stdinToStream(stream) {
  // Read utf-8 from stdin
  process.stdin.setEncoding("utf8");
  pipe(
    // Read from stdin (the source)
    process.stdin,
    // Turn strings into buffers
    (source) => map(source, (string) => uint8ArrayFromString(string)),
    // Encode with length prefix (so receiving side knows how much data is coming)
    lp.encode(),
    // Write to the stream (the sink)
    stream.sink
  );
}

export function streamToConsole(stream) {
  pipe(stream.source, async function (source) {
    for await (const msg of source) {
      console.log(msg);
      for (const buf of msg.bufs) {
        fs.appendFileSync("/Users/manosriram/Desktop/2.mkv", buf);
      }
      // const x = progress / total;
      // console.log(`progress: ${x}`);
    }
  });
}
