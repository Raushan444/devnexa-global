# DevNexa Global — Netlify & Render Deployment Guide

This guide describes how to deploy the **DevNexa Global** enterprise platform live using **Netlify** (for the Next.js frontend) and **Render** (for the Spring Boot backend, PostgreSQL, and Redis).

---

## 🌐 Part 1: Backend Deployment on Render

Render builds and deploys your Spring Boot app using the workspace `backend/Dockerfile` automatically.

### Step 1: Create a Render PostgreSQL Database
1. Go to [Render.com](https://render.com) and sign in.
2. Click **New** ➔ **PostgreSQL**.
3. Name your database (e.g., `devnexa-db`), and choose the region closest to your users.
4. Click **Create Database**.
5. Once active, note down the database name, host, user, and password. (Render will also automatically link it if they are in the same project).

### Step 2: Create a Render Redis Cache (Optional)
1. Click **New** ➔ **Redis**.
2. Name it (e.g., `devnexa-cache`) and click **Create Redis**.
3. Copy the **Internal Redis URL** (e.g., `redis://red-xxxxx:6379`).

### Step 3: Deploy the Spring Boot Web Service
1. Click **New** ➔ **Web Service**.
2. Connect your GitHub repository.
3. Set the following parameters:
   * **Name**: `devnexa-backend`
   * **Root Directory**: `backend` (Important: points to the backend sub-folder)
   * **Runtime**: `Docker` (Important: Render will automatically detect the Dockerfile)
4. Under **Advanced** ➔ **Add Environment Variables**, add:

| Variable Name | Value |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `docker` (Enables the PostgreSQL & Redis production profile) |
| `PGHOST` | `<your-render-postgresql-host>` |
| `PGDATABASE` | `<your-render-postgresql-database-name>` |
| `PGUSER` | `<your-render-postgresql-username>` |
| `PGPASSWORD` | `<your-render-postgresql-password>` |
| `REDIS_URL` | `<your-render-internal-redis-url>` |
| `JWT_SECRET` | `<generate-a-secure-256bit-base64-key>` |
| `GEMINI_API_KEY` | `<your-google-gemini-key>` |
| `STRIPE_SECRET_KEY` | `<your-stripe-secret-key>` |
| `RAZORPAY_KEY_ID` | `<your-razorpay-key-id>` |
| `RAZORPAY_KEY_SECRET` | `<your-razorpay-key-secret>` |
| `MAIL_USERNAME` | `royraushan409@zohomail.in` |
| `MAIL_PASSWORD` | `<your-zoho-app-password>` |

5. Click **Create Web Service**.
6. Once deployed, Render will provide a public URL (e.g., `https://devnexa-backend.onrender.com`).

---

## 🎨 Part 2: Frontend Deployment on Netlify

Netlify is optimized for deploying static and serverless Next.js websites.

### Step 1: Deploy to Netlify
1. Go to [Netlify.com](https://netlify.com) and sign in.
2. Click **Add new site** ➔ **Import an existing project**.
3. Connect your GitHub repository.
4. Set the following build settings:
   * **Base directory**: `frontend` (Important: points to the frontend sub-folder)
   * **Build command**: `npm run build`
   * **Publish directory**: `frontend/.next`
5. Click **Add environment variables** and enter:

| Variable Name | Value |
|---|---|
| `NEXT_PUBLIC_COMPANY_NAME` | `DevNexa Global` |
| `NEXT_PUBLIC_COMPANY_EMAIL` | `royraushan409@zohomail.in` |
| `NEXT_PUBLIC_COMPANY_PHONE` | `+91 62991 83629` |
| `NEXT_PUBLIC_COMPANY_ADDRESS` | `Remote` |
| `NEXT_PUBLIC_COMPANY_CITY` | `Noida 62` |
| `NEXT_PUBLIC_COMPANY_COUNTRY` | `India` |
| `NEXT_PUBLIC_GOOGLE_MAPS` | `https://maps.app.goo.gl/E2XX6vMgUcXcF5t1A` |
| `NEXT_PUBLIC_LINKEDIN` | `https://www.linkedin.com/in/raushankumar409/` |
| `NEXT_PUBLIC_GITHUB` | `https://github.com/devnexa-global` |
| `NEXT_PUBLIC_INSTAGRAM` | `https://instagram.com/devnexa` |
| `NEXT_PUBLIC_API_URL` | `<your-render-backend-url>` (e.g. `https://devnexa-backend.onrender.com`) |

6. Click **Deploy Site**.
7. Netlify will build the Next.js assets using the included `@netlify/plugin-nextjs` plugin and serve the site live!
