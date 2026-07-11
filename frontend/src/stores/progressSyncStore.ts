type FlushHandler = () => Promise<void>;

const flushHandlers = new Set<FlushHandler>();

export function registerProgressFlush(handler: FlushHandler) {
  flushHandlers.add(handler);

  return () => {
    flushHandlers.delete(handler);
  };
}

export async function flushAllProgress() {
  await Promise.allSettled(Array.from(flushHandlers).map((handler) => handler()));
}
