# 🔖 Smart Bookmark App

A modern, real-time bookmark management application built with **Next.js App Router**, **Supabase Authentication**, and **PostgreSQL**, featuring **Google OAuth**, protected routes, and a polished SaaS-style UI.

🔗 Live Demo:  
https://smart-bookmark-app-lime-chi.vercel.app

---

## ✨ Features

- 🔐 Google Authentication (OAuth) using Supabase  
- 🛡 Protected routes (Dashboard accessible only after login)  
- 🔄 Real-time bookmark updates with Supabase Realtime  
- ⚡ Optimistic UI updates (no page refresh needed)  
- ⏳ Loading states & skeleton UI  
- 🚪 Logout functionality  
- 🎨 Responsive, modern UI with Tailwind CSS  
- ☁️ Deployed on Vercel  

---

## 🧱 Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend / Services
- Supabase
  - Authentication (Google OAuth)
  - PostgreSQL Database
  - Realtime subscriptions

### Deployment
- Vercel

---

## 📁 Project Structure

```bash
smart-bookmark-app/
├── app/
│ ├── page.tsx # OAuth callback & root redirect
│ ├── login/
│ │ └── page.tsx # Login page (Google Sign-in)
│ ├── dashboard/
│ │ └── page.tsx # Protected dashboard
│
├── lib/
│ └── supabaseClient.ts # Lazy Supabase client
│
├── public/
├── styles/
├── README.md
└── package.json
```

---

## 🔐 Authentication Flow

1. User clicks **Continue with Google**
2. Google OAuth handled by Supabase
3. Supabase redirects back with tokens in URL hash
4. Root page listens to auth state changes
5. Session is stored and URL hash is cleared
6. User is redirected to `/dashboard`

This ensures a secure and production-ready OAuth flow.

---

## 🛡 Route Protection

- `/login`
  - Redirects to `/dashboard` if user is already logged in
- `/dashboard`
  - Redirects to `/login` if user is not authenticated

This prevents unauthorized access and UI flashing.

---

## 🗃 Database Schema

### `bookmarks` Table

| Column       | Type      |
|--------------|-----------|
| id           | uuid (PK) |
| title        | text      |
| url          | text      |
| user_id      | uuid (FK) |
| created_at   | timestamp |

### Row Level Security (RLS)

```sql
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own bookmarks"
ON bookmarks
FOR ALL
USING (auth.uid() = user_id);
```
# ⚙️ Environment Variables

Local (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
# Production (Vercel)

Add the same variables in:
Vercel → Project → Settings → Environment Variables

# 🔧 Supabase Configuration
Site URL
```url
https://smart-bookmark-app-lime-chi.vercel.app
```
Redirect URLs
```urls
http://localhost:3000
https://smart-bookmark-app-lime-chi.vercel.app
```
# 🚀 Run Locally
```bash
npm install
npm run dev
```
# 🌍 Deployment

1. Push code to GitHub
2. Import project into Vercel
3. Add environment variables
4. Deploy

The app is fully build-safe and production-ready.

# 🧠 Key Highlights

- Correct handling of OAuth redirect hashes
- Lazy initialization of Supabase client
- Build-safe Next.js App Router setup
- Realtime updates with optimistic UI
- Clean auth flow for production apps

# 🚧 Future Enhancements

- Edit bookmarks
- Toast notifications
- Bookmark categories
- PWA support
- Sharing bookmarks
