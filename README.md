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

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to database
npm run prisma:studio    # Open Prisma Studio GUI

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
docker-compose up           # Start all services
docker-compose up -d        # Start in background
docker-compose down         # Stop services
docker-compose down -v      # Stop and remove data
docker-compose logs -f      # View logs
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
