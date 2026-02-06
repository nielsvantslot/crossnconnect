# Quick Deployment Guide

## ✅ Updated for Production

Your app is ready to deploy! Build passes locally.

## � Deploy to Render (Free Forever, ~5 minutes)

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
