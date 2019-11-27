import Limiter from "./limiter";

test("delay throws RangeError when count isn’t positive", () => {
  expect(() => new Limiter(-1, 13n)).toThrow(RangeError);
  expect(() => new Limiter(0, 13n)).toThrow(RangeError);
  expect(() => new Limiter(1, 13n)).not.toThrow();
});

test("delay throws RangeError when window isn’t positive", () => {
  expect(() => new Limiter(1, -1n)).toThrow(RangeError);
  expect(() => new Limiter(1, 0n)).toThrow(RangeError);
  expect(() => new Limiter(1, 1n)).not.toThrow();
});

test("delay handles different keys independently", () => {
  const limiter = new Limiter(1, 13n);

  // FIXME jest@24.9.0 doesn’t support BigInt (facebook/jest#8382)
  expect(limiter.delay("p", 0n)).toBe(null);
  expect(limiter.delay("q", 0n)).toBe(null);
  expect(limiter.delay("p", 0n) == 13n).toBe(true);
});

test("delay returns correct values", () => {
  const limiter = new Limiter(3, 13n);

  // FIXME jest@24.9.0 doesn’t support BigInt (facebook/jest#8382)
  expect(limiter.delay("", 5n)).toBe(null);
  expect(limiter.delay("", 7n)).toBe(null);
  expect(limiter.delay("", 8n)).toBe(null);
  expect(limiter.delay("", 11n) == 7n).toBe(true);
  expect(limiter.delay("", 17n) == 1n).toBe(true);
  expect(limiter.delay("", 18n)).toBe(null);
});

test("delay throws RangeError when the given timestamp isn’t monotonic", () => {
  const limiter = new Limiter(5, 13n);

  expect(() => limiter.delay("", 0n)).not.toThrow();
  expect(() => limiter.delay("", 1n)).not.toThrow();
  expect(() => limiter.delay("", 1n)).not.toThrow();
  expect(() => limiter.delay("", 0n)).toThrow(RangeError);
});
