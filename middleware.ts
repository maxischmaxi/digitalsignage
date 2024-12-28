import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const authResponse = await auth.middleware(req);

  if (req.nextUrl.pathname.startsWith("/auth")) {
    return authResponse;
  }

  const intlRes = intlMiddleware(req);

  for (const [key, value] of authResponse.headers) {
    intlRes.headers.set(key, value);
  }

  return intlRes;
}

export const config = {
  matcher: [
    "/((?!_next/static|api|preview|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
