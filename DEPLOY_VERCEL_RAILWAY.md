# DevNexa Global — Vercel & Railway Deployment Guide

This guide describes how to deploy the **DevNexa Global** enterprise platform live using **Vercel** (for the Next.js frontend) and **Railway** (for the Spring Boot backend, MySQL, and Redis).

---

## 🌐 Part 1: Backend Deployment on Railway

Railway builds your Spring Boot app using the workspace `backend/Dockerfile` automatically.

### Step 1: Create a Railway Project
1. Go to [Railway.app](https://railway.app) and sign in.
2. Click **New Project** ➔ **Deploy from GitHub repo**.
3. Select your repository. 
4. In the configuration settings, set the **Root Directory** to `backend`.
5. Click **Deploy**.

### Step 2: Add MySQL and Redis Services
1. Inside your Railway project canvas, click **+ New** ➔ **Database** ➔ **Add MySQL**.
2. Click **+ New** ➔ **Database** ➔ **Add Redis**.
3. Connect services:
   * Railway automatically injects connection parameters (`MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`, `REDISHOST`, `REDISPORT`, `REDISPASSWORD`) into your backend service.
   * Your `application.yml` is already configured to automatically read these variables with no extra settings.

### Step 3: Configure Environment Variables
In your Railway backend service settings, add the following variables:
* `SPRING_PROFILES_ACTIVE` = `mysql`
* `JWT_SECRET` = `<generate-a-secure-256bit-base64-key>`
* `GEMINI_API_KEY` = `<your-google-gemini-key>`
* `STRIPE_SECRET_KEY` = `<your-stripe-secret-key>`
* `RAZORPAY_KEY_ID` = `<your-razorpay-key-id>`
* `RAZORPAY_KEY_SECRET` = `<your-razorpay-key-secret>`
* `MAIL_USERNAME` = `royraushan409@zohomail.in`
* `MAIL_PASSWORD` = `<your-zoho-app-password>`

### Step 4: Expose Domain
1. In your backend service, go to **Settings** ➔ **Public Networking**.
2. Click **Generate Domain**. (e.g., `https://devnexa-backend.up.railway.app`).
3. Save this URL. You will need it for the frontend Vercel deployment.

---

## 🎨 Part 2: Frontend Deployment on Vercel

Vercel is optimized for building and serving Next.js applications.

### Step 1: Create a Vercel Project
1. Go to [Vercel.com](https://vercel.com) and sign in.
2. Click **Add New** ➔ **Project**.
3. Import your GitHub repository.
4. Set the **Framework Preset** to `Next.js`.
5. Set the **Root Directory** to `frontend`.

### Step 2: Configure Environment Variables
Add the following environment variables in the Vercel project dashboard:

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
| `NEXT_PUBLIC_API_URL` | `<your-railway-backend-url>` (e.g. `https://devnexa-backend.up.railway.app`) |

### Step 3: Deploy
1. Click **Deploy**.
2. Vercel will build the frontend, run static path checks, optimize bundle resources, and output a live public URL (e.g., `https://devnexa-global.vercel.app`).
3. (Optional) Point your custom domain (e.g., `https://devnexa.global`) to Vercel via DNS configurations.

---

## 🛠️ Verification Checklist
- [ ] Open the Vercel URL and check that visual animations load at 60 FPS.
- [ ] Go to `/contact` and schedule a mock meeting. Ensure it successfully saves to the Railway H2/MySQL database.
- [ ] Go to `/portal` and log in with credentials (`client` / `client123`) to verify JWT validation.
