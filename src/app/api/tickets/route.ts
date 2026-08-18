import { NextRequest, NextResponse } from 'next/server';
import { query, isDbConfigured } from '@/lib/serverDb';
import { auth0 } from '@/lib/auth0';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await auth0.getSession(req, res);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isDbConfigured()) {
      const result = await query(
        'SELECT * FROM tickets WHERE "userId" IN (SELECT id FROM users WHERE email = $1) ORDER BY "createdAt" DESC',
        [session.user.email]
      );
      return NextResponse.json({ tickets: result.rows });
    }

    return NextResponse.json({ tickets: [] });
  } catch (err: any) {
    console.error("[Get Tickets Error]:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await auth0.getSession(req, res);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { customerName, device, issueType, quotedPrice, tax, discount, total } = body;

    if (isDbConfigured()) {
      // Sync user
      await query("INSERT INTO users (email, name) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING", [session.user.email, session.user.name]);
      const userRes = await query("SELECT id FROM users WHERE email = $1", [session.user.email]);
      const userId = userRes.rows[0]?.id;

      const id = `DSC-${Math.floor(1000 + Math.random() * 9000)}`;
      await query(
        'INSERT INTO tickets (id, "customerName", device, "issueType", status, "quotedPrice", tax, discount, total, "userId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [id, customerName, device, issueType, "open", Number(quotedPrice), Number(tax), Number(discount), Number(total), userId]
      );
      return NextResponse.json({ success: true, id });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Create Ticket Error]:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
