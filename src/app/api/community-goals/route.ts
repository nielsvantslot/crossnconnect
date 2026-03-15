import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/community-goals
 * Returns all available community goals ordered by display order
 */
export async function GET(_request: NextRequest) {
  try {
    const goals = await prisma.communityGoal.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        nameEn: true,
      },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Failed to fetch community goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community goals' },
      { status: 500 }
    );
  }
}
