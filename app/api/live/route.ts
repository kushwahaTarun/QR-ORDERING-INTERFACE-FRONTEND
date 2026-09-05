import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL ?? "http://127.0.0.1:3001";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const store = await cookies();
  const token = store.get("house_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Sign in to continue." }, { status: 401 });
  }

  const restaurantId = store.get("house_restaurant")?.value;
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "text/event-stream");
  if (restaurantId) {
    headers.set("X-Restaurant-Id", restaurantId);
  }

  const upstream = await fetch(`${API_BASE}/v1/admin/live`, {
    headers,
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
