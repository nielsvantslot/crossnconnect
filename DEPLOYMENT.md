# Quick Deployment Guide

## ✅ Updated for Production

Your app is ready to deploy! Build passes locally.

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
Run locally to create tables and seed admin:

```bash
$env:DATABASE_URL="your-production-database-url"
npm run prisma:push
```

**Default admin**: `admin@crossconnect.com` / `admin123`

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
After deployment completes, run locally:

```bash
# Use the DATABASE_URL you copied earlier
$env:DATABASE_URL="postgresql://your-render-connection-string"
npm run prisma:push
npm run prisma:seed
```

This creates: `admin@crossconnect.com` / `admin123`

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

## Troubleshooting

**Build fails with Prisma error?**
- Make sure DATABASE_URL is set in Vercel environment variables
- Check that the connection string is correct

**Can't login to admin?**
- Run the seed script with production DATABASE_URL
- Verify admin user exists in database

**404 on /backoffice?**
- Check Vercel deployment logs for errors
- Ensure all files are committed to GitHub
