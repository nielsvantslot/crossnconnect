# Quick Deployment Guide

## ✅ Updated for Production

Your app is ready to deploy! Build passes locally.

## 🔄 Migrating Existing Deployment?

**If you have an existing deployment with data**, you need to migrate to the new code-based reference data:

1. Backup your database first!
2. Run migration script with your production DATABASE_URL:
   ```bash
   DATABASE_URL="your-production-db-url" npm run prisma:migrate-codes
   ```
3. Verify migration:
   ```bash
   DATABASE_URL="your-production-db-url" npm run prisma:verify
   ```

**Fresh deployment?** Continue below ⬇️

## 🚀 Deploy to Vercel (Recommended, ~3 minutes)

### Step 1: Set Up Database
1. Create a PostgreSQL database (options: Vercel Postgres, Neon, Supabase, Railway)
2. Get your connection string (format: `postgresql://user:pass@host:5432/dbname`)

### Step 2: Deploy to Vercel
1. Go to https://vercel.com and sign in
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`

### Step 3: Add Environment Variables
Before deploying, add these in Vercel project settings:

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
AUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-app.vercel.app
NODE_ENV=production
```

Generate AUTH_SECRET locally:
```bash
openssl rand -base64 32
```

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait ~2 minutes for build
3. After deployment, update `NEXTAUTH_URL` with your actual Vercel URL

### Step 5: Initialize Database
⚠️ **IMPORTANT**: This step is required to create database tables and seed reference data (occupations, industries, disciplines, community goals).

Run locally with production database URL:

**PowerShell (Windows):**
```powershell
$env:DATABASE_URL="your-production-database-url"
npm run deploy:db
```

**Bash (Mac/Linux):**
```bash
DATABASE_URL="your-production-database-url" npm run deploy:db
```

This will:
1. ✅ Create all database tables
2. ✅ Seed reference data (occupations, industries, etc.)
3. ✅ Create admin user

**Default admin credentials:**
- Email: `admin@crossconnect.com`
- Password: `C&C_Admin2024!`

## ✅ Done!

Your app is live at: `https://your-app.vercel.app`

---

## 🏗️ Deploy to Render (Free Forever, ~5 minutes)

Render offers permanent free hosting with PostgreSQL included.

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push
```

### Step 2: Create PostgreSQL Database
1. Go to https://render.com (sign up free)
2. Click **"New +"** → **"PostgreSQL"**
3. Name: `crossnconnect-db`
4. Database: `crossnconnect_waitlist`
5. User: `crossnconnect`
6. Region: Choose closest to you
7. Click **"Create Database"**
8. Copy the **"Internal Database URL"** (starts with `postgresql://`)

### Step 3: Deploy Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `crossnconnect-waitlist`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 4: Add Environment Variables
In the web service settings, add these environment variables:

```env
DATABASE_URL=<paste-your-internal-database-url-here>
AUTH_SECRET=Dy9i6UGyIuNEVwxzZi1Ih/P4v9sKE6uA+V1db+TJJmc=
NEXTAUTH_URL=https://your-app-name.onrender.com
NODE_ENV=production
```

**Replace** `NEXTAUTH_URL` with your actual Render URL (shown after deployment starts)

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait ~5 minutes for build and deploy
3. Service will auto-deploy

### Step 6: Initialize Database
⚠️ **IMPORTANT**: This step is required to create database tables and seed reference data.

After deployment completes, run locally with your production database:

**PowerShell (Windows):**
```powershell
# Use the DATABASE_URL you copied earlier
$env:DATABASE_URL="postgresql://your-render-connection-string"
npm run deploy:db
```

**Bash (Mac/Linux):**
```bash
DATABASE_URL="postgresql://your-render-connection-string" npm run deploy:db
```

This will:
1. ✅ Create all database tables
2. ✅ Seed reference data (occupations, industries, disciplines, community goals)
3. ✅ Create admin user

**Admin credentials:**
- Email: `admin@crossconnect.com`
- Password: `C&C_Admin2024!`

## ✅ Done!

Your app is live at: `https://your-app-name.onrender.com`

- **Public signup**: `/`
- **Admin login**: `/backoffice`

**Note**: Free tier sleeps after 15min of inactivity. First request after sleep takes ~30s.

---

## 📦 Architecture Notes

### Edge Function Optimization
The middleware has been optimized for Edge Runtime:
- **`middleware.ts`** imports lightweight auth from `auth-config.ts` (no Prisma/bcrypt)
- **`auth.ts`** contains full NextAuth config with database for API routes
- This keeps middleware under the 1 MB Edge Function limit

### Files Structure
- `/src/middleware.ts` - Route protection (Edge Runtime)
- `/src/lib/auth-config.ts` - Minimal auth for middleware
- `/src/lib/auth.ts` - Full auth with Prisma for API routes

---

## 🔧 Troubleshooting

### "No options available" in signup form dropdowns

**Problem**: Form dropdowns (occupation, industry, disciplines, etc.) are empty.

**Solution**: Database needs to be seeded with reference data.

```powershell
# Set your production database URL
$env:DATABASE_URL="postgresql://your-production-url"

# Run database initialization
npm run deploy:db
```

This seeds:
- 5 Occupations (Student, Entrepreneur, Rider, etc.)
- 10 Industries (Tech/IT, Finance, Marketing, etc.)
- 6 Disciplines (Show Jumping, Dressage, Eventing, etc.)
- 5 Community Goals (Network, Inspiration, Fun, etc.)
- 1 Admin user

### Build fails with Prisma error

**Problem**: `Error: Prisma Client could not find a schema.prisma`

**Solution**:
- Ensure DATABASE_URL is set in environment variables
- Check connection string format: `postgresql://user:pass@host:5432/dbname`
- Verify database is accessible from your deployment platform

### Can't login to admin

**Problem**: Invalid credentials or "User not found"

**Solution**:
1. Verify database was seeded:
   ```powershell
   $env:DATABASE_URL="your-db-url"
   npm run prisma:studio
   ```
   Check if Admin table has a record.

2. Re-run seeder if needed:
   ```powershell
   npm run deploy:db
   ```

**Default credentials:**
- Email: `admin@crossconnect.com`
- Password: `C&C_Admin2024!`

### 404 on /backoffice

**Problem**: Admin pages return 404

**Solution**:
- Check deployment logs for build errors
- Ensure all files are committed to Git and pushed
- Verify the build succeeded on your hosting platform

### Slow first request (Render Free Tier)

**Expected behavior**: Free tier services sleep after 15 minutes of inactivity. First request takes ~30 seconds to wake up.

---

## 🔑 Database Commands Reference

```bash
# Deploy database (schema + seed)
npm run deploy:db

# Only push schema changes
npm run prisma:push

# Only run seeder
npm run prisma:seed

# Migrate existing data to code-based system (one-time)
npm run prisma:migrate-codes

# Verify reference data codes
npm run prisma:verify

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Generate Prisma Client
npm run prisma:generate
```

---

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)

