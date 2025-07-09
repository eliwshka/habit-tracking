import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // You can add logic here to process or store the message
    return NextResponse.json({ status: 'ok', received: body });
  } catch (error) {
    return NextResponse.json({ status: 'error', error: (error as Error).message }, { status: 400 });
  }
} 