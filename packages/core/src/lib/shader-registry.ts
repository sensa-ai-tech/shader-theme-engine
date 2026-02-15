/**
 * shader-registry.ts — Global WebGL context manager with priority system
 *
 * Tracks all active shader instances on the page and enforces a maximum
 * context count. When the limit is exceeded, the lowest-priority instance
 * that hasn't been visible recently is evicted to CSS fallback.
 *
 * Uses IntersectionObserver to track visibility timestamps (not for
 * immediate destruction — a grace period prevents scroll-flicker).
 */

export enum ShaderPriority {
  HIGH = 100,
  MEDIUM = 50,
  LOW = 10,
}

export interface ShaderInstance {
  id: string;
  priority: number;
  lastVisible: number;
  /** Called when this instance is evicted to free its context */
  onEvict: () => void;
}

const DEFAULT_MAX_INSTANCES = 4;
const DEFAULT_GRACE_PERIOD_MS = 2000;

class ShaderRegistryImpl {
  private instances = new Map<string, ShaderInstance>();
  private maxInstances: number;
  private gracePeriodMs: number;
  private observer: IntersectionObserver | null = null;
  private elementMap = new Map<string, Element>();

  constructor(
    maxInstances = DEFAULT_MAX_INSTANCES,
    gracePeriodMs = DEFAULT_GRACE_PERIOD_MS,
  ) {
    this.maxInstances = maxInstances;
    this.gracePeriodMs = gracePeriodMs;
  }

  /**
   * Try to register a new shader instance.
   * Returns true if registered, false if eviction was needed but the
   * new instance has lower priority than all existing ones.
   */
  register(instance: ShaderInstance, element?: Element): boolean {
    // If already registered, just update
    if (this.instances.has(instance.id)) {
      this.instances.set(instance.id, instance);
      return true;
    }

    // If under the limit, just add
    if (this.instances.size < this.maxInstances) {
      this.instances.set(instance.id, instance);
      if (element) this.observeElement(instance.id, element);
      return true;
    }

    // Over the limit — try to evict the weakest instance
    const evictCandidate = this.findEvictionCandidate();
    if (!evictCandidate) {
      // All existing instances are higher priority — cannot register
      return false;
    }

    // Check if the new instance deserves the slot
    if (instance.priority < evictCandidate.priority) {
      // New instance is lower priority than all existing — reject
      return false;
    }

    // Evict the candidate
    this.evict(evictCandidate.id);

    // Register the new instance
    this.instances.set(instance.id, instance);
    if (element) this.observeElement(instance.id, element);
    return true;
  }

  /** Unregister an instance (e.g., on component unmount) */
  unregister(id: string): void {
    this.instances.delete(id);
    const element = this.elementMap.get(id);
    if (element && this.observer) {
      this.observer.unobserve(element);
    }
    this.elementMap.delete(id);
  }

  /** Update the visibility timestamp for an instance */
  updateVisibility(id: string): void {
    const instance = this.instances.get(id);
    if (instance) {
      instance.lastVisible = Date.now();
    }
  }

  /** Current number of active instances */
  get activeCount(): number {
    return this.instances.size;
  }

  /** Check if a new instance could be registered */
  canRegister(priority: number): boolean {
    if (this.instances.size < this.maxInstances) return true;
    const candidate = this.findEvictionCandidate();
    return candidate !== null && priority >= candidate.priority;
  }

  /** Update the max instances limit */
  setMaxInstances(max: number): void {
    this.maxInstances = max;
    // Evict excess instances
    while (this.instances.size > this.maxInstances) {
      const candidate = this.findEvictionCandidate();
      if (!candidate) break;
      this.evict(candidate.id);
    }
  }

  /** Reset the registry (useful for testing) */
  reset(): void {
    this.instances.clear();
    this.elementMap.clear();
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private findEvictionCandidate(): ShaderInstance | null {
    const now = Date.now();
    let candidate: ShaderInstance | null = null;

    for (const instance of this.instances.values()) {
      // Only consider instances outside the grace period
      const timeSinceVisible = now - instance.lastVisible;
      if (timeSinceVisible < this.gracePeriodMs) continue;

      if (
        candidate === null ||
        instance.priority < candidate.priority ||
        (instance.priority === candidate.priority &&
          instance.lastVisible < candidate.lastVisible)
      ) {
        candidate = instance;
      }
    }

    // If no candidate found outside grace period, find the absolute lowest
    if (!candidate) {
      for (const instance of this.instances.values()) {
        if (
          candidate === null ||
          instance.priority < candidate.priority ||
          (instance.priority === candidate.priority &&
            instance.lastVisible < candidate.lastVisible)
        ) {
          candidate = instance;
        }
      }
    }

    return candidate;
  }

  private evict(id: string): void {
    const instance = this.instances.get(id);
    if (instance) {
      instance.onEvict();
      this.unregister(id);
    }
  }

  private observeElement(id: string, element: Element): void {
    this.elementMap.set(id, element);

    if (!this.observer && typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              // Find the id for this element
              for (const [instId, el] of this.elementMap.entries()) {
                if (el === entry.target) {
                  this.updateVisibility(instId);
                  break;
                }
              }
            }
          }
        },
        { threshold: 0.1 },
      );
    }

    if (this.observer) {
      this.observer.observe(element);
    }
  }
}

/** Singleton registry instance */
let registryInstance: ShaderRegistryImpl | null = null;

export function getShaderRegistry(): ShaderRegistryImpl {
  if (!registryInstance) {
    registryInstance = new ShaderRegistryImpl();
  }
  return registryInstance;
}

/** Reset the global registry (for testing) */
export function resetShaderRegistry(): void {
  if (registryInstance) {
    registryInstance.reset();
  }
  registryInstance = null;
}

export type { ShaderRegistryImpl };
