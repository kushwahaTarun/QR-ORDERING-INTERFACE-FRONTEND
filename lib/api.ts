export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parse(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as {
    message?: string;
  };
  if (!response.ok) {
    throw new ApiError(
      payload.message ?? "Something went wrong. Try again.",
      response.status,
    );
  }
  return payload;
}

export async function houseGet<T>(path: string): Promise<T> {
  const response = await fetch(`/api/house${path}`, {
    cache: "no-store",
    credentials: "include",
  });
  return parse(response) as Promise<T>;
}

export async function houseSend<T>(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<T> {
  const response = await fetch(`/api/house${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return parse(response) as Promise<T>;
}

export async function loginRequest(email: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parse(response) as Promise<{
    staff: import("./types").Staff;
    restaurants: import("./types").RestaurantRef[];
  }>;
}

export async function logoutRequest() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}

export async function meRequest() {
  const response = await fetch("/api/auth/me", {
    cache: "no-store",
    credentials: "include",
  });
  return parse(response) as Promise<{
    staff: import("./types").Staff;
    restaurants: import("./types").RestaurantRef[];
    selectedRestaurantId: string | null;
  }>;
}

export async function selectRestaurantRequest(id: string | null) {
  const response = await fetch("/api/auth/restaurant", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return parse(response);
}
