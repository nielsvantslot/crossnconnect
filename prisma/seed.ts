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
    { name: 'Student', nameEn: 'Student', requiresWorkDetails: true, order: 1 },
    { name: 'Young professional', nameEn: 'Young professional', requiresWorkDetails: true, order: 2 },
    { name: 'Ondernemer', nameEn: 'Entrepreneur', requiresWorkDetails: true, order: 3 },
    { name: 'Ruiter', nameEn: 'Rider', requiresWorkDetails: false, order: 4 },
    { name: 'Werkzaam in de paardensector', nameEn: 'Working in horse sector', requiresWorkDetails: false, order: 5 },
  ];

  for (const occupation of occupations) {
    await prisma.occupation.upsert({
      where: { name: occupation.name },
      update: { nameEn: occupation.nameEn, requiresWorkDetails: occupation.requiresWorkDetails, order: occupation.order },
      create: occupation,
    });
  }

  console.log(`✅ ${occupations.length} occupations seeded`);

  // Seed Industries (Normalized)
  const industries = [
    { name: 'Tech / IT', nameEn: 'Tech / IT', order: 1 },
    { name: 'Financiën', nameEn: 'Finance', order: 2 },
    { name: 'Marketing / Communicatie', nameEn: 'Marketing / Communication', order: 3 },
    { name: 'Retail / Verkoop', nameEn: 'Retail / Sales', order: 4 },
    { name: 'Gezondheidszorg', nameEn: 'Healthcare', order: 5 },
    { name: 'Onderwijs', nameEn: 'Education', order: 6 },
    { name: 'Horeca', nameEn: 'Hospitality', order: 7 },
    { name: 'Paardensector', nameEn: 'Horse Industry', order: 8 },
    { name: 'Creatief / Media', nameEn: 'Creative / Media', order: 9 },
    { name: 'Overheid', nameEn: 'Government', order: 10 },
  ];

  for (const industry of industries) {
    await prisma.industry.upsert({
      where: { name: industry.name },
      update: { nameEn: industry.nameEn, order: industry.order },
      create: industry,
    });
  }

  console.log(`✅ ${industries.length} industries seeded`);

  // Seed Disciplines
  const disciplines = [
    { name: 'Springen', nameEn: 'Show Jumping', order: 1, isPredefined: true },
    { name: 'Dressuur', nameEn: 'Dressage', order: 2, isPredefined: true },
    { name: 'Eventing', nameEn: 'Eventing', order: 3, isPredefined: true },
    { name: 'Western', nameEn: 'Western', order: 4, isPredefined: true },
    { name: 'Recreatief / meerdere disciplines', nameEn: 'Recreational / multiple disciplines', order: 5, isPredefined: true },
    { name: 'Anders', nameEn: 'Other', order: 6, isPredefined: true },
  ];

  for (const discipline of disciplines) {
    await prisma.discipline.upsert({
      where: { name: discipline.name },
      update: { nameEn: discipline.nameEn, order: discipline.order, isPredefined: discipline.isPredefined },
      create: discipline,
    });
  }

  console.log(`✅ ${disciplines.length} disciplines seeded`);

  // Seed Community Goals
  const communityGoals = [
    { name: 'Netwerk', nameEn: 'Network', order: 1 },
    { name: 'Inspiratie', nameEn: 'Inspiration', order: 2 },
    { name: 'Plezier', nameEn: 'Fun', order: 3 },
    { name: 'Kennis delen', nameEn: 'Share knowledge', order: 4 },
    { name: 'Samenwerken aan projecten', nameEn: 'Collaborate on projects', order: 5 },
  ];

  for (const goal of communityGoals) {
    await prisma.communityGoal.upsert({
      where: { name: goal.name },
      update: { nameEn: goal.nameEn, order: goal.order },
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
