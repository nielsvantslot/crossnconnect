# Quick Deployment Guide

## ✅ Updated for Production

Your app is ready to deploy! I've updated the build script to work with Vercel.

## 🚀 Deploy to Vercel (Free, ~5 minutes)

### Step 1: Create GitHub Repository
```bash
git init
git add .
git commit -m "Ready for deployment"
# Create a new repo on github.com, then:
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com/signup (sign up with GitHub)
2. Click **"Add New" → "Project"**
3. **Import your GitHub repository**
4. Click **"Deploy"** (don't configure anything yet)
5. Wait for the deployment to fail (expected - we need environment variables)

### Step 3: Set Up Free Database (Neon)
1. Go to https://neon.tech (sign up - it's free)
2. Click **"Create Project"**
3. Copy the **Connection String** (starts with `postgresql://...`)

### Step 4: Add Environment Variables
In your Vercel dashboard:
1. Go to **Settings → Environment Variables**
2. Add these three variables:

```env
DATABASE_URL
postgresql://your-neon-connection-string

AUTH_SECRET
Dy9i6UGyIuNEVwxzZi1Ih/P4v9sKE6uA+V1db+TJJmc=

NEXTAUTH_URL
https://your-project-name.vercel.app
```
*(Replace `your-project-name` with your actual Vercel URL)*

### Step 5: Redeploy
1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Click **"Redeploy"**
4. Wait ~2 minutes ⏱️

### Step 6: Create Admin User
After deployment succeeds:
1. Go to your Vercel project
2. Go to **Settings → Functions**
3. Find the build logs or run this locally with production DATABASE_URL:

```bash
# Set your production DATABASE_URL temporarily
$env:DATABASE_URL="your-neon-connection-string"
npm run prisma:seed
```

This creates: `admin@crossconnect.com` / `admin123`

## ✅ Done!

Your app is live at: `https://your-project-name.vercel.app`

- **Public signup**: `/`
- **Admin login**: `/backoffice`

---

## Alternative: Railway (if Vercel doesn't work)

1. Go to https://railway.app
2. Click **"Start a New Project"** → **"Deploy from GitHub"**
3. Select your repo
4. Click **"Add PostgreSQL"** (free tier included)
5. Add environment variables (Railway auto-adds DATABASE_URL)
6. Click **"Deploy"**

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
