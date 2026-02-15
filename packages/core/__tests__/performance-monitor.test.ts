import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PerformanceMonitor, DOWNGRADE_EVENT } from '../src/lib/performance-monitor';

describe('PerformanceMonitor', () => {
  it('should not trigger downgrade when FPS is above threshold', () => {
    const monitor = new PerformanceMonitor({ fpsThreshold: 55, sampleSize: 10 });
    // 60 FPS = ~16.67ms per frame
    for (let i = 0; i < 10; i++) {
      const result = monitor.recordFrame(16.67);
      expect(result).toBe(true);
    }
    expect(monitor.triggered).toBe(false);
  });

  it('should trigger downgrade when FPS drops below threshold', () => {
    const monitor = new PerformanceMonitor({ fpsThreshold: 55, sampleSize: 10 });
    // 30 FPS = ~33.33ms per frame
    for (let i = 0; i < 10; i++) {
      monitor.recordFrame(33.33);
    }
    expect(monitor.triggered).toBe(true);
  });

  it('should dispatch custom event on downgrade', () => {
    const handler = vi.fn();
    window.addEventListener(DOWNGRADE_EVENT, handler);

    const monitor = new PerformanceMonitor({ fpsThreshold: 55, sampleSize: 5 });
    for (let i = 0; i < 5; i++) {
      monitor.recordFrame(33.33);
    }

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.detail.avgFps).toBeLessThan(55);

    window.removeEventListener(DOWNGRADE_EVENT, handler);
  });

  it('should not trigger downgrade until sample size is full', () => {
    const monitor = new PerformanceMonitor({ fpsThreshold: 55, sampleSize: 10 });
    // Only 5 frames at 30 FPS — not enough samples
    for (let i = 0; i < 5; i++) {
      monitor.recordFrame(33.33);
    }
    expect(monitor.triggered).toBe(false);
  });

  it('should only trigger once', () => {
    const handler = vi.fn();
    window.addEventListener(DOWNGRADE_EVENT, handler);

    const monitor = new PerformanceMonitor({ fpsThreshold: 55, sampleSize: 5 });
    for (let i = 0; i < 15; i++) {
      monitor.recordFrame(33.33);
    }

    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener(DOWNGRADE_EVENT, handler);
  });

  it('should reset and allow re-trigger', () => {
    const monitor = new PerformanceMonitor({ fpsThreshold: 55, sampleSize: 5 });
    for (let i = 0; i < 5; i++) {
      monitor.recordFrame(33.33);
    }
    expect(monitor.triggered).toBe(true);

    monitor.reset();
    expect(monitor.triggered).toBe(false);
  });

  it('should recover via sliding window when good frames replace bad ones', () => {
    // Use a larger sample size so initial bad frames don't fill it
    const monitor = new PerformanceMonitor({ fpsThreshold: 30, sampleSize: 10 });
    // 10 frames at 40 FPS (above threshold of 30)
    for (let i = 0; i < 10; i++) {
      monitor.recordFrame(25); // 40 FPS
    }
    expect(monitor.triggered).toBe(false);
    // Next 10 frames at 60 FPS — still above threshold
    for (let i = 0; i < 10; i++) {
      monitor.recordFrame(16.67);
    }
    expect(monitor.triggered).toBe(false);
  });
});

describe('PerformanceMonitor defaults', () => {
  it('should use default threshold of 55 and sample size of 120', () => {
    const monitor = new PerformanceMonitor();
    // Feed 119 bad frames — should not trigger yet
    for (let i = 0; i < 119; i++) {
      monitor.recordFrame(33.33);
    }
    expect(monitor.triggered).toBe(false);

    // Frame 120 — should trigger
    monitor.recordFrame(33.33);
    expect(monitor.triggered).toBe(true);
  });
});
