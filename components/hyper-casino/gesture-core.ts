// Pure, DOM-free gesture math powering every swipe in the Hyper-Casino demos
// (betslip swipe-to-remove, promo carousel, coupon market strip).
//
// Timestamps are passed IN by the caller (never read from Date.now here) so the
// logic is fully deterministic and unit-testable. The React binding lives in
// use-swipe.ts; this module knows nothing about the DOM.

export type Axis = "x" | "y";

export type Sample = { x: number; y: number; t: number };

export type Resolved = {
  axis: Axis;
  /** Signed px along the axis (last sample − first sample). */
  offset: number;
  /** Signed px/ms over a recent window. */
  velocity: number;
  /** Sign of the gesture along the axis. */
  direction: -1 | 0 | 1;
  /** Crossed the distance OR the velocity threshold. */
  committed: boolean;
};

export type ResolveOptions = {
  axis: Axis;
  /** Distance (px) past which the gesture commits regardless of speed. */
  commitDistance: number;
  /** Speed (px/ms) past which a short, fast flick still commits. */
  commitVelocity: number;
  /** Window (ms) over which release velocity is measured. Defaults to 100. */
  velocityWindow?: number;
};

const sign = (n: number): -1 | 0 | 1 => (n > 0 ? 1 : n < 0 ? -1 : 0);

/** Signed release velocity (px/ms) along an axis over the most recent `window` ms. */
export function velocityFromSamples(
  samples: Sample[],
  axis: Axis,
  window = 100,
): number {
  if (samples.length < 2) return 0;
  const last = samples[samples.length - 1];
  // Walk back to the oldest sample still inside the window (or the start).
  let i = samples.length - 2;
  while (i > 0 && last.t - samples[i].t < window) i--;
  const ref = samples[i];
  const dt = last.t - ref.t;
  if (dt <= 0) return 0;
  return (last[axis] - ref[axis]) / dt;
}

/** Resolve a completed drag into offset / velocity / direction / commit decision. */
export function resolveGesture(
  samples: Sample[],
  opts: ResolveOptions,
): Resolved {
  const { axis, commitDistance, commitVelocity, velocityWindow = 100 } = opts;
  if (samples.length < 2) {
    return { axis, offset: 0, velocity: 0, direction: 0, committed: false };
  }
  const first = samples[0];
  const last = samples[samples.length - 1];
  const offset = last[axis] - first[axis];
  const velocity = velocityFromSamples(samples, axis, velocityWindow);
  const direction = offset !== 0 ? sign(offset) : sign(velocity);
  const committed =
    Math.abs(offset) >= commitDistance || Math.abs(velocity) >= commitVelocity;
  return { axis, offset, velocity, direction, committed };
}

export type SnapOptions = {
  /** Speed (px/ms) past which a flick advances one item regardless of distance. */
  flickVelocity?: number;
};

/**
 * Target index of a horizontal carousel after a drag-release.
 *
 * Convention: dragging content left (negative offset/velocity) advances to the
 * NEXT (higher) index — matching how a track translated by `-index * width`
 * behaves under the finger.
 */
export function snapIndex(
  offset: number,
  velocity: number,
  itemWidth: number,
  currentIndex: number,
  count: number,
  opts: SnapOptions = {},
): number {
  const { flickVelocity = 0.4 } = opts;
  let dir = 0;
  if (Math.abs(velocity) >= flickVelocity) {
    dir = velocity < 0 ? 1 : -1;
  } else if (itemWidth > 0 && Math.abs(offset) > itemWidth / 2) {
    dir = offset < 0 ? 1 : -1;
  }
  return Math.max(0, Math.min(count - 1, currentIndex + dir));
}
