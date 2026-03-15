# Cross & Connect Waitlist

A Next.js application with Prisma ORM and PostgreSQL database backend for managing a waitlist and tracking campaign URLs.

## 📚 Documentation

- **[Testing Guide](TESTING.md)** - Unit testing with Jest & React Testing Library
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to Vercel or other platforms

## Features

- ⚡ **Next.js 15** with App Router
- 🎨 **Tailwind CSS** for styling
- 📊 **Prisma ORM** for database management
- 🐘 **PostgreSQL** database
- 📝 **TypeScript** for type safety
- 🔍 **ESLint** for code quality

## Getting Started

You can run this project in two ways:
1. **With Docker** (Recommended) - Easiest setup
2. **Without Docker** - Manual PostgreSQL installation

### Option 1: With Docker (Recommended)

#### Prerequisites
- Docker and Docker Compose installed

#### Steps

1. **Start the entire application:**

```bash
docker-compose up
```

This will:
- Start PostgreSQL database in a container
- Build and start the Next.js application
- Automatically run Prisma migrations
- **Seed the database with reference data** (occupations, industries, disciplines, community goals)
- Create default admin user
- Make the app available at [http://localhost:3000](http://localhost:3000)
- Enable hot reload for all code changes (via bind mount)

2. **Stop the application:**

```bash
docker-compose down
```

3. **Stop and remove all data (including database):**

```bash
docker-compose down -v
```

### Option 2: Without Docker

#### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or remote)

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up your database:**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/crossnconnect_waitlist?schema=public"
```

Replace `username`, `password`, `localhost`, and `5432` with your PostgreSQL credentials.

3. **Initialize the database:**

```bash
# Generate Prisma Client
npm run prisma:generate

# Push the schema to your database and seed with reference data
npm run deploy:db

# Or do it step by step:
npm run prisma:push    # Push schema
npm run prisma:seed    # Seed reference data
```

This will create the database schema and populate it with:
- Default admin user (`admin@crossconnect.com` / `C&C_Admin2024!`)
- 5 occupations (Student, Young professional, etc.)
- 10 industries (Tech/IT, Financiën, Marketing, etc.)
- 6 disciplines (Springen, Dressuur, Eventing, etc.)
- 5 community goals (Netwerk, Inspiratie, Plezier, etc.)

⚠️ **Important**: Database seeding is required for the waitlist form to work correctly. Without seeded data, dropdown menus will be empty.

💡 **Reference Data Strategy**: Uses a **code-based approach** for stable, enum-like reference data:
- Codes (e.g., `STUDENT`, `TECH_IT`) are stable identifiers that never change
- Names can be safely updated without creating duplicates
- Custom entries can be added at runtime (unlike database enums)
- `isSystem` flag distinguishes seeded from user-created entries
- TypeScript type safety via [reference-codes.ts](src/lib/reference-codes.ts)

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema changes to database
- `npm run prisma:seed` - Seed database with reference data
- `npm run prisma:migrate-codes` - Migrate existing data to code-based system (one-time)
- `npm run prisma:verify` - Verify reference data codes
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run deploy:db` - Deploy schema and seed data (combined)

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate     # Generate Prisma Client
npm run prisma:push         # Push schema to database
npm run prisma:seed         # Seed reference data
npm run prisma:migrate-slugs # Migrate to slug-based seeding (one-time)
npm run prisma:studio       # Open Prisma Studio GUI
npm run deploy:db           # Deploy schema + seed (combined)

# Internationalization
npm run i18n:extract     # Extract translations from code

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
```

📖 **[View Testing Guide](TESTING.md)** for detailed testing documentation.

## API Routes

### Waitlist

- `GET /api/waitlist` - Get all waitlist entries
- `POST /api/waitlist` - Add new waitlist entry
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe"
  }
  ```

## Docker Commands

```bash
# Start/Stop
docker-compose up           # Start all services
docker-compose up -d        # Start in background
docker-compose down         # Stop services
docker-compose down -v      # Stop and remove data
docker-compose logs -f      # View logs

# Database operations in Docker
docker exec crossnconnect-app npm run prisma:studio    # Open Prisma Studio
docker exec crossnconnect-app npm run prisma:seed      # Re-seed database
docker exec crossnconnect-app npm run deploy:db        # Re-deploy schema + seed
```

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes (waitlist, trackable URLs, auth)
│   ├── backoffice/       # Admin dashboard
│   └── trk/              # URL tracking
├── components/           # React components
├── lib/                  # Utilities & configuration
prisma/
└── schema.prisma         # Database schema
```

## Resources

**Documentation:**
- [Testing Guide](TESTING.md) - Unit testing with Jest
- [Deployment Guide](DEPLOYMENT.md) - Deploy to Vercel

**External:**
- [Next.js](https://nextjs.org/docs) - React framework
- [Prisma](https://www.prisma.io/docs) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling

## License

MIT
