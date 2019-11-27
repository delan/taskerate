taskerate
=========


This is an exercise for an HTTP rate-limiting module in the form of an
Express middleware.


[src/middleware.ts] contains just enough glue to delegate decisions to
[src/limiter.ts], which contains the rate-limiting algorithm.


[src/middleware.ts]: src/middleware.ts
[src/limiter.ts]: src/limiter.ts


To save time, it’s based on [jsynowiec/node-typescript-boilerplate],
which was written by [Jakub Synowiec] and released under the Apache
License 2.0 (see [LICENSE.boilerplate.txt]).


[jsynowiec/node-typescript-boilerplate]: https://github.com/jsynowiec/node-typescript-boilerplate
[Jakub Synowiec]: mailto:github@jakubsynowiec.info
[LICENSE.boilerplate.txt]: LICENSE.boilerplate.txt


To spin up an example server:


    npm install
    npm run start [port]


To use the middleware in your own app:


    const express = require("express");
    const taskerate = require("taskerate");
    const app = express();

    // 100 requests in the last hour (3600e9 ns)
    app.use(taskerate.middleware(100, 3600_000_000_000n));


See [package.json] for unit tests and other options.


[package.json]: package.json
