import { getUserData } from '@/lib/github-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const username = pathname.split('/').pop();

  try {
    const res = await getUserData(username!);
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}
