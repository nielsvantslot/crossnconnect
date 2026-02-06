import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { MemberStatus } from '@prisma/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!['PENDING', 'ACCEPTED', 'DENIED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get the member entry
    const existingEntry = await prisma.member.findUnique({
      where: { id },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    // If accepting, set acceptedAt timestamp
    const updateData: { status: MemberStatus; acceptedAt?: Date | null } = { status: status as MemberStatus };
    if (status === 'ACCEPTED') {
      updateData.acceptedAt = new Date();
    } else if (status !== 'ACCEPTED' && existingEntry.acceptedAt) {
      // If moving away from ACCEPTED, clear acceptedAt
      updateData.acceptedAt = null;
    }

    // Update entry status
    const entry = await prisma.member.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(entry);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 }
    );
  }
}
