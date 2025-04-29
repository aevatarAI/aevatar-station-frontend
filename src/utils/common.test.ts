import { describe, expect, it, vi } from "vitest";
import { delay } from "./common";

describe("delay", () => {
  it("should delay execution for specified milliseconds", async () => {
    const startTime = Date.now();
    const delayTime = 100;

    await delay(delayTime);

    const endTime = Date.now();
    const actualDelay = endTime - startTime;

    // Allow for some timing variance (within 50ms)
    expect(actualDelay).toBeGreaterThanOrEqual(delayTime);
    expect(actualDelay).toBeLessThanOrEqual(delayTime + 50);
  });

  it("should handle zero delay", async () => {
    const startTime = Date.now();

    await delay(0);

    const endTime = Date.now();
    const actualDelay = endTime - startTime;

    // Zero delay should be very quick
    expect(actualDelay).toBeLessThan(50);
  });

  it("should handle negative delay", async () => {
    const startTime = Date.now();

    await delay(-100);

    const endTime = Date.now();
    const actualDelay = endTime - startTime;

    // Negative delay should be treated as zero
    expect(actualDelay).toBeLessThan(50);
  });
});
