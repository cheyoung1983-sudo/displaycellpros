import { auth0 } from "./lib/auth0";
import { get } from "@vercel/edge-config";
import { NextResponse } from 'next/server';
import { validateLexicalPayload } from '@/lib/lexical-firewall';

export async function proxy(request: Request) {
  const url = new URL(request.url);

  // Auth0 SDK v4 owns /auth/login, /auth/logout, /auth/callback, /auth/profile,
  // /auth/access-token and /auth/backchannel-logout, and rolls the session cookie
  // on every request. Route everything through it; for non-auth paths this is
  // an effective passthrough carrying any refreshed session cookie forward.
  const auth0Response = await auth0.middleware(request);

  // Handle /welcome and /api/welcome via Edge Config
  if (url.pathname === '/welcome' || url.pathname === '/api/welcome') {
    try {
      const greeting = await get('greeting');
      return NextResponse.json({
        greeting: greeting || "hello world",
        source: "vercel-edge-config-middleware"
      });
    } catch (err) {
      return NextResponse.json({
        greeting: "hello world",
        source: "error-fallback",
        error: String(err)
      });
    }
  }

  // Target Diagnostics Hub and Triage APIs for lexical firewall check
  if (url.pathname.startsWith('/api/diagnostics') || url.pathname.startsWith('/api/triage')) {
    if (['POST', 'PUT'].includes(request.method)) {
      try {
        const payload = await request.clone().json();
        const firewallCheck = validateLexicalPayload(payload);

        if (!firewallCheck.isSafe) {
          console.warn(`[SECURITY ALERT] Payload blocked: ${firewallCheck.reason}`);
          return NextResponse.json({ error: 'Invalid input syntax payload.' }, { status: 400 });
        }
      } catch {
        // Not JSON or empty body
      }
    }
  }

  try {
    return auth0Response;
  } catch (err) {
    console.warn('[Proxy] Processing error, bypassing:', err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static assets
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
