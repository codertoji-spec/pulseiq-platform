import { eventBus } from "@/lib/event-emitter";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial ping
      controller.enqueue(encoder.encode("data: {\"type\":\"CONNECTED\"}\n\n"));

      // Subscribe to event bus
      const unsubscribe = eventBus.subscribe((data: string) => {
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          // stream closed
          unsubscribe();
        }
      });

      // Keep-alive ping every 30 seconds
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode("data: {\"type\":\"PING\"}\n\n"));
        } catch {
          clearInterval(pingInterval);
          unsubscribe();
        }
      }, 30000);

      // Clean up when stream is cancelled
      const originalCancel = stream.cancel?.bind(stream);
      stream.cancel = async (reason?: unknown) => {
        clearInterval(pingInterval);
        unsubscribe();
        if (originalCancel) await originalCancel(reason);
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
