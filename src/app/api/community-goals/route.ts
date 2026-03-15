import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/community-goals
 * Returns all available community goals ordered by display order
 */
export async function GET() {
  try {
    const goals = await prisma.communityGoal.findMany({
      where: { archivedAt: null },  // Only active goals
      orderBy: { order: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        nameEn: true,
        isSystem: true,
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
