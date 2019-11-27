import * as process from "process";
import { Console } from "console";

import express = require("express");
import morgan = require("morgan");

import { middleware } from "./middleware";

const app = express();
const args = process.argv.slice(2);
const port = args.length > 0 ? parseInt(args[0], 10) : 3000;

app.use(middleware(100, 3600_000_000_000n), morgan("combined"));
app.get("/", (...[, res]) => void res.send("Hello, world!"));
app.listen(port, () => {
  const console = new Console({ stdout: process.stderr });
  console.info(`http://[::1]:${port}`);
});
