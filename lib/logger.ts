export function logError(context: string, error: unknown, meta?: Record<string, unknown>): void {
  const err = error instanceof Error ? error : new Error(String(error));
  console.error(JSON.stringify({
    level: "error",
    context,
    message: err.message,
    stack: err.stack,
    ...meta,
    timestamp: new Date().toISOString(),
  }));
}
