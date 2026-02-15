/**
 * performance-monitor.ts — FPS tracking with auto-downgrade trigger
 *
 * Tracks frame timing over a sliding window and dispatches a custom event
 * when the average FPS drops below the threshold for a sustained period.
 */

const DOWNGRADE_EVENT = 'shader:performance-downgrade';

export interface PerformanceMonitorOptions {
  /** Minimum acceptable FPS (default: 55) */
  fpsThreshold?: number;
  /** Sliding window size in frames (default: 120 = ~2s at 60fps) */
  sampleSize?: number;
}

export class PerformanceMonitor {
  private frameTimeHistory: number[] = [];
  private readonly fpsThreshold: number;
  private readonly sampleSize: number;
  private hasTriggered = false;

  constructor(options?: PerformanceMonitorOptions) {
    this.fpsThreshold = options?.fpsThreshold ?? 55;
    this.sampleSize = options?.sampleSize ?? 120;
  }

  /**
   * Record the delta time (ms) of the latest frame.
   * Returns true if performance is acceptable, false if downgrade was triggered.
   */
  recordFrame(deltaTimeMs: number): boolean {
    if (this.hasTriggered) return false;

    this.frameTimeHistory.push(deltaTimeMs);
    if (this.frameTimeHistory.length > this.sampleSize) {
      this.frameTimeHistory.shift();
    }

    // Only evaluate after we have a full window of samples
    if (this.frameTimeHistory.length < this.sampleSize) return true;

    const avgFrameTime =
      this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.sampleSize;
    const avgFps = 1000 / avgFrameTime;

    if (avgFps < this.fpsThreshold) {
      this.hasTriggered = true;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent(DOWNGRADE_EVENT, {
            detail: { avgFps: Math.round(avgFps * 10) / 10 },
          }),
        );
      }
      return false;
    }

    return true;
  }

  /** Reset the monitor so it can trigger again after recovery */
  reset(): void {
    this.frameTimeHistory = [];
    this.hasTriggered = false;
  }

  /** Whether the downgrade has already been triggered */
  get triggered(): boolean {
    return this.hasTriggered;
  }
}

/** Event name constant for consumers to listen to */
export { DOWNGRADE_EVENT };
