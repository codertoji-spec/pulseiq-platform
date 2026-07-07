import { eventBus } from "@/lib/event-emitter";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode('data: {"type":"CONNECTED"}\n\n')
      );

      const unsubscribe = eventBus.subscribe((data: string) => {
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          unsubscribe();
        }
      });

      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode('data: {"type":"PING"}\n\n')
          );
        } catch {
          clearInterval(pingInterval);
          unsubscribe();
        }
      }, 30000);

      // Cleanup when the stream closes
      return () => {
        clearInterval(pingInterval);
        unsubscribe();
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
