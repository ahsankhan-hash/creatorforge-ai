# CreatorForge AI — Production Deployment Guide

Follow these simple steps to deploy your CreatorForge AI SaaS MVP online to Vercel in minutes.

---

## 🚀 Deploying to Vercel (Recommended)

Next.js is designed by Vercel and pairs perfectly with its hosting infrastructure.

### Step 1: Push Code to GitHub / GitLab
Create a new repository on your GitHub account and push the workspace code:
```bash
git init
git add .
git commit -m "feat: initial SaaS CreatorAI Hub MVP release"
git branch -M main
git remote add origin https://github.com/your-profile/creatorforge-ai.git
git push -u origin main
```

### Step 2: Import Project on Vercel
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** → **Project**.
3. Import your `creatorforge-ai` repository.

### Step 3: Configure Environment Variables
In the Vercel project configuration panel, expand the **Environment Variables** section and add:
- `OPENAI_API_KEY`: Your production OpenAI secret key (e.g. `sk-...`).
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase API endpoint.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon public key.

*Note: If you leave Supabase keys blank, Vercel will deploy the app in fully functioning LocalStorage Demo Mode, letting reviewers inspect features without database connection requirements.*

### Step 4: Click Deploy 🚀
Vercel will compile the code and provide a secure public URL (e.g. `https://creatorforge-ai.vercel.app`) in under 2 minutes.

---

## ⚡ Production Verification Checklist
Once deployed, verify the following steps:
1. Try signing up with a new test account.
2. Generate titles using the "Psychology" niche dropdown.
3. Verify the generated titles can be copied to the clipboard and saved to a new folder.
4. Go to Content Calendar, select a date, and add an upload schedule.
5. Check if toggling Light / Dark mode works seamlessly on all routes.
