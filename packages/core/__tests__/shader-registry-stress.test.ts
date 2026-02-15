import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getShaderRegistry,
  resetShaderRegistry,
  ShaderPriority,
} from '../src/lib/shader-registry';
import type { ShaderInstance } from '../src/lib/shader-registry';

function makeInstance(
  id: string,
  priority: number,
  lastVisible?: number,
): ShaderInstance {
  return {
    id,
    priority,
    lastVisible: lastVisible ?? Date.now() - 5000, // well past grace period
    onEvict: vi.fn(),
  };
}

describe('ShaderRegistry stress tests', () => {
  beforeEach(() => {
    resetShaderRegistry();
  });

  it('should handle rapid registration and unregistration of 100 instances', () => {
    const registry = getShaderRegistry();
    const registered: string[] = [];

    // Register 100 instances rapidly
    for (let i = 0; i < 100; i++) {
      const id = `shader-${i}`;
      const result = registry.register(makeInstance(id, ShaderPriority.MEDIUM));
      if (result) registered.push(id);
    }

    // Only maxInstances should be active (default 4)
    expect(registry.activeCount).toBeLessThanOrEqual(4);

    // Unregister all that were tracked
    for (const id of registered) {
      registry.unregister(id);
    }

    expect(registry.activeCount).toBe(0);
  });

  it('should correctly evict lowest priority during saturation', () => {
    const registry = getShaderRegistry();
    const evictFns: ReturnType<typeof vi.fn>[] = [];

    // Fill to capacity with LOW priority
    for (let i = 0; i < 4; i++) {
      const onEvict = vi.fn();
      evictFns.push(onEvict);
      registry.register({
        id: `low-${i}`,
        priority: ShaderPriority.LOW,
        lastVisible: Date.now() - (10000 + i * 1000),
        onEvict,
      });
    }

    expect(registry.activeCount).toBe(4);

    // Register a HIGH priority — should evict oldest LOW
    const result = registry.register(
      makeInstance('high-0', ShaderPriority.HIGH),
    );

    expect(result).toBe(true);
    expect(registry.activeCount).toBe(4);

    // At least one LOW should have been evicted
    const evictedCount = evictFns.filter((fn) => fn.mock.calls.length > 0).length;
    expect(evictedCount).toBeGreaterThanOrEqual(1);
  });

  it('should handle setMaxInstances during active usage', () => {
    const registry = getShaderRegistry();

    // Fill with 4 instances
    for (let i = 0; i < 4; i++) {
      registry.register(makeInstance(`shader-${i}`, ShaderPriority.MEDIUM));
    }

    expect(registry.activeCount).toBe(4);

    // Reduce max — should evict excess
    registry.setMaxInstances(2);
    expect(registry.activeCount).toBeLessThanOrEqual(2);
  });

  it('should handle duplicate registration attempts (update in place)', () => {
    const registry = getShaderRegistry();
    const instance = makeInstance('shader-dup', ShaderPriority.HIGH);

    const first = registry.register(instance);
    const second = registry.register(instance);

    // Both should succeed — second is an update
    expect(first).toBe(true);
    expect(second).toBe(true);
    expect(registry.activeCount).toBe(1);
  });

  it('should handle unregistering non-existent ids without throwing', () => {
    const registry = getShaderRegistry();

    expect(() => registry.unregister('non-existent')).not.toThrow();
    expect(() => registry.unregister('')).not.toThrow();
  });

  it('should maintain FIFO eviction order among same priority', () => {
    const registry = getShaderRegistry();
    registry.setMaxInstances(2);

    const now = Date.now();
    const oldEvict = vi.fn();
    const newEvict = vi.fn();

    registry.register({
      id: 'old',
      priority: ShaderPriority.MEDIUM,
      lastVisible: now - 10000,
      onEvict: oldEvict,
    });

    registry.register({
      id: 'new',
      priority: ShaderPriority.MEDIUM,
      lastVisible: now - 5000,
      onEvict: newEvict,
    });

    expect(registry.activeCount).toBe(2);

    // Register another MEDIUM — should evict 'old' (oldest lastVisible)
    registry.register(makeInstance('newest', ShaderPriority.MEDIUM));

    expect(registry.activeCount).toBe(2);
    expect(oldEvict).toHaveBeenCalled();
    expect(newEvict).not.toHaveBeenCalled();
  });

  it('should reject low-priority instance when full of high-priority ones', () => {
    const registry = getShaderRegistry();
    registry.setMaxInstances(2);

    registry.register(makeInstance('high-0', ShaderPriority.HIGH));
    registry.register(makeInstance('high-1', ShaderPriority.HIGH));

    // Try to register LOW — should be rejected
    const result = registry.register(
      makeInstance('low-0', ShaderPriority.LOW),
    );
    expect(result).toBe(false);
    expect(registry.activeCount).toBe(2);
  });

  it('should evict from correct priority tier when mixed', () => {
    const registry = getShaderRegistry();
    registry.setMaxInstances(3);

    const lowEvict = vi.fn();
    const medEvict = vi.fn();
    const highEvict = vi.fn();

    registry.register({
      id: 'low',
      priority: ShaderPriority.LOW,
      lastVisible: Date.now() - 10000,
      onEvict: lowEvict,
    });
    registry.register({
      id: 'med',
      priority: ShaderPriority.MEDIUM,
      lastVisible: Date.now() - 10000,
      onEvict: medEvict,
    });
    registry.register({
      id: 'high',
      priority: ShaderPriority.HIGH,
      lastVisible: Date.now() - 10000,
      onEvict: highEvict,
    });

    // Register another MEDIUM — should evict LOW, not MEDIUM or HIGH
    registry.register(makeInstance('med-2', ShaderPriority.MEDIUM));

    expect(lowEvict).toHaveBeenCalled();
    expect(medEvict).not.toHaveBeenCalled();
    expect(highEvict).not.toHaveBeenCalled();
  });
});
