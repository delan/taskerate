export declare class Limiter {
    store: Store;
    count: number;
    window: bigint;
    constructor(count: number, window: bigint, store?: Store);
    delay(key: string, now: bigint): bigint | null;
}
export interface Store {
    oldest(key: string): bigint | null;
    newest(key: string): bigint | null;
    count(key: string): number;
    record(key: string, now: bigint): void;
}
export declare class InternalStore implements Store {
    inner: Map<string, bigint[]>;
    limit: number;
    constructor(limit: number);
    oldest(key: string): bigint | null;
    newest(key: string): bigint | null;
    count(key: string): number;
    record(key: string, now: bigint): void;
    _times(key: string): bigint[];
}
