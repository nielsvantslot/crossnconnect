import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/waitlist - Get all waitlist entries
export async function GET() {
  try {
    const entries = await prisma.member.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch waitlist entries' },
      { status: 500 }
    );
  }
}

// POST /api/waitlist - Add new waitlist entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate input
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEntry = await prisma.member.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: 'You have already signed up for our waitlist' },
        { status: 409 }
      );
    }

    // Create member entry
    const entry = await prisma.member.create({
      data: {
        email: email.toLowerCase(),
        name,
      },
    });

    return NextResponse.json(
      { 
        message: 'Successfully joined the waitlist!',
        entry 
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}
