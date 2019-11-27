"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const process = __importStar(require("process"));
const console_1 = require("console");
const express = require("express");
const morgan = require("morgan");
const middleware_1 = require("./middleware");
const app = express();
app.use(middleware_1.middleware(100, 3600000000000n), morgan("combined"));
app.get("/", (...[, res]) => void res.send("Hello, world!"));
const args = process.argv.slice(2);
const port = args.length > 0 ? parseInt(args[0], 10) : 3000;
const server = app.listen(port, () => {
    const address = server.address();
    const console = new console_1.Console({ stdout: process.stderr });
    console.info(`http://[::1]:${port}`);
});
//# sourceMappingURL=example.js.map