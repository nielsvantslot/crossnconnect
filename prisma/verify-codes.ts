/**
 * Verify code-based seeding
 * Quick script to check if codes are correctly set
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📊 Verifying reference data with codes...\n');

  // Check Occupations
  console.log('Occupations:');
  const occupations = await prisma.occupation.findMany({ orderBy: { order: 'asc' } });
  occupations.forEach(o => {
    console.log(`  ✓ [${o.code}] ${o.name} (system: ${o.isSystem})`);
  });

  // Check Industries
  console.log('\nIndustries:');
  const industries = await prisma.industry.findMany({ orderBy: { order: 'asc' } });
  industries.forEach(i => {
    console.log(`  ✓ [${i.code}] ${i.name} (system: ${i.isSystem})`);
  });

  // Check Disciplines
  console.log('\nDisciplines:');
  const disciplines = await prisma.discipline.findMany({ orderBy: { order: 'asc' } });
  disciplines.forEach(d => {
    console.log(`  ✓ [${d.code}] ${d.name} (system: ${d.isSystem})`);
  });

  // Check Community Goals
  console.log('\nCommunity Goals:');
  const goals = await prisma.communityGoal.findMany({ orderBy: { order: 'asc' } });
  goals.forEach(g => {
    console.log(`  ✓ [${g.code}] ${g.name} (system: ${g.isSystem})`);
  });

  console.log('\n✅ All reference data verified!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
