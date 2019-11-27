"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const limiter_1 = require("./limiter");
function middleware(count, window) {
    const limiter = new limiter_1.Limiter(count, window);
    return (req, res, next) => {
        // should™ be monotonic <https://stackoverflow.com/a/46964780>
        const delay = limiter.delay(req.ip, process.hrtime.bigint());
        if (delay == null) {
            return void next();
        }
        res.status(429).send(`Rate limit exceeded. Try again in ${delay / 1000000000n} seconds`);
        console.warn(`rate limit exceeded for ${req.ip} (HTTP 429; wait ${delay} ns)`);
    };
}
exports.middleware = middleware;
//# sourceMappingURL=middleware.js.map