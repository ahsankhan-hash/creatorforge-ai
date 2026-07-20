# CreatorForge AI — Workspace Local Setup Guide

Follow these steps to configure, run, and customize the CreatorForge AI SaaS application locally.

---

## 🛠️ Step-by-Step Local Configuration

### 1. Install Dependencies
Before running the Next.js development server, run the following command to download and install all required modules:
```bash
npm install
```

### 2. Configure Environment Variables
Create a file named `.env.local` in the project root directory and add the following keys:
```env
# OpenAI Configuration (Required for AI generation, fallbacks to simulation mode if absent)
OPENAI_API_KEY=your-openai-api-key-here

# Supabase Configurations (Optional, fallbacks to localStorage if absent)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Initialize Database Migrations (Supabase)
If you are linking a Supabase backend to sync accounts, calendar timelines, and folders:
1. Go to your [Supabase Dashboard](https://supabase.com/).
2. Select your project and navigate to the **SQL Editor** tab in the sidebar.
3. Open the file [supabase/migrations/001_initial.sql](supabase/migrations/001_initial.sql) in this directory, copy its entire contents, paste it into the Supabase SQL editor, and click **Run**.
4. This will construct all the required Postgres tables (`profiles`, `projects`, `calendar_entries`) and apply **Row-Level Security (RLS)** policy permissions.

---

## 🚀 Running the App Locally

Start the local development server:
```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

- **Authentication Fallback Note**: If Supabase variables are absent, the application triggers **Demo Mode** using simulated client-side accounts. You can sign up/log in with any mock credentials (your folders and calendar schedules will persist locally inside your browser cache).
