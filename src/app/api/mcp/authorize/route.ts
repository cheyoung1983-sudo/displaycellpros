import { NextRequest, NextResponse } from 'next/server';
import { startAuthorization } from '@vercel/connect';
import { auth0 } from '@/lib/auth0';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession(req);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serverId = process.env.VERCEL_CONNECT_SERVER_ID;
    if (!serverId) {
      return NextResponse.json({ error: "VERCEL_CONNECT_SERVER_ID not configured" }, { status: 500 });
    }

    // This typically initiates a redirect to the authorization provider
    await startAuthorization(serverId, {
      subject: { type: "user", id: session.user.sub || session.user.email },
      scopes: ["openid", "email", "profile"],
    });

    // Note: startAuthorization might throw a redirect error that Next.js handles,
    // or it might return a response. If it doesn't redirect automatically,
    // you would return a success message here.
    return NextResponse.json({ success: true, message: "Authorization initiated" });
  } catch (err: any) {
    // Check if it's a redirect error (common in Next.js/Vercel functions)
    if (err.digest?.startsWith('NEXT_REDIRECT')) {
      throw err;
    }

    console.error("[MCP Authorize Error]:", err);
    return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
  }
}
