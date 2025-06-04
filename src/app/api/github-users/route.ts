import { getUsers } from '@/lib/github-service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username') || 'paramsinghvc';
  const depth = parseInt(searchParams.get('depth') || '1', 10);

  try {
    const result = await getUsers(username, depth);
    return Response.json(result);
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
    });
  }
}
