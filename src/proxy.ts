import { get } from "@vercel/edge-config";
import { NextResponse } from 'next/server';
import { validateLexicalPayload } from '@/lib/lexical-firewall';
import { auth0 } from '@/lib/auth0';

function withAuthCookies(response: NextResponse, authResponse: NextResponse) {
  authResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  return response;
}

function applySecurityHeaders(response: NextResponse) {
  if (process.env.NODE_ENV === 'production') {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.google-analytics.com https://vercel.live https://*.vercel.live https://*.auth0.com",
      "connect-src 'self' https://*.google.com https://*.google-analytics.com https://vercel.live https://*.vercel.live https://*.auth0.com https://displaycellpros.us.auth0.com wss://*.vercel.live",
      "img-src 'self' data: blob: https://*.google.com https://*.google-analytics.com https://*.gstatic.com https://*.auth0.com https://*.githubusercontent.com https://picsum.photos https://*.picsum.photos https://images.unsplash.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "frame-src 'self' https://vercel.live https://*.vercel.live https://*.auth0.com",
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);
  }

  return response;
}

export async function proxy(request: Request) {
  const url = new URL(request.url);

  // Auth0 v4 mounts /auth/login, /auth/logout, /auth/callback, /auth/profile,
  // and /auth/access-token entirely through this middleware call -- there's
  // no per-route handler like the old v3 handleAuth() catch-all.
  const authResponse = await auth0.middleware(request);
  if (url.pathname.startsWith('/auth/')) {
    return applySecurityHeaders(authResponse);
  }

  // Handle /api/welcome via Edge Config
  if (url.pathname === '/api/welcome') {
    try {
      const greeting = await get('greeting');
      return withAuthCookies(applySecurityHeaders(NextResponse.json({
        greeting: greeting || "hello world",
        source: "vercel-edge-config-middleware"
      })), authResponse);
    } catch (err) {
      return withAuthCookies(applySecurityHeaders(NextResponse.json({
        greeting: "hello world",
        source: "error-fallback",
        error: String(err)
      })), authResponse);
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
          return withAuthCookies(applySecurityHeaders(NextResponse.json({ error: 'Invalid input syntax payload.' }, { status: 400 })), authResponse);
        }
      } catch {
        // Not JSON or empty body
      }
    }
  }

  try {
    return withAuthCookies(applySecurityHeaders(NextResponse.next()), authResponse);
  } catch (err) {
    console.warn('[AI Studio] Proxy processing error, bypassing:', err);
    return withAuthCookies(applySecurityHeaders(NextResponse.next()), authResponse);
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
