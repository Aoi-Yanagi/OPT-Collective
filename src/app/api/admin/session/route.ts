import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const { accessKey } = await req.json();
    const expectedKey = process.env.OPT_ADMIN_ACCESS_KEY || 'opt-local-dev-key-2026';

    if (!accessKey || accessKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Invalid Merchant Access Key.' },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_SESSION_COOKIE, expectedKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 12, // 12-hour merchant session
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_SESSION_COOKIE);
  return res;
}