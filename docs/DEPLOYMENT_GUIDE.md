# 🚀 CampusConnect Deployment Guide (Vercel + Render)

This guide provides step-by-step instructions to deploy **CampusConnect**:
- **Frontend (React + Vite + Tailwind)** ➔ **Vercel**
- **Backend API (Node.js + Express)** ➔ **Render**
- **Database, Auth & Storage** ➔ **Supabase**

---

## 📋 Pre-Deployment Checklist

Ensure you have access to:
1. **GitHub Repository** with the latest code pushed.
2. **Supabase Project Details**:
   - `Project URL`: `https://tuczdhtpuannsqxcubtj.supabase.co`
   - `Publishable Anon Key`: (`sbp_...` or `eyJ...`)
   - `Service Role Secret Key`: (for backend admin operations)
3. **Vercel Account** ([vercel.com](https://vercel.com))
4. **Render Account** ([render.com](https://render.com))

---

## Part 1: Deploying Frontend to Vercel

### Step 1: Import Project into Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** ➔ **"Project"**.
3. Select your GitHub repository (`College-Event-Management`).

### Step 2: Configure Build & Framework Settings
* **Framework Preset:** `Vite`
* **Root Directory:** Click **Edit** and choose `frontend` *(or leave root if using root `vercel.json`)*.
* **Build Command:** `npm run build`
* **Output Directory:** `dist`
* **Install Command:** `npm install`

### Step 3: Configure Environment Variables
In the **Environment Variables** section on Vercel, add:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | `https://tuczdhtpuannsqxcubtj.supabase.co` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | *(Your Supabase Anon Key)* | From Supabase API Settings |
| `VITE_API_BASE_URL` | `https://campusconnect-api.onrender.com` | Your Render Backend URL |

### Step 4: Deploy & Verify
1. Click **"Deploy"**.
2. Vercel will build the SPA in ~45 seconds.
3. Test your live Vercel URL (e.g., `https://campusconnect-rww8.vercel.app`).
4. Refresh any sub-route (e.g. `/login`, `/organizer`) to verify that the `vercel.json` SPA rewrite rules work seamlessly without 404s.

---

## Part 2: Deploying Backend to Render

### Option A: Using Render Blueprint (`render.yaml`) — Recommended
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **"New +"** ➔ **"Blueprint"**.
3. Connect your GitHub repository.
4. Render will automatically detect [`render.yaml`](file:///c:/College-Event-Management/render.yaml) and configure the `campusconnect-api` Web Service.
5. In the prompts, supply the values for the environment variables:
   - `SUPABASE_URL`: `https://tuczdhtpuannsqxcubtj.supabase.co`
   - `SUPABASE_ANON_KEY`: *(Your Supabase Anon Key)*
   - `SUPABASE_SERVICE_ROLE_KEY`: *(Your Supabase Service Role Key)*
   - `FRONTEND_URL`: `https://your-app.vercel.app`
6. Click **"Apply"** to deploy.

---

### Option B: Manual Web Service Setup on Render
1. In Render Dashboard, click **"New +"** ➔ **"Web Service"**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name:** `campusconnect-api`
   - **Region:** `Singapore` (or region closest to India/users)
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan Type:** `Free`
4. Add **Environment Variables**:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production environment |
| `PORT` | `10000` | Render default port |
| `SUPABASE_URL` | `https://tuczdhtpuannsqxcubtj.supabase.co` | Supabase URL |
| `SUPABASE_ANON_KEY` | *(Your Anon Key)* | Supabase Client Key |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Your Service Role Key)* | Supabase Admin Key |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Allowed CORS Origin |

5. Under **Advanced Settings**:
   - **Health Check Path:** `/health`
   - **Auto-Deploy:** `Yes`
6. Click **"Create Web Service"**.

---

## Part 3: Connecting Frontend, Backend & Supabase

### 1. Update Supabase Auth Redirect URLs
1. Open [Supabase Dashboard](https://supabase.com/dashboard/project/tuczdhtpuannsqxcubtj).
2. Go to **Authentication** ➔ **URL Configuration**.
3. Set **Site URL** to your Vercel URL: `https://your-app.vercel.app`.
4. Add to **Redirect URLs**:
   - `https://your-app.vercel.app/**`
   - `http://localhost:5173/**`

### 2. Verify Backend Health Check
Open your deployed Render URL in the browser:
```
https://campusconnect-api.onrender.com/health
```
Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-08-22T06:40:00.000Z",
  "service": "CampusConnect API",
  "database": "connected",
  "environment": "production"
}
```

---

## 🛠️ Summary of Deployment Files in Repository

* [`frontend/vercel.json`](file:///c:/College-Event-Management/frontend/vercel.json) — SPA routing rewrites and static asset caching for Vercel.
* [`vercel.json`](file:///c:/College-Event-Management/vercel.json) — Monorepo root build configuration for Vercel.
* [`render.yaml`](file:///c:/College-Event-Management/render.yaml) — Infrastructure-as-Code blueprint for Render Web Service.
* [`backend/render.yaml`](file:///c:/College-Event-Management/backend/render.yaml) — Standalone backend deployment config for Render.
* [`backend/server.js`](file:///c:/College-Event-Management/backend/server.js) — Express server with `/health` probe and CORS handling.
* [`backend/package.json`](file:///c:/College-Event-Management/backend/package.json) — Node.js production dependencies & scripts.
