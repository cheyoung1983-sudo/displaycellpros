import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    if (!session || !session.user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json(session.user);
  } catch (err) {
    console.warn('[Profile API] Profile fetch error or unauthenticated:', err);
    return NextResponse.json({ user: null, error: String(err) }, { status: 401 });
  }
}
