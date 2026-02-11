# Cross & Connect Waitlist

A Next.js application with Prisma ORM and PostgreSQL database backend.

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
- Seed the admin user
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

3. **Initialize Prisma:**

```bash
# Generate Prisma Client
npm run prisma:generate

# Push the schema to your database
npm run prisma:push
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema changes to database
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Testing

This project includes comprehensive unit tests using Jest and React Testing Library.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

For detailed testing documentation, best practices, and examples, see [TESTING.md](TESTING.md).

### Test Coverage

The test suite includes:
- ✅ Component tests for UI components (WaitlistForm, Button, Input)
- ✅ API route tests with mocked database calls
- ✅ Utility function tests
- ✅ Comprehensive edge case and error handling tests

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

If you're using Docker:

```bash
# Start all services
docker-compose up

# Start in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build

# Access PostgreSQL directly
docker exec -it crossnconnect-db psql -U postgres -d crossnconnect_waitlist

# Run Prisma commands in the container
docker-compose exec app npm run prisma:studio
docker-compose exec app npm run prisma:seed
```

## Project Structure

```
crossnconnect-waitlist/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   └── lib/
│       └── prisma.ts       # Prisma client singleton
├── .env                    # Environment variables (create this)
├── .env.example            # Example environment variables
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
