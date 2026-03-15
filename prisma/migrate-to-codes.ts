/**
 * Data Migration Script: Add codes to existing reference data
 * 
 * Run this ONCE after pushing the new schema with code fields:
 * npm run prisma:migrate-codes
 * 
 * This script:
 * 1. Adds codes to existing Occupation, Industry, Discipline, CommunityGoal records
 * 2. Sets isSystem = true for known system records
 * 3. Generates codes for any custom records (if they exist)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapping van naam → code voor systeem records
const OCCUPATION_CODES: Record<string, string> = {
  'Student': 'STUDENT',
  'Young professional': 'YOUNG_PROFESSIONAL',
  'Ondernemer': 'ENTREPRENEUR',
  'Ruiter': 'RIDER',
  'Werkzaam in de paardensector': 'HORSE_INDUSTRY',
};

const INDUSTRY_CODES: Record<string, string> = {
  'Tech / IT': 'TECH_IT',
  'Financiën': 'FINANCE',
  'Marketing / Communicatie': 'MARKETING',
  'Retail / Verkoop': 'RETAIL',
  'Gezondheidszorg': 'HEALTHCARE',
  'Onderwijs': 'EDUCATION',
  'Horeca': 'HOSPITALITY',
  'Paardensector': 'HORSE_INDUSTRY',
  'Creatief / Media': 'CREATIVE',
  'Overheid': 'GOVERNMENT',
};

const DISCIPLINE_CODES: Record<string, string> = {
  'Springen': 'SHOW_JUMPING',
  'Dressuur': 'DRESSAGE',
  'Eventing': 'EVENTING',
  'Western': 'WESTERN',
  'Recreatief / meerdere disciplines': 'RECREATIONAL',
  'Anders': 'OTHER',
};

const COMMUNITY_GOAL_CODES: Record<string, string> = {
  'Netwerk': 'NETWORK',
  'Inspiratie': 'INSPIRATION',
  'Plezier': 'FUN',
  'Kennis delen': 'SHARE_KNOWLEDGE',
  'Samenwerken aan projecten': 'COLLABORATE',
};

/**
 * Genereer een code uit een naam (voor custom entries)
 */
function generateCode(name: string, existingCodes: string[]): string {
  let code = name
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '')
    .substring(0, 50);
  
  // Als code al bestaat, voeg nummer toe
  let counter = 1;
  let uniqueCode = code;
  while (existingCodes.includes(uniqueCode)) {
    uniqueCode = `${code}_${counter}`;
    counter++;
  }
  
  return uniqueCode;
}

async function main() {
  console.log('🔄 Migreren van reference data naar code-based systeem...\n');

  try {
    // 1. Migreer Occupations
    console.log('📋 Migreren van Occupations...');
    const occupations = await prisma.occupation.findMany();
    const existingOccupationCodes: string[] = [];
    
    for (const occupation of occupations) {
      const code = OCCUPATION_CODES[occupation.name] || generateCode(occupation.name, existingOccupationCodes);
      const isSystem = OCCUPATION_CODES[occupation.name] !== undefined;
      existingOccupationCodes.push(code);
      
      await prisma.occupation.update({
        where: { id: occupation.id },
        data: { code, isSystem },
      });
      
      console.log(`  ✅ ${occupation.name} → ${code} (system: ${isSystem})`);
    }

    // 2. Migreer Industries
    console.log('\n📋 Migreren van Industries...');
    const industries = await prisma.industry.findMany();
    const existingIndustryCodes: string[] = [];
    
    for (const industry of industries) {
      const code = INDUSTRY_CODES[industry.name] || generateCode(industry.name, existingIndustryCodes);
      const isSystem = INDUSTRY_CODES[industry.name] !== undefined;
      existingIndustryCodes.push(code);
      
      await prisma.industry.update({
        where: { id: industry.id },
        data: { code, isSystem },
      });
      
      console.log(`  ✅ ${industry.name} → ${code} (system: ${isSystem})`);
    }

    // 3. Migreer Disciplines
    console.log('\n📋 Migreren van Disciplines...');
    const disciplines = await prisma.discipline.findMany();
    const existingDisciplineCodes: string[] = [];
    
    for (const discipline of disciplines) {
      const code = DISCIPLINE_CODES[discipline.name] || generateCode(discipline.name, existingDisciplineCodes);
const isSystem = DISCIPLINE_CODES[discipline.name] !== undefined;
      existingDisciplineCodes.push(code);
      
      await prisma.discipline.update({
        where: { id: discipline.id },
        data: { code, isSystem },
      });
      
      console.log(`  ✅ ${discipline.name} → ${code} (system: ${isSystem})`);
    }

    // 4. Migreer Community Goals
    console.log('\n📋 Migreren van Community Goals...');
    const communityGoals = await prisma.communityGoal.findMany();
    const existingGoalCodes: string[] = [];
    
    for (const goal of communityGoals) {
      const code = COMMUNITY_GOAL_CODES[goal.name] || generateCode(goal.name, existingGoalCodes);
      const isSystem = COMMUNITY_GOAL_CODES[goal.name] !== undefined;
      existingGoalCodes.push(code);
      
      await prisma.communityGoal.update({
        where: { id: goal.id },
        data: { code, isSystem },
      });
      
      console.log(`  ✅ ${goal.name} → ${code} (system: ${isSystem})`);
    }

    console.log('\n✅ Migratie succesvol afgerond!');
    console.log('\n📝 Volgende stappen:');
    console.log('   1. Run: npm run prisma:seed (om nieuwe code-based seeder te testen)');
    console.log('   2. Verifieer dat alle data correct is in Prisma Studio');
    
  } catch (error) {
    console.error('\n❌ Migratie gefaald:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
