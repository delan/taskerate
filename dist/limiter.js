"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Limiter {
    /// @throws RangeError unless count and window are both positive
    constructor(count, window, store) {
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
    delay(key, now) {
        const newest = this.store.newest(key);
        if (newest != null && now < newest) {
            throw new RangeError();
        }
        if (this.store.count(key) >= this.count) {
            const delta = now - this.store.oldest(key);
            if (delta < this.window) {
                return this.window - delta;
            }
        }
        this.store.record(key, now);
        return null;
    }
}
exports.Limiter = Limiter;
class InternalStore {
    constructor(limit) {
        this.inner = new Map();
        if (limit <= 0) {
            throw new RangeError();
        }
        this.limit = limit;
    }
    oldest(key) {
        const times = this._times(key);
        return times.length > 0 ? times[0] : null;
    }
    newest(key) {
        const times = this._times(key);
        const length = times.length;
        return length > 0 ? times[length - 1] : null;
    }
    count(key) {
        return this._times(key).length;
    }
    record(key, now) {
        const times = this._times(key);
        times.push(now);
        times.splice(0, times.length - this.limit);
    }
    _times(key) {
        if (!this.inner.has(key)) {
            this.inner.set(key, []);
        }
        return this.inner.get(key);
    }
}
exports.InternalStore = InternalStore;
//# sourceMappingURL=limiter.js.map