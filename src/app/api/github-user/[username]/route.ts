import { getUserData } from '@/lib/github-service';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  try {
    const res = await getUserData(username);
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}
