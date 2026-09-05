import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL ?? "http://127.0.0.1:3001";

export async function GET() {
  const store = await cookies();
  const token = store.get("house_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Sign in to continue." }, { status: 401 });
  }

  const upstream = await fetch(`${API_BASE}/v1/admin/auth/me`, {
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
