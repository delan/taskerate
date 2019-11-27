export default class Limiter {
  store: Map<string, bigint[]> = new Map();

  /// Maximum number of timestamps within the window for the given key.
  count: number;

  /// Duration over which timestamps count towards rate limits (nanoseconds).
  window: bigint;

  /// @throws RangeError unless count and window are both positive
  constructor(count: number, window: bigint) {
    if (count <= 0 || window <= 0n) {
      throw new RangeError();
    }
    this.count = count;
    this.window = window;
  }

  /// Determines if the given timestamp would exceed the given key’s rate limit,
  /// and if not, records the timestamp against that rate limit.
  ///
  /// @returns retry delay (nanoseconds), or null if it wouldn’t be exceeded
  /// @throws RangeError when $now is less than $key’s most recent timestamp
  delay(key: string, now: bigint): bigint | null {
    if (!this.store.has(key)) {
      this.store.set(key, []);
    }

    const times = this.store.get(key)!;

    if (times.length > 0 && now < times[times.length - 1]) {
      throw new RangeError();
    }

    if (times.length >= this.count) {
      const delta = now - times[0];

      if (delta < this.window) {
        return this.window - delta;
      }
    }

    times.push(now);
    times.splice(0, times.length - this.count);

    return null;
  }
}
