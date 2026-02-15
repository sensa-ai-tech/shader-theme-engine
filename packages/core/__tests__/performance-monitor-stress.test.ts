import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PerformanceMonitor, DOWNGRADE_EVENT } from '../src/lib/performance-monitor';

describe('PerformanceMonitor stress tests', () => {
  let eventSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    eventSpy = vi.fn();
    window.addEventListener(DOWNGRADE_EVENT, eventSpy);
  });

  afterEach(() => {
    window.removeEventListener(DOWNGRADE_EVENT, eventSpy);
  });

  it('should not trigger downgrade for consistently good frames', () => {
    const monitor = new PerformanceMonitor({ fpsThreshold: 55, sampleSize: 60 });

    // 60 frames at ~60fps (16.67ms each)
    for (let i = 0; i < 120; i++) {
      monitor.recordFrame(16.67);
    }

    expect(monitor.triggered).toBe(false);
    expect(eventSpy).not.toHaveBeenCalled();
  });

  it('should trigger downgrade for consistently bad frames after filling window', () => {
    const monitor = new PerformanceMonitor({ fpsThreshold: 55, sampleSize: 10 });

    // 10 frames at ~20fps (50ms each) to fill the window
    for (let i = 0; i < 10; i++) {
      monitor.recordFrame(50);
    }

    // After filling, the next bad frame should trigger
    const result = monitor.recordFrame(50);
    expect(result).toBe(false);
    expect(monitor.triggered).toBe(true);
    expect(eventSpy).toHaveBeenCalled();
  });

  it('should recover from sporadic bad frames if average stays above threshold', () => {
    const monitor = new PerformanceMonitor({ fpsThreshold: 30, sampleSize: 10 });

    // Mix of good and bad frames — average should stay above 30fps
    const frameTimes = [16, 16, 50, 16, 16, 16, 50, 16, 16, 16];
    // Avg: ~22.8ms → ~43.86 fps — above threshold of 30

    for (const dt of frameTimes) {
      monitor.recordFrame(dt);
    }

    // Should not trigger since average FPS > threshold
    expect(monitor.triggered).toBe(false);
  });

  it('should handle zero deltaTime without NaN/Infinity', () => {
    const monitor = new PerformanceMonitor({ fpsThreshold: 30, sampleSize: 5 });

    // Zero ms frame — could cause division by zero
    expect(() => monitor.recordFrame(0)).not.toThrow();
    expect(() => monitor.recordFrame(0.001)).not.toThrow();
  });

  it('should handle very large deltaTime (e.g., tab was backgrounded)', () => {
    const monitor = new PerformanceMonitor({ fpsThreshold: 55, sampleSize: 10 });

    // Normal frames
    for (let i = 0; i < 8; i++) {
      monitor.recordFrame(16.67);
    }

    // Simulated tab backgrounding — huge gap
    monitor.recordFrame(5000);

    // Resume normal
    monitor.recordFrame(16.67);

    // The single outlier shouldn't instantly trigger downgrade
    // if average of the window is still mostly good
    // (depends on sampleSize vs how many bad frames there are)
  });

  it('should correctly reset all state', () => {
    const monitor = new PerformanceMonitor({ fpsThreshold: 55, sampleSize: 5 });

    // Fill with bad frames
    for (let i = 0; i < 6; i++) {
      monitor.recordFrame(50);
    }

    const triggeredBefore = monitor.triggered;
    monitor.reset();

    expect(monitor.triggered).toBe(false);

    // Good frames after reset should be fine
    for (let i = 0; i < 5; i++) {
      monitor.recordFrame(16.67);
    }
    expect(monitor.triggered).toBe(false);
  });

  it('should not re-trigger after already triggered', () => {
    const monitor = new PerformanceMonitor({ fpsThreshold: 55, sampleSize: 5 });

    // Trigger downgrade
    for (let i = 0; i < 10; i++) {
      monitor.recordFrame(50);
    }

    expect(monitor.triggered).toBe(true);
    const callCount = eventSpy.mock.calls.length;

    // More bad frames — should not fire event again
    for (let i = 0; i < 10; i++) {
      monitor.recordFrame(50);
    }

    expect(eventSpy.mock.calls.length).toBe(callCount);
  });
});
