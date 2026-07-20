-- Users profile table (linked to Auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  theme_preference TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- Keep UUID references simple for Local/Supabase switch
  name TEXT NOT NULL,
  niche TEXT DEFAULT 'General',
  status TEXT DEFAULT 'active',
  titles JSONB DEFAULT '[]',
  description TEXT DEFAULT '',
  thumbnail_concepts JSONB DEFAULT '[]',
  script_outline JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar entries table
CREATE TABLE IF NOT EXISTS public.calendar_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'Idea', -- 'Idea' | 'Scripting' | 'Filming' | 'Editing' | 'Published'
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_entries ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow users to view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Allow users to insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Projects Policies
CREATE POLICY "Allow users to view own projects" 
  ON public.projects FOR SELECT 
  USING (auth.uid() = user_id::uuid);

CREATE POLICY "Allow users to insert own projects" 
  ON public.projects FOR INSERT 
  WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Allow users to update own projects" 
  ON public.projects FOR UPDATE 
  USING (auth.uid() = user_id::uuid);

CREATE POLICY "Allow users to delete own projects" 
  ON public.projects FOR DELETE 
  USING (auth.uid() = user_id::uuid);

-- Calendar Entries Policies
CREATE POLICY "Allow users to view own calendar entries" 
  ON public.calendar_entries FOR SELECT 
  USING (auth.uid() = user_id::uuid);

CREATE POLICY "Allow users to insert own calendar entries" 
  ON public.calendar_entries FOR INSERT 
  WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Allow users to update own calendar entries" 
  ON public.calendar_entries FOR UPDATE 
  USING (auth.uid() = user_id::uuid);

CREATE POLICY "Allow users to delete own calendar entries" 
  ON public.calendar_entries FOR DELETE 
  USING (auth.uid() = user_id::uuid);
