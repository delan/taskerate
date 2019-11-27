import * as process from "process";
import { AddressInfo } from "net";
import { Console } from "console";

import express = require("express");
import morgan = require("morgan");

import { middleware } from "./middleware";

const app = express();
app.use(middleware(100, 3600_000_000_000n), morgan("combined"));
app.get("/", (...[, res]) => void res.send("Hello, world!"));

const args = process.argv.slice(2);
const port = args.length > 0 ? parseInt(args[0], 10) : 3000;
const server = app.listen(port, () => {
  const address = server.address() as AddressInfo;
  const console = new Console({ stdout: process.stderr });
  console.info(`http://[::1]:${port}`);
});
