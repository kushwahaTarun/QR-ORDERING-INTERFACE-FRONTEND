import { NextResponse } from "next/server";
import { apiBase } from "@/lib/api-base";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  let upstream: Response;
  try {
    upstream = await fetch(`${apiBase()}/v1/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "Cannot reach the restaurant API. Set API_BASE_URL to the Render host with no /v1 on the end.",
      },
      { status: 502 },
    );
  }
  const payload = (await upstream.json().catch(() => ({}))) as {
    token?: string;
    staff?: { restaurantId?: string | null };
    restaurants?: { id: string }[];
    message?: string;
  };

  if (!upstream.ok || !payload.token) {
    return NextResponse.json(
      { message: payload.message ?? "Could not sign in." },
      { status: upstream.status || 401 },
    );
  }

  const response = NextResponse.json({
    staff: payload.staff,
    restaurants: payload.restaurants ?? [],
  });
  response.cookies.set("house_token", payload.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
    secure: process.env.NODE_ENV === "production",
  });

  const selected =
    payload.staff?.restaurantId ??
    (payload.restaurants?.length === 1 ? payload.restaurants[0].id : null);
  if (selected) {
    response.cookies.set("house_restaurant", selected, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}
