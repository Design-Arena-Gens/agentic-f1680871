import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data?.idea || typeof data.idea !== 'string' || !data.idea.trim()) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 });
    }

    console.log('Survey submission:', {
      name: data.name || null,
      email: data.email || null,
      category: data.category || null,
      budget: data.budget || null,
      urgency: data.urgency || null,
      details: data.details || null,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
