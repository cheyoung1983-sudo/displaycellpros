import { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

const handler = typeof auth0.handleAuth === 'function' 
  ? auth0.handleAuth() 
  : () => new Response(JSON.stringify({ ok: true }), { status: 200 });

export async function GET(request: NextRequest, { params }: { params: Promise<any> }) {
  try {
    const resolvedParams = await params;
    return await handler(request, resolvedParams);
  } catch (err) {
    console.warn('[Auth0 Route] Auth error:', err);
    return new Response(JSON.stringify({ error: 'Auth handler error' }), { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<any> }) {
  try {
    const resolvedParams = await params;
    return await handler(request, resolvedParams);
  } catch (err) {
    console.warn('[Auth0 Route] Auth error:', err);
    return new Response(JSON.stringify({ error: 'Auth handler error' }), { status: 500 });
  }
}

