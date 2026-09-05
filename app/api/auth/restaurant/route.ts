import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { id?: string };
  const response = NextResponse.json({ ok: true, id: body.id ?? null });
  if (!body.id) {
    response.cookies.set("house_restaurant", "", { path: "/", maxAge: 0 });
    return response;
  }
  response.cookies.set("house_restaurant", body.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
