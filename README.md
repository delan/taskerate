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


## Limitations


This solution ships with a default implementation where timestamp data
is stored locally in the middleware instance.


I’ve tried to finish the exercise in a reasonable time at the expense
of some production-readiness, so I’ve used ordinary arrays where ring
buffers would be better, making some operations O(k) for rate limits
of k requests when they could be O(1), and I haven’t bothered with any
kind of bound on timestamp data, which is a denial-of-service risk.


If your app is deployed behind a load balancer or on some other highly
available environment, you should write a custom shared `Store` backed
by something like [Redis] (see [limiter.d.ts] and [limiter.ts]), then
override the default store when making your middleware instance:


    const store = new MyStore(...);
    app.use(taskerate.middleware(100, 3600_000_000_000n, store));


[Redis]: https://redis.io
[limiter.d.ts]: dist/limiter.d.ts
[limiter.ts]: src/limiter.ts
