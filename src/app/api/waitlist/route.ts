import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
import { sanitizeEmail, sanitizeString, isValidEmail, isValidName } from '@/lib/sanitize';

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
    // Rate limiting: 5 requests per minute per IP
    const identifier = getRateLimitIdentifier(request);
    if (!rateLimit(identifier, 5, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, name } = body;

    // Validate input
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedName = sanitizeString(name);

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate name format
    if (!isValidName(sanitizedName)) {
      return NextResponse.json(
        { error: 'Invalid name format. Please use only letters, spaces, hyphens, and apostrophes.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEntry = await prisma.member.findUnique({
      where: { email: sanitizedEmail },
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
        email: sanitizedEmail,
        name: sanitizedName,
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
