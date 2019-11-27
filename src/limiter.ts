export default class Limiter {
  store: Store;

  /// Maximum number of timestamps within the window for the given key.
  count: number;

  /// Duration over which timestamps count towards rate limits (nanoseconds).
  window: bigint;

  /// @throws RangeError unless count and window are both positive
  constructor(count: number, window: bigint, store?: Store) {
    if (count <= 0 || window <= 0n) {
      throw new RangeError();
    }
    this.store = store != null ? store : new InternalStore(count);
    this.count = count;
    this.window = window;
  }

  /// Determines if the given timestamp would exceed the given key’s rate limit,
  /// and if not, records the timestamp against that rate limit.
  ///
  /// @returns retry delay (nanoseconds), or null if it wouldn’t be exceeded
  /// @throws RangeError when $now is less than $key’s most recent timestamp
  delay(key: string, now: bigint): bigint | null {
    const newest = this.store.newest(key);

    if (newest != null && now < newest) {
      throw new RangeError();
    }

    if (this.store.count(key) >= this.count) {
      const delta = now - this.store.oldest(key)!;

      if (delta < this.window) {
        return this.window - delta;
      }
    }

    this.store.record(key, now);

    return null;
  }
}

export interface Store {
  /// Returns the oldest timestamp for the given key (if any).
  oldest(key: string): bigint | null;

  /// Returns the newest timestamp for the given key (if any).
  newest(key: string): bigint | null;

  /// Returns the number of timestamps recorded against the given key.
  count(key: string): number;

  /// Records the given timestamp against the given key.
  record(key: string, now: bigint): void;
}

export class InternalStore implements Store {
  inner: Map<string, bigint[]> = new Map();

  /// Maximum number of timestamps within the window for the given key.
  limit: number;

  constructor(limit: number) {
    if (limit <= 0) {
      throw new RangeError();
    }
    this.limit = limit;
  }

  oldest(key: string) {
    const times = this._times(key);
    return times.length > 0 ? times[0] : null;
  }

  newest(key: string) {
    const times = this._times(key);
    const length = times.length;
    return length > 0 ? times[length - 1] : null;
  }

  count(key: string) {
    return this._times(key).length;
  }

  record(key: string, now: bigint) {
    const times = this._times(key);
    times.push(now);
    times.splice(0, times.length - this.limit);
  }

  _times(key: string): bigint[] {
    if (!this.inner.has(key)) {
      this.inner.set(key, []);
    }
    return this.inner.get(key)!;
  }
}
