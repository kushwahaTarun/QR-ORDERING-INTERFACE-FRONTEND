import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { apiBase } from "@/lib/api-base";

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const store = await cookies();
  const token = store.get("house_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Sign in to continue." }, { status: 401 });
  }

  const search = request.nextUrl.search;
  const url = `${apiBase()}/v1/${path.join("/")}${search}`;
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  const restaurantId = store.get("house_restaurant")?.value;
  if (restaurantId) {
    headers.set("X-Restaurant-Id", restaurantId);
  }
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const upstream = await fetch(url, {
    method: request.method,
    headers,
    body: hasBody ? await request.text() : undefined,
    cache: "no-store",
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const PUT = proxy;
