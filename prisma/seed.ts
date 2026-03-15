import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('C&C_Admin2024!', 10);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@crossconnect.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'admin@crossconnect.com',
      name: 'Admin',
      password: hashedPassword,
    },
  });

  console.log('✅ Admin user created:', admin.email);
  console.log('   Password: C&C_Admin2024!');

  // Seed Occupations (Normalized)
  const occupations = [
    { code: 'STUDENT', name: 'Student', nameEn: 'Student', requiresWorkDetails: true, isSystem: true, order: 1 },
    { code: 'YOUNG_PROFESSIONAL', name: 'Young professional', nameEn: 'Young professional', requiresWorkDetails: true, isSystem: true, order: 2 },
    { code: 'ENTREPRENEUR', name: 'Ondernemer', nameEn: 'Entrepreneur', requiresWorkDetails: true, isSystem: true, order: 3 },
    { code: 'RIDER', name: 'Ruiter', nameEn: 'Rider', requiresWorkDetails: false, isSystem: true, order: 4 },
    { code: 'HORSE_INDUSTRY', name: 'Werkzaam in de paardensector', nameEn: 'Working in horse sector', requiresWorkDetails: false, isSystem: true, order: 5 },
  ];

  for (const occupation of occupations) {
    await prisma.occupation.upsert({
      where: { code: occupation.code },
      update: { 
        name: occupation.name,
        nameEn: occupation.nameEn, 
        requiresWorkDetails: occupation.requiresWorkDetails, 
        order: occupation.order 
      },
      create: occupation,
    });
  }

  console.log(`✅ ${occupations.length} occupations seeded`);

  // Seed Industries (Normalized)
  const industries = [
    { code: 'TECH_IT', name: 'Tech / IT', nameEn: 'Tech / IT', isSystem: true, order: 1 },
    { code: 'FINANCE', name: 'Financiën', nameEn: 'Finance', isSystem: true, order: 2 },
    { code: 'MARKETING', name: 'Marketing / Communicatie', nameEn: 'Marketing / Communication', isSystem: true, order: 3 },
    { code: 'RETAIL', name: 'Retail / Verkoop', nameEn: 'Retail / Sales', isSystem: true, order: 4 },
    { code: 'HEALTHCARE', name: 'Gezondheidszorg', nameEn: 'Healthcare', isSystem: true, order: 5 },
    { code: 'EDUCATION', name: 'Onderwijs', nameEn: 'Education', isSystem: true, order: 6 },
    { code: 'HOSPITALITY', name: 'Horeca', nameEn: 'Hospitality', isSystem: true, order: 7 },
    { code: 'HORSE_INDUSTRY', name: 'Paardensector', nameEn: 'Horse Industry', isSystem: true, order: 8 },
    { code: 'CREATIVE', name: 'Creatief / Media', nameEn: 'Creative / Media', isSystem: true, order: 9 },
    { code: 'GOVERNMENT', name: 'Overheid', nameEn: 'Government', isSystem: true, order: 10 },
  ];

  for (const industry of industries) {
    await prisma.industry.upsert({
      where: { code: industry.code },
      update: { 
        name: industry.name,
        nameEn: industry.nameEn, 
        order: industry.order 
      },
      create: industry,
    });
  }

  console.log(`✅ ${industries.length} industries seeded`);

  // Seed Disciplines
  const disciplines = [
    { code: 'SHOW_JUMPING', name: 'Springen', nameEn: 'Show Jumping', isSystem: true, order: 1 },
    { code: 'DRESSAGE', name: 'Dressuur', nameEn: 'Dressage', isSystem: true, order: 2 },
    { code: 'EVENTING', name: 'Eventing', nameEn: 'Eventing', isSystem: true, order: 3 },
    { code: 'WESTERN', name: 'Western', nameEn: 'Western', isSystem: true, order: 4 },
    { code: 'RECREATIONAL', name: 'Recreatief / meerdere disciplines', nameEn: 'Recreational / multiple disciplines', isSystem: true, order: 5 },
    { code: 'OTHER', name: 'Anders', nameEn: 'Other', isSystem: true, order: 6 },
  ];

  for (const discipline of disciplines) {
    await prisma.discipline.upsert({
      where: { code: discipline.code },
      update: { 
        name: discipline.name,
        nameEn: discipline.nameEn, 
        order: discipline.order 
      },
      create: discipline,
    });
  }

  console.log(`✅ ${disciplines.length} disciplines seeded`);

  // Seed Community Goals
  const communityGoals = [
    { code: 'NETWORK', name: 'Netwerk', nameEn: 'Network', isSystem: true, order: 1 },
    { code: 'INSPIRATION', name: 'Inspiratie', nameEn: 'Inspiration', isSystem: true, order: 2 },
    { code: 'FUN', name: 'Plezier', nameEn: 'Fun', isSystem: true, order: 3 },
    { code: 'SHARE_KNOWLEDGE', name: 'Kennis delen', nameEn: 'Share knowledge', isSystem: true, order: 4 },
    { code: 'COLLABORATE', name: 'Samenwerken aan projecten', nameEn: 'Collaborate on projects', isSystem: true, order: 5 },
  ];

  for (const goal of communityGoals) {
    await prisma.communityGoal.upsert({
      where: { code: goal.code },
      update: { 
        name: goal.name,
        nameEn: goal.nameEn, 
        order: goal.order 
      },
      create: goal,
    });
  }

  console.log(`✅ ${communityGoals.length} community goals seeded`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
