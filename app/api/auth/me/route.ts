import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiBase } from "@/lib/api-base";

export async function GET() {
  const store = await cookies();
  const token = store.get("house_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Sign in to continue." }, { status: 401 });
  }

  const upstream = await fetch(`${apiBase()}/v1/admin/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const payload = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    return NextResponse.json(payload, { status: upstream.status });
  }

  return NextResponse.json({
    ...payload,
    selectedRestaurantId: store.get("house_restaurant")?.value ?? null,
  });
}
