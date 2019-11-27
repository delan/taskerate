import { RequestHandler } from "express";

import { Limiter } from "./limiter";

export function middleware(
  count: number,
  window: bigint,
): RequestHandler {
  const limiter = new Limiter(count, window);

  return (req, res, next) => {
    // should™ be monotonic <https://stackoverflow.com/a/46964780>
    const delay = limiter.delay(req.ip, process.hrtime.bigint());

    if (delay == null) {
      return void next();
    }

    res.status(429).send(`Rate limit exceeded. Try again in ${delay / 1_000_000_000n} seconds`);
    console.warn(`rate limit exceeded for ${req.ip} (HTTP 429; wait ${delay} ns)`)
  };
}
