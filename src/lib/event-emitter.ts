/** Simple in-process event emitter for SSE broadcasting */

type Listener = (data: string) => void;

class EventBus {
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(data: string): void {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch {
        // listener may have been removed
      }
    });
  }

  get count(): number {
    return this.listeners.size;
  }
}

const globalForBus = globalThis as typeof globalThis & {
  __pulseiqEventBus?: EventBus;
};

export const eventBus =
  globalForBus.__pulseiqEventBus ?? new EventBus();

if (process.env.NODE_ENV !== "production") {
  globalForBus.__pulseiqEventBus = eventBus;
}
