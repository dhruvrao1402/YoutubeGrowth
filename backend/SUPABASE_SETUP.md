# 🚀 Supabase Setup Guide

## **Step 1: Create Supabase Account**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → "Sign up"
3. Create account (GitHub, Google, or email)

## **Step 2: Create New Project**
1. Click "New Project"
2. Choose organization
3. Enter project name: `youtube-craft-tracker`
4. Enter database password (save this!)
5. Choose region (closest to you)
6. Click "Create new project"

## **Step 3: Get API Keys**
1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## **Step 4: Update Environment Variables**
Create/update `backend/.env`:
```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=development
```

## **Step 5: Create Database Table**
1. Go to **Table Editor** in Supabase dashboard
2. Click **New Table**
3. Table name: `videos`
4. Enable **Row Level Security (RLS)**
5. Click **Save**

### **Table Structure**
```sql
-- Run this in SQL Editor
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  playlist TEXT NOT NULL CHECK (playlist IN ('Building', 'Body', 'Mind', 'Reflections')),
  script JSONB NOT NULL,
  sound JSONB NOT NULL,
  experience_inputs JSONB NOT NULL,
  distribution_metrics JSONB DEFAULT '{}',
  craft_score INTEGER,
  experience_score INTEGER,
  delta_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for now)
CREATE POLICY "Allow all operations" ON videos FOR ALL USING (true);
```

## **Step 6: Test Connection**
1. Start backend: `npm run dev`
2. Test health endpoint: ` http://localhost:5000/health`
3. Should see: `{"status":"healthy","database":"connected"}`

## **Step 7: Test API Endpoints**
- `GET /` - Basic info
- `GET /health` - Database connection
- `GET /api/videos` - List videos
- `POST /api/videos` - Create video
- `GET /api/videos/stats/analytics` - Get analytics

## **🎯 What This Gives You**
- ✅ **No local database installation**
- ✅ **Free tier: 500MB database, 50MB file storage**
- ✅ **Real-time subscriptions** (can add later)
- ✅ **Built-in authentication** (can add later)
- ✅ **Great dashboard** for data management
- ✅ **Automatic backups**

## **🔧 Troubleshooting**
- **"Invalid API key"**: Check your `.env` file
- **"Table doesn't exist"**: Run the SQL commands above
- **"RLS policy"**: Make sure RLS is enabled and policy created
- **"Connection failed"**: Check your Supabase URL

## **📱 Next Steps**
Once working:
1. Add real-time subscriptions
2. Add user authentication
3. Add file uploads for video thumbnails
4. Add data export/import
