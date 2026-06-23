import { getSession } from "@/features/auth/lib/auth";
import { fetchDisplayPanel, fetchAdvisorQueue, fetchAdvisorOffice } from "@/features/tickets/services/ticket.read.service";
import { TICKET_CONFIG } from "@/features/tickets/config/ticket.constants";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const officeId = searchParams.get("officeId");
  const role = searchParams.get("role") || "display";

  // Verify session for advisor role
  if (role === "advisor") {
    const session = await getSession();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // stream may be closed
        }
      };

      // Send initial connection event
      sendEvent({ type: TICKET_CONFIG.SSE.EVENTS.CONNECTED });

      const poll = async () => {
        if (closed) return;
        try {
          let data;
          if (role === "advisor") {
            const session = await getSession();
            if (!session) return;
            const userOffice = await fetchAdvisorOffice(session.id);
            data = await fetchAdvisorQueue(session.id, userOffice);
          } else {
            if (!officeId) return;
            data = await fetchDisplayPanel(officeId);
          }
          sendEvent({ type: TICKET_CONFIG.SSE.EVENTS.QUEUE_UPDATE, ...data });
        } catch {
          // silent — keep the stream alive
        }
      };

      // Initial poll + interval
      poll();
      const interval = setInterval(poll, TICKET_CONFIG.SSE.POLL_INTERVAL_MS);

      request.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(interval);
        try { controller.close(); } catch { /* already closed */ }
      });
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
