import { get } from "@vercel/edge-config";
import { NextResponse } from 'next/server';
import { validateLexicalPayload } from '@/lib/lexical-firewall';

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

  // Handle /api/welcome via Edge Config
  if (url.pathname === '/api/welcome') {
    try {
      const greeting = await get('greeting');
      return applySecurityHeaders(NextResponse.json({
        greeting: greeting || "hello world",
        source: "vercel-edge-config-middleware"
      }));
    } catch (err) {
      return applySecurityHeaders(NextResponse.json({
        greeting: "hello world",
        source: "error-fallback",
        error: String(err)
      }));
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
          return applySecurityHeaders(NextResponse.json({ error: 'Invalid input syntax payload.' }, { status: 400 }));
        }
      } catch {
        // Not JSON or empty body
      }
    }
  }

  try {
    // Auth0 middleware is handled via handleAuth() routes in Next.js 13+ App Router
    // for standard authentication flows. 
    return applySecurityHeaders(NextResponse.next());
  } catch (err) {
    console.warn('[AI Studio] Proxy processing error, bypassing:', err);
    return applySecurityHeaders(NextResponse.next());
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
