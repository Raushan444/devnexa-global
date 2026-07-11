# DevNexa Global v2.0 — Enterprise Documentation

> **Version**: 2.0.0 | **Release Date**: July 2026 | **Author**: DevNexa Global Architect

---

## 📋 Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Tech Stack](#2-tech-stack)
3. [Project Directory Layout](#3-project-directory-layout)
4. [Backend (Spring Boot) Specifications](#4-backend-spring-boot-specifications)
   - [Unified Database Schema (JPA Entities)](#41-unified-database-schema-jpa-entities)
   - [Security & Access Control (RBAC, CSP, Webhooks)](#42-security--access-control-rbac-csp-webhooks)
   - [Brute-force Lockout & Attempt Tracker](#43-brute-force-lockout--attempt-tracker)
   - [API Endpoint Reference](#44-api-endpoint-reference)
5. [Frontend (Next.js 16 / React 19) Specifications](#5-frontend-nextjs-16--react-19-specifications)
   - [Routes & Views](#51-routes--views)
   - [Core Visual Components & 3D WebGL](#52-core-visual-components--3d-webgl)
   - [Liquid Glass Animation Tokens](#53-liquid-glass-animation-tokens)
6. [Payment Gateways: Stripe & Razorpay](#6-payment-gateways-stripe--razorpay)
7. [Email & Notification Engine](#7-email--notification-engine)
8. [DevOps & VPS Deployment Guide](#8-devops--vps-deployment-guide)
   - [Environment Secrets (.env)](#81-environment-secrets-env)
   - [Docker Compose Deployment](#82-docker-compose-deployment)
   - [Nginx SSL Configuration](#83-nginx-ssl-configuration)
   - [Database Backup & Restore Operations](#84-database-backup--restore-operations)
   - [GitHub Actions CI/CD Pipeline](#85-github-actions-cicd-pipeline)

---

## 1. System Architecture

```
                                  USER BROWSER
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │        NGINX (Port 443)       │  ← SSL/TLS 1.3 Termination
                       │  HTTP/2, CSP, Rate Limiting   │    Reverse Proxy
                       └───────┬───────────────┬───────┘
                               │               │
            ┌──────────────────┘               └──────────────────┐
            │ /api/**                                             │ / (all other paths)
            ▼                                                     ▼
┌───────────────────────┐                               ┌───────────────────────┐
│  Spring Boot Backend  │                               │   Next.js Frontend    │
│      (Port 8080)      │                               │      (Port 3000)      │
│  Security Filter Chain│                               │  React 19 / SSR / PWA │
└───────────┬───────────┘                               └───────────────────────┘
            │
            ├───────────────┬───────────────┐
            ▼               ▼               ▼
    ┌───────────────┐ ┌───────────┐ ┌───────────────┐
    │ MySQL 8 DB    │ │ Redis 7   │ │ Google Gemini │
    │ Port 3306     │ │ Port 6379 │ │ AI API        │
    └───────────────┘ └───────────┘ └───────────────┘
```

---

## 2. Tech Stack

### Backend Engine
- **Framework**: Spring Boot 3.4.1 (Java 21+)
- **Security**: Spring Security 6.4 + JJWT 0.12.5
- **ORM & Database**: Hibernate / Spring Data JPA (MySQL 8 / Postgres / H2 support)
- **Caching**: Redis 7 (via Lettuce connector)
- **External APIs**: Google Gemini AI (generateContent API), Stripe Java SDK, Razorpay Java SDK
- **Reporting**: OpenPDF (PDF invoice generation), Apache POI (Excel spreadsheet exports)

### Frontend Engine
- **Framework**: Next.js 16.2.10 (Turbopack, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Animations**: Framer Motion (GPU-accelerated entry & scroll triggers)
- **3D Graphics**: Vanilla Three.js WebGL (rendered on HTML5 Canvas, SSR-safe)
- **Performance**: Dynamic component imports, static bundle optimization

---

## 3. Project Directory Layout

```
devnexa-global/
├── backend/                           # Spring Boot Maven Project
│   ├── src/main/java/com/devnexa/global/
│   │   ├── DevNexaApplication.java    # Application Entry (Async & Scheduling Enabled)
│   │   ├── config/                    # Seeder & beans (DatabaseSeeder.java)
│   │   ├── controller/                # REST endpoints
│   │   │   ├── AuthController.java    # Registration & Login endpoints
│   │   │   ├── CrmController.java     # Admin CRM Lead Pipeline APIs
│   │   │   ├── PaymentController.java # Stripe & Razorpay gateway endpoints
│   │   │   ├── ExportController.java  # PDF & Excel export routes
│   │   │   ├── AdminController.java   # Revenue & User roles config
│   │   │   ├── PortalController.java  # Milestones, Tickets, Invoices
│   │   │   ├── AiController.java      # AI blogs, estimation, and audits
│   │   │   └── PublicController.java  # Public blogs & appointments
│   │   ├── dto/                       # DTO requests/responses
│   │   ├── model/                     # JPA Hibernate entities
│   │   │   ├── Lead.java              # Lead status & pipeline value
│   │   │   ├── Milestone.java         # Project sprint milestones
│   │   │   ├── Notification.java      # In-app notifications
│   │   │   ├── AuditLog.java          # Admin operations logger
│   │   │   ├── UploadedFile.java      # Disk storage trackers
│   │   │   ├── User.java              # Credentials & Security status
│   │   │   └── ...                    # Appointment, Invoice, Project, Ticket
│   │   ├── repository/                # Database interfaces
│   │   ├── security/                  # Security filters & classes
│   │   │   ├── WebSecurityConfig.java # Main filter configurations
│   │   │   ├── LoginAttemptService.java# Brute force protection tracker
│   │   │   └── RateLimitingFilter.java# Servlet rate limiter (100 req/min/IP)
│   │   └── service/                   # Business Logic
│   │       ├── EmailService.java      # SMTP client
│   │       ├── FileStorageService.java# File system upload service
│   │       └── PdfExportService.java  # PDF generation engine
│   ├── src/main/resources/
│   │   ├── application.yml            # Multi-profile configurations (local-h2, docker)
│   │   └── schema-mysql.sql           # MySQL database schema setup
│   └── Dockerfile                     # Multi-stage production container build
│
├── frontend/                          # Next.js App Router Project
│   ├── src/
│   │   ├── app/                       # Page routing directory
│   │   │   ├── page.tsx               # Redesigned homepage (10 sections)
│   │   │   ├── layout.tsx             # Root layout with JSON-LD metadata
│   │   │   ├── globals.css            # Stylesheets with liquid morphing keyframes
│   │   │   ├── portfolio/page.tsx     # Portfolio gallery view
│   │   │   ├── loading.tsx            # Global skeleton loader
│   │   │   ├── blog/loading.tsx       # Blog list skeleton
│   │   │   └── portfolio/loading.tsx  # Portfolio list skeleton
│   │   └── components/                # Modular reusable elements
│   │       ├── ThreeHeroWrapper.tsx   # Lazy-loaded WebGL canvas
│   │       ├── StatsCounter.tsx       # Scrolling count animations
│   │       ├── TestimonialsSlider.tsx # Testimonial slider
│   │       ├── ProcessTimeline.tsx    # Vertically staggered project timeline
│   │       ├── PricingSection.tsx     # 3-tier price listings
│   │       └── FaqSection.tsx         # Expanding accordion questions
│   ├── public/                        # PWA Icons, manifest.json
│   └── Dockerfile                     # Next.js standalone container runner
│
├── docker-compose.yml                 # MySQL, Postgres, Redis container networks
├── nginx.conf                         # TLS 1.3, Rate limiting proxy setup
└── deploy/                            # Deployment script utilities
    ├── setup.sh                       # Target server firewall & env initializer
    ├── deploy.sh                      # Zero-downtime container fetch & build
    ├── backup.sh                      # Datetime gzip SQL backup script
    └── restore.sh                     # Safe restore rollback script
```

---

## 4. Backend (Spring Boot) Specifications

### 4.1 Unified Database Schema (JPA Entities)

The database schema is mapped using JPA Hibernate annotations:

```
┌──────────────┐          ┌──────────────┐          ┌────────────────┐
│    USERS     │1       * │   PROJECTS   │1       * │    INVOICES    │
│ (id, email)  ├─────────►│ (id, budget) ├─────────►│(id, invoice_no)│
└──────┬───────┘          └──────┬───────┘          └────────────────┘
       │1                        │1
       ▼ *                       ▼ *
┌──────────────┐          ┌──────────────┐
│  USER_ROLES  │          │  MILESTONES  │
│(user_id,role)│          │ (id, title)  │
└──────────────┘          └──────────────┘
```

#### Key Enterprise Entities
* **`Lead`**: Maps CRM pipeline contacts. Stores `estimatedValue`, `source` (WEBSITE, REFERRAL, etc.), `status` (NEW, CONTACTED, QUALIFIED, PROPOSAL, WON, LOST), and ownership.
* **`Milestone`**: Maps project sprint phases with `dueDate` and `completed` status to render the project timeline.
* **`AuditLog`**: Automatically created by admin operations. Logs `actorUsername`, `action`, `ipAddress`, and timestamps.
* **`UploadedFile`**: Tracks uploaded client deliverables, referencing filename, path, size, and project associations.

---

### 4.2 Security & Access Control

Backend security is configured in `WebSecurityConfig.java` and runs on **Spring Security 6.4**:

- **CORS Configuration**: Restricts API calls to approved origins (`http://localhost:3000`, `https://devnexa.global`).
- **CSRF Protection**: Disabled since authentication relies on stateless JSON Web Tokens (JWT).
- **HTTP Headers**:
  - **Content Security Policy (CSP)**: `default-src 'self'; frame-ancestors 'self'; object-src 'none';`
  - **Clickjacking Protection**: Enforces `X-Frame-Options: SAMEORIGIN`.
  - **XSS Mitigation**: Set `X-XSS-Protection: 0` (relies on browser CSP parsing).

---

### 4.3 Brute-force Lockout & Attempt Tracker

Implemented inside `LoginAttemptService.java` to prevent login brute-forcing:
* Tracks failed login attempts by IP address.
* After **5 consecutive failures**, locks the originating IP address for **15 minutes**.
* The account's status is updated with `accountLockedUntil` and `failedLoginAttempts` increments.
* Authentication attempts from locked IPs receive immediate HTTP 401 statuses before querying credentials.

---

### 4.4 API Endpoint Reference

#### 🔐 Auth APIs — `/api/auth/**`
- `POST /signin`: Log in and retrieve Access/Refresh token pair.
- `POST /signup`: Register a client user.
- `POST /refresh`: Refresh access token validity (24-hour lifetime).
- `POST /social-login`: Google/GitHub authentication hook.

#### 📁 Public AI & App APIs — `/api/public/**`
- `POST /appointment`: Submit a consultation scheduling request.
- `GET /blogs` / `GET /blogs/{slug}`: Dynamic CMS articles.
- `POST /ai/chat`: Interactive customer service assistant.
- `POST /ai/estimate`: AI project scope and duration calculator.
- `POST /ai/audit`: Automatic SEO URL auditor.
- `POST /ai/blog`: Generate an AI article draft.
- `POST /ai/email`: Generate marketing templates.

#### 💳 Secured Payments — `/api/payments/**`
- `POST /create-intent` (Stripe): Returns client secret for card checkouts.
- `POST /razorpay/create-order`: Initiates a Razorpay INR transaction order.
- `POST /razorpay/verify`: Validates the customer checkout signature hash.
- `POST /webhook` (Stripe): Public receiver endpoint for card callback sync.

---

## 5. Frontend (Next.js 16 / React 19) Specifications

### 5.1 Routes & Views

- **`/`**: Redeployed landing page showing stats counters, process steps, client reviews, pricing charts, and FAQ accordions.
- **`/portfolio`**: Filterable grids showcasing web apps, mobile apps, and custom AI products.
- **`/portal/dashboard`**: Tabbed workspace featuring files, milestones, notifications, and billing.
- **`/admin/dashboard`**: Full CRM Kanban panel, revenue metrics chart, user roles modifier, and database logs viewer.

---

### 5.2 Core Visual Components & 3D WebGL

#### `ThreeHeroWrapper.tsx`
Provides performance-focused, lazy-loaded Three.js renderings:
* Uses `dynamic(() => import('./ThreeHero'), { ssr: false })` to lower initial page bundle size.
* Utilizes `IntersectionObserver` to halt runtime execution when the user scrolls away from the fold, maintaining **60 FPS**.

---

### 5.3 Liquid Glass Animation Tokens

Custom animations defined in `globals.css` provide high-performance visual states:
* **`.animate-wobble-nav`**: Organic mercury-style morphing applied to the floating navigation island.
* **`.nav-link-liquid`**: Renders a wobbly glass capsule capsule backing behind navigation links on hover.
* **`.liquid-glass-icon`**: Periodic border-radius shape changes for chatbot bubbles.

---

## 6. Payment Gateways: Stripe & Razorpay

```
Stripe (USD)                       Razorpay (INR)
┌───────────────────────┐          ┌───────────────────────┐
│ POST /create-intent   │          │ POST /create-order    │
│ Returns ClientSecret  │          │ Returns OrderId, Key  │
└──────────┬────────────┘          └──────────┬────────────┘
           │                                  │
   Completes Checkout                 Completes Checkout
           │                                  │
┌──────────▼────────────┐          ┌──────────▼────────────┐
│ Stripe Webhook        │          │ POST /razorpay/verify │
│ (Server-to-Server)    │          │ (Verifies Signature)  │
└───────────────────────┘          └───────────────────────┘
```

* **Stripe Process**: Client calls `/create-intent`, receives secret, completes checkout on frontend. Stripe posts transaction state asynchronously back to the backend `/webhook` endpoint.
* **Razorpay Process**: Client calls `/razorpay/create-order` (USD converted to INR dynamically). Frontend receives order details, prompts Razorpay checkout overlay, and posts the resulting transaction payload to `/razorpay/verify` to confirm verification.

---

## 7. Email & Notification Engine

- **Email Client**: Powered by `JavaMailSender` configured with Gmail SMTP TLS (Port 587).
- **Asynchronous Execution**: Mapped with `@Async` annotations to prevent blocking main HTTP threads during client emails.
- **Templates**: Sends stylized HTML bodies for Welcome emails, OTP authorization, and billing invoices.

---

## 8. DevOps & VPS Deployment Guide

### 8.1 Environment Secrets (.env)

Before deploying, configure your server credentials in `.env`:
```env
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=devnexadb
MYSQL_USER=devnexa_user
MYSQL_PASSWORD=your_db_password
JWT_SECRET=your_base64_secret_key
GEMINI_API_KEY=your_google_gemini_key
STRIPE_SECRET_KEY=sk_live_key
RAZORPAY_KEY_ID=rzp_live_id
RAZORPAY_KEY_SECRET=rzp_live_secret
MAIL_USERNAME=your_gmail_address
MAIL_PASSWORD=your_gmail_app_password
```

---

### 8.2 Docker Compose Deployment

Start services (MySQL, Redis, Backend, Frontend, Nginx):
```bash
docker-compose up -d
```

---

### 8.3 Nginx SSL Configuration

Configure Certbot certificates inside `/etc/letsencrypt/live/devnexa.global/`. Nginx proxy configurations forward standard requests:
- Port `80` automatically redirects all requests to `https://devnexa.global`.
- Port `443` decrypts TLS 1.3, applies security headers, and routes `/api/` traffic to the backend and `/` to Next.js.

---

### 8.4 Database Backup & Restore Operations

#### Backup
Executes backup with dated labels, compressed via gzip:
```bash
bash deploy/backup.sh daily-backup
```

#### Restore
Safely prompts user confirmation before updating schema states:
```bash
bash deploy/restore.sh /var/backups/devnexa/devnexadb_daily-backup_2026.sql.gz
```

---

### 8.5 GitHub Actions CI/CD Pipeline

The `.github/workflows/ci.yml` pipeline defines automated tasks:
1. **Integration**: Runs backend JUnit tests and validates Next.js TypeScript compilation on pull requests.
2. **Build**: Pulls branch modifications, compiles Docker files, and pushes tagged versions to GHCR.
3. **Deployment**: Connects via SSH to your VPS, runs `docker-compose pull`, executes `backup.sh`, runs containers, and verifies runtime health checks.
