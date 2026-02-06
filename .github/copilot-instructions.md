# Cross & Connect Waitlist Project

## Project Overview
Next.js application with Prisma ORM and PostgreSQL database backend for managing a waitlist.

## Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Package Manager**: npm

## Project Setup Status
- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements - Next.js with Prisma and PostgreSQL
- [x] Scaffold the Project - Manual setup completed with all config files
- [x] Customize the Project - Prisma integration with example schema and API routes
- [x] Install Required Extensions - No specific extensions required
- [x] Compile the Project - Dependencies installed successfully, no errors
- [x] Create and Run Task - Development server can be started with `npm run dev`
- [x] Launch the Project - Ready to run (see instructions below)
- [x] Ensure Documentation is Complete - README.md created with full documentation

## Quick Start

### Option 1: With Docker (Recommended)

Simply run:
```bash
docker-compose up
```

This automatically:
- Starts PostgreSQL in a container
- Runs Prisma migrations and seeds admin user
- Starts the development server
- Enables hot reload for code changes
- Opens the app at [http://localhost:3000](http://localhost:3000)

### Option 2: Without Docker

1. **Set up PostgreSQL Database**
   Create a `.env` file with your database connection:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/crossnconnect_waitlist?schema=public"
   ```

2. **Initialize Database**
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000)

## Available Scripts

### Docker Commands
- `docker-compose up` - Start all services (PostgreSQL + Next.js)
- `docker-compose up -d` - Start in detached mode
- `docker-compose down` - Stop all services
- `docker-compose down -v` - Stop and remove all data

### npm Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:studio` - Open Prisma Studio

## API Endpoints
- `GET/POST /api/waitlist` - Waitlist management

## Database Schema
The project uses a simple WaitlistEntry model to store email signups. Customize the schema in `prisma/schema.prisma` as needed.
