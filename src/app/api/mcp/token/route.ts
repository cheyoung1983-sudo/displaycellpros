import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@vercel/connect';
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

    const token = await getToken(serverId, {
      subject: { type: "user", id: session.user.sub || session.user.email },
      scopes: ["openid", "email", "profile"],
    });

    return NextResponse.json({ token });
  } catch (err: any) {
    console.error("[MCP Token Error]:", err);
    return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
  }
}
