import { describe, it, expect } from "vitest";
import {
  resolveGesture,
  snapIndex,
  velocityFromSamples,
  type Sample,
} from "./gesture-core";

/** Build a sample sequence from [position, timestamp] pairs along one axis. */
const seq = (pts: Array<[number, number]>, axis: "x" | "y" = "x"): Sample[] =>
  pts.map(([p, t]) => (axis === "x" ? { x: p, y: 0, t } : { x: 0, y: p, t }));

describe("velocityFromSamples", () => {
  it("returns 0 with fewer than two samples", () => {
    expect(velocityFromSamples([], "x")).toBe(0);
    expect(velocityFromSamples(seq([[0, 0]]), "x")).toBe(0);
  });

  it("computes signed px/ms over the recent window", () => {
    // moved −100px over the last 100ms → −1 px/ms
    const v = velocityFromSamples(
      seq([
        [0, 0],
        [-100, 100],
      ]),
      "x",
      100,
    );
    expect(v).toBeCloseTo(-1, 5);
  });

  it("ignores samples older than the window", () => {
    // a long slow start then a fast final leg; window=100 must weight only the end
    const v = velocityFromSamples(
      seq([
        [0, 0],
        [10, 900],
        [-40, 1000],
      ]),
      "x",
      100,
    );
    // from t=900 (10) to t=1000 (−40): −50px / 100ms = −0.5
    expect(v).toBeCloseTo(-0.5, 5);
  });
});

describe("resolveGesture", () => {
  const opts = { axis: "x" as const, commitDistance: 80, commitVelocity: 0.5 };

  it("is uncommitted for a tiny slow drag", () => {
    const r = resolveGesture(
      seq([
        [0, 0],
        [-20, 400],
      ]),
      opts,
    );
    expect(r.committed).toBe(false);
    expect(r.direction).toBe(-1);
    expect(r.offset).toBe(-20);
  });

  it("commits when the distance threshold is crossed", () => {
    const r = resolveGesture(
      seq([
        [0, 0],
        [-120, 600],
      ]),
      opts,
    );
    expect(r.committed).toBe(true);
  });

  it("commits a short fast flick on velocity alone", () => {
    // only 30px of travel but very fast (30px / 30ms = 1 px/ms)
    const r = resolveGesture(
      seq([
        [0, 0],
        [-30, 30],
      ]),
      opts,
    );
    expect(Math.abs(r.offset)).toBeLessThan(opts.commitDistance);
    expect(r.committed).toBe(true);
  });

  it("reports a neutral result with insufficient samples", () => {
    const r = resolveGesture(seq([[0, 0]]), opts);
    expect(r).toMatchObject({
      offset: 0,
      velocity: 0,
      direction: 0,
      committed: false,
    });
  });
});

describe("snapIndex", () => {
  const W = 300;

  it("stays put on a short slow drag", () => {
    expect(snapIndex(-40, 0, W, 1, 4)).toBe(1);
  });

  it("advances when dragged past the half-step", () => {
    expect(snapIndex(-160, 0, W, 1, 4)).toBe(2);
  });

  it("goes back when dragged the other way past half", () => {
    expect(snapIndex(160, 0, W, 1, 4)).toBe(0);
  });

  it("advances on a fast leftward flick regardless of distance", () => {
    expect(snapIndex(-10, -0.8, W, 1, 4)).toBe(2);
  });

  it("clamps at the last index", () => {
    expect(snapIndex(-400, -2, W, 3, 4)).toBe(3);
  });

  it("clamps at the first index", () => {
    expect(snapIndex(400, 2, W, 0, 4)).toBe(0);
  });
});
