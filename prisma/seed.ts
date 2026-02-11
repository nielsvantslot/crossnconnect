import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
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

  console.log('Admin user created:', admin.email);
  console.log('Password: C&C_Admin2024!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
