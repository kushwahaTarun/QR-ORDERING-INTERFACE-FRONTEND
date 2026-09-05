import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("house_token", "", { path: "/", maxAge: 0 });
  response.cookies.set("house_restaurant", "", { path: "/", maxAge: 0 });
  return response;
}
