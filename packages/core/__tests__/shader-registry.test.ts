import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getShaderRegistry,
  resetShaderRegistry,
  ShaderPriority,
  type ShaderInstance,
} from '../src/lib/shader-registry';

function makeInstance(
  id: string,
  priority: number,
  lastVisible = Date.now(),
): ShaderInstance {
  return {
    id,
    priority,
    lastVisible,
    onEvict: vi.fn(),
  };
}

describe('ShaderRegistry', () => {
  beforeEach(() => {
    resetShaderRegistry();
  });

  it('should register instances up to the limit', () => {
    const registry = getShaderRegistry();
    for (let i = 0; i < 4; i++) {
      const ok = registry.register(makeInstance(`s${i}`, ShaderPriority.MEDIUM));
      expect(ok).toBe(true);
    }
    expect(registry.activeCount).toBe(4);
  });

  it('should evict lowest-priority instance when over limit', () => {
    const registry = getShaderRegistry();
    const low = makeInstance('low', ShaderPriority.LOW, Date.now() - 5000);
    const meds = Array.from({ length: 3 }, (_, i) =>
      makeInstance(`med${i}`, ShaderPriority.MEDIUM),
    );

    registry.register(low);
    for (const m of meds) registry.register(m);
    expect(registry.activeCount).toBe(4);

    // Register a HIGH priority — should evict LOW
    const high = makeInstance('high', ShaderPriority.HIGH);
    const ok = registry.register(high);
    expect(ok).toBe(true);
    expect(registry.activeCount).toBe(4);
    expect(low.onEvict).toHaveBeenCalledTimes(1);
  });

  it('should reject registration when new instance has lower priority than all existing', () => {
    const registry = getShaderRegistry();
    // Fill with HIGH priority instances
    for (let i = 0; i < 4; i++) {
      registry.register(makeInstance(`h${i}`, ShaderPriority.HIGH));
    }

    // Try to register LOW — should be rejected
    const low = makeInstance('low', ShaderPriority.LOW);
    const ok = registry.register(low);
    expect(ok).toBe(false);
    expect(registry.activeCount).toBe(4);
  });

  it('should unregister instances correctly', () => {
    const registry = getShaderRegistry();
    registry.register(makeInstance('s1', ShaderPriority.MEDIUM));
    registry.register(makeInstance('s2', ShaderPriority.MEDIUM));
    expect(registry.activeCount).toBe(2);

    registry.unregister('s1');
    expect(registry.activeCount).toBe(1);
  });

  it('should prefer evicting older-last-visible among same priority', () => {
    const registry = getShaderRegistry();
    const old = makeInstance('old', ShaderPriority.MEDIUM, Date.now() - 10000);
    const recent = makeInstance('recent', ShaderPriority.MEDIUM, Date.now());
    const others = Array.from({ length: 2 }, (_, i) =>
      makeInstance(`o${i}`, ShaderPriority.MEDIUM, Date.now()),
    );

    registry.register(old);
    registry.register(recent);
    for (const o of others) registry.register(o);

    // Register new — should evict 'old' (same priority, oldest lastVisible)
    const newer = makeInstance('newer', ShaderPriority.MEDIUM);
    registry.register(newer);
    expect(old.onEvict).toHaveBeenCalled();
    expect(recent.onEvict).not.toHaveBeenCalled();
  });

  it('should report canRegister correctly', () => {
    const registry = getShaderRegistry();
    expect(registry.canRegister(ShaderPriority.LOW)).toBe(true);

    // Fill it up with HIGH
    for (let i = 0; i < 4; i++) {
      registry.register(makeInstance(`h${i}`, ShaderPriority.HIGH));
    }

    expect(registry.canRegister(ShaderPriority.LOW)).toBe(false);
    expect(registry.canRegister(ShaderPriority.HIGH)).toBe(true);
  });

  it('should update max instances and evict excess', () => {
    const registry = getShaderRegistry();
    const instances = Array.from({ length: 4 }, (_, i) =>
      makeInstance(`s${i}`, ShaderPriority.MEDIUM, Date.now() - (4 - i) * 1000),
    );
    for (const inst of instances) registry.register(inst);
    expect(registry.activeCount).toBe(4);

    registry.setMaxInstances(2);
    expect(registry.activeCount).toBe(2);
    // The two oldest should have been evicted
    expect(instances[0].onEvict).toHaveBeenCalled();
    expect(instances[1].onEvict).toHaveBeenCalled();
  });

  it('should return singleton instance', () => {
    const r1 = getShaderRegistry();
    const r2 = getShaderRegistry();
    expect(r1).toBe(r2);
  });

  it('should reset properly', () => {
    const registry = getShaderRegistry();
    registry.register(makeInstance('s1', ShaderPriority.MEDIUM));
    expect(registry.activeCount).toBe(1);

    resetShaderRegistry();
    const newRegistry = getShaderRegistry();
    expect(newRegistry.activeCount).toBe(0);
  });
});
