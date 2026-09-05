import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("house_token")?.value;
  const isLogin = pathname === "/login";

  if (!token && !isLogin) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    return NextResponse.redirect(login);
  }

  if (token && isLogin) {
    const home = request.nextUrl.clone();
    home.pathname = "/";
    return NextResponse.redirect(home);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
