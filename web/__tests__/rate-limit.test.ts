import { describe, it, expect } from "vitest";
import { isRateLimited } from "@web/lib/rate-limit";

describe("isRateLimited", () => {
  it("allows requests under the limit", () => {
    const key = `test-${Date.now()}-allow`;
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(key, { maxRequests: 5, windowMs: 10_000 })).toBe(false);
    }
  });

  it("blocks requests over the limit", () => {
    const key = `test-${Date.now()}-block`;
    for (let i = 0; i < 3; i++) {
      isRateLimited(key, { maxRequests: 3, windowMs: 10_000 });
    }
    expect(isRateLimited(key, { maxRequests: 3, windowMs: 10_000 })).toBe(true);
  });

  it("resets after the window expires", async () => {
    const key = `test-${Date.now()}-reset`;
    for (let i = 0; i < 2; i++) {
      isRateLimited(key, { maxRequests: 2, windowMs: 50 });
    }
    expect(isRateLimited(key, { maxRequests: 2, windowMs: 50 })).toBe(true);

    await new Promise((r) => setTimeout(r, 60));
    expect(isRateLimited(key, { maxRequests: 2, windowMs: 50 })).toBe(false);
  });
});
