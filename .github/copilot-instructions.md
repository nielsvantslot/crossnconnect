# Cross & Connect Waitlist Project

## Project Overview
Next.js 15 application for managing a waitlist with trackable URLs, admin dashboard, and authentication.

## Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: NextAuth v5
- **Testing**: Jest + React Testing Library
- **Package Manager**: npm

## Key Features
- Public waitlist signup form
- Admin backoffice with authentication
- Trackable URL campaigns with click analytics
- Member management dashboard
- Responsive UI with dark mode support

## Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth configuration
│   │   ├── waitlist/              # Waitlist CRUD operations
│   │   └── trackable-urls/        # URL tracking & analytics
│   ├── backoffice/                # Admin dashboard (protected)
│   │   ├── dashboard/             # Analytics overview
│   │   ├── members/               # Member management
│   │   ├── waitlist/              # Waitlist management
│   │   └── trackable-urls/        # URL campaign management
│   └── trk/[slug]/                # Public URL redirect & tracking
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── waitlist-form.tsx          # Public waitlist form
│   └── sidebar.tsx                # Admin navigation
└── lib/
    ├── auth.ts                    # NextAuth configuration
    ├── prisma.ts                  # Prisma client singleton
    └── utils.ts                   # Utility functions
```

## Database Schema (Prisma)
- **Member** - Waitlist signups with email/name
- **Admin** - Admin users with hashed passwords
- **TrackableUrl** - URL campaigns with unique slugs
- **Click** - Click tracking with IP, user agent, referrer

## API Routes
- `GET/POST /api/waitlist` - Public waitlist management
- `GET/POST /api/waitlist/[id]` - Individual member operations (protected)
- `GET/POST /api/trackable-urls` - URL campaigns (protected)
- `DELETE /api/trackable-urls/[id]` - Delete campaigns (protected)
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

## Development

**Start Development:**
```bash
docker-compose up              # With Docker (recommended)
npm run dev                    # Without Docker
```

**Testing:**
```bash
npm test                       # Run all tests
npm run test:watch             # Watch mode
npm run test:coverage          # Coverage report
```

**Database:**
```bash
npm run prisma:studio          # GUI for database
npm run prisma:push            # Push schema changes
npm run prisma:generate        # Generate Prisma client
```

## Authentication
- Default admin: `admin@crossconnect.com` / `C&C_Admin2024!`
- Protected routes use NextAuth middleware
- Session-based authentication with JWT

## Testing
- 58 unit tests covering components, API routes, and utilities
- Mocked Prisma and NextAuth for isolated testing
- See [TESTING.md](../TESTING.md) for details

## Environment Variables
Required in `.env`:
```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

## Code Patterns & Conventions
- Server components by default, `'use client'` only when needed
- API routes use NextRequest/NextResponse
- Prisma transactions for data consistency
- shadcn/ui for consistent component styling
- Tailwind utility classes with cn() helper
- TypeScript strict mode enabled

