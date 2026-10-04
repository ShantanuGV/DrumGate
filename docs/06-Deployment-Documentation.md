# Deployment & Operations Guide — DrumGate

## Document Metadata
- **Document Version**: 1.0.0
- **Primary Hosting Target**: Vercel (Edge / Serverless & Static SPA)
- **Database Target**: Aiven Cloud MySQL (Managed Relational Service)
- **Local Runtime**: Node.js 18+ & Vite Development Server
- **Production Domain**: `drumgate.rakeshbhai.me` (Configured DNS CNAME to Vercel)

---

## 1. End-to-End Deployment Architecture

```mermaid
flowchart TD
    User([End User / Browser])
    DNS[DNS Resolution: drumgate.rakeshbhai.me]
    
    subgraph VercelEdge ["Vercel Edge Network (Global CDN / HTTPS)"]
        VercelRouter["Vercel Router (vercel.json)"]
        StaticCDN["Static Assets CDN (dist/)"]
        ServerlessAPI["Serverless Function (api/index.js)"]
    end

    subgraph DatabaseCloud ["Aiven Cloud Services"]
        AivenMySQL[("Aiven MySQL 8 Cluster (Port 12991, TLS/SSL)")]
    end

    User -->|HTTPS :443| DNS
    DNS --> VercelRouter
    VercelRouter -->|/(.*) - HTML/JS/CSS| StaticCDN
    VercelRouter -->|/api/(.*) - REST Requests| ServerlessAPI
    ServerlessAPI -->|mysql2/promise with TLS| AivenMySQL
```

### Architectural Highlights
1. **Unified Monorepo on Vercel**: The React frontend and Express serverless backend live in the same repository.
2. **Reverse Proxy & Routing**: `vercel.json` intercepts requests:
   - `/api/(.*)` rewrites transparently to the serverless function `api/index.js`.
   - `/(.*)` rewrites to `index.html`, enabling client-side HTML5 history routing without 404 errors.
3. **Database Encapsulation**: Aiven Cloud provides high-availability MySQL with automated backups and encrypted storage at rest.

---

## 2. Frontend Deployment Specification

- **Hosting Platform**: Vercel (Static Web Hosting)
- **Framework Preset**: Vite
- **Node Version**: `>= 18.x`
- **Build Command**:
  ```bash
  npm run build
  # Executes: tsc && vite build
  ```
- **Output Directory**: `dist`
- **Client Environment Variables**: None required at build time. The frontend communicates with `/api/*` relatively, preventing CORS pre-flight delays and host hardcoding.
- **Production Custom Domain**:
  - `drumgate.rakeshbhai.me`
  - Canonical Vercel target: `cname.vercel-dns.com`

---

## 3. Backend Deployment Specification

DrumGate supports two backend execution models:

### Model A: Vercel Serverless Deployment (Production Active)
- **Entry Point**: `api/index.js`
- **Execution Lifecycle**: Ephemeral, auto-scaling serverless container running Node.js.
- **CORS Handling**: Enabled via `cors({ origin: true, credentials: true })`.
- **Database Connection Management**: `server/db.js` initializes a connection pool with keep-alive settings to minimize cold-start latency.

### Model B: Standalone Node.js Server (Container / VPS / Local)
- **Entry Point**: `server/index.js`
- **Execution Command**:
  ```bash
  npm start
  # Or: node index.js
  ```
- **Default Port**: `3001` (configurable via `PORT` environment variable).
- **Process Manager Recommendation**: PM2 (`pm2 start server/index.js --name "drumgate-api"`).

---

## 4. Database Deployment Specification

- **Provider**: Aiven Cloud MySQL (or AWS RDS / GCP Cloud SQL / Local MySQL 8)
- **Connection Port**: `12991` (Aiven default) or `3306` (Standard MySQL)
- **Transport Security**: TLS/SSL required (`DB_SSL=true`).
- **Automated Schema Provisioning**:
  - The application employs a **self-bootstrapping schema model**.
  - On initial connection, `initDB()` in `server/db.js` creates all 8 tables if they do not exist:
    `users`, `doctors`, `patients`, `appointments`, `medical_history`, `prescriptions`, `vitals`, `system_logs`.
  - Empty tables are automatically populated with Demon Slayer clinical test data.

---

## 5. Environment Variables Template

The following environment variables must be configured in Vercel Project Settings (Production) and inside `server/.env` (Local Development):

```env
# ─────────────────────────────────────────────
# DATABASE CONFIGURATION
# ─────────────────────────────────────────────
DB_HOST=your-mysql-instance.aivencloud.com
DB_USER=avnadmin
DB_PASSWORD=your_secure_database_password
DB_NAME=defaultdb
DB_PORT=12991
DB_SSL=true

# ─────────────────────────────────────────────
# AUTHENTICATION & SECURITY
# ─────────────────────────────────────────────
JWT_SECRET=your_minimum_32_character_random_hex_or_string
JWT_EXPIRES_IN=7d

# ─────────────────────────────────────────────
# SERVER RUNTIME (Standalone Mode Only)
# ─────────────────────────────────────────────
PORT=3001
```

> [!CAUTION]
> Never commit actual values for `DB_PASSWORD` or `JWT_SECRET` to version control. The repository's `.gitignore` explicitly prevents `.env` tracking.

---

## 6. Step-by-Step Setup & Deployment Procedures

### 6.1 Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ShantanuGV/DrumGate.git
   cd DrumGate
   ```

2. **Install Root & Server Dependencies**:
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Configure Local Environment**:
   Create `server/.env` using the template from Section 5.

4. **Launch Application in Development**:
   - **Terminal 1** (Backend API):
     ```bash
     cd server
     npm run dev
     # Runs: node --watch index.js on http://localhost:3001
     ```
   - **Terminal 2** (Frontend Vite Dev Server):
     ```bash
     npm run dev
     # Runs Vite on http://localhost:5173
     ```
   - Access the platform at `http://localhost:5173`. Vite automatically proxies `/api` calls to `http://localhost:3001`.

---

### 6.2 Database Provisioning (Aiven Cloud)

1. Create a MySQL service in the Aiven Cloud console (select region, e.g., AWS us-east-1 or ap-south-1).
2. Note the Service URI, Hostname, Port (e.g. `12991`), Username (`avnadmin`), and Password.
3. Ensure SSL is enabled.
4. Add the credentials to your Vercel Environment Variables.

---

### 6.3 Vercel Production Deployment

1. **Connect Repository**:
   Import `ShantanuGV/DrumGate` in the [Vercel Dashboard](https://vercel.com).

2. **Configure Build Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `tsc && vite build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables**:
   In Vercel Project Settings → Environment Variables, add:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_PORT`
   - `DB_SSL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`

4. **Deploy**:
   Click **Deploy**. Vercel will build the frontend assets into `dist/` and package `api/index.js` into an AWS Lambda / edge runtime.

---

### 6.4 Custom Domain Configuration (`drumgate.rakeshbhai.me`)

1. In the Vercel project dashboard, navigate to **Settings → Domains**.
2. Enter `drumgate.rakeshbhai.me` and click **Add**.
3. In your DNS provider (e.g., Cloudflare, Namecheap, Route 53):
   - **Type**: `CNAME`
   - **Name / Host**: `drumgate`
   - **Target / Value**: `cname.vercel-dns.com`
   - **Proxy Status**: DNS Only (if using Cloudflare) or enable SSL Full/Strict.
4. Vercel automatically verifies the record and provisions a Let's Encrypt SSL/TLS certificate.

---

## 7. Production Verification Checklist

The following audit checklist represents the current verification status of the DrumGate platform:

| Verification Item | Status | Verification Evidence / Notes |
| :--- | :---: | :--- |
| **Vite Production Build** | [x] | `npm run build` compiles cleanly with zero TypeScript errors. |
| **Vercel Routing Rules** | [x] | `vercel.json` configures `/api/(.*)` to `api/index.js` and `/(.*)` to `index.html`. |
| **Cloud Database Connectivity** | [x] | `mysql2` connects over TLS/SSL (`rejectUnauthorized: false`) to Aiven Cloud. |
| **Automatic Schema Initialization** | [x] | `initDB()` runs on boot and creates 8 tables if not present. |
| **Demon Slayer Demo Data Seeded** | [x] | Verified seeded test accounts, appointments, vitals, and logs. |
| **Password Hashing (12 Rounds)** | [x] | `bcrypt.hash()` verified in `server/auth.js`. |
| **JWT Session Generation** | [x] | Signed token containing user claims returned on sign-in and sign-up. |
| **Frontend Route Guards** | [x] | `<ProtectedRoute>` prevents unauthorized access to `/dashboard`. |
| **Responsive Mobile Layout** | [x] | Tested across mobile drawer, responsive grid, and typography clamp. |
| **Secrets Excluded from Git** | [x] | `.gitignore` verified; no production `.env` files in git history. |
| **API Health Check Endpoint** | [x] | `GET /api/health` returns `{ "status": "ok" }`. |
| **Custom Domain SSL** | [x] | Vercel provisions automated HTTPS for `drumgate.rakeshbhai.me`. |
| **Backend JWT Middleware on Data Routes** | [ ] | *Pending remediation*: Add token check to `/api/*` data routes. |
| **Rate Limiting on Auth Endpoints** | [ ] | *Pending remediation*: Integrate `express-rate-limit`. |
| **Strict Production CA Certificate Verification** | [ ] | *Pending remediation*: Download Aiven CA and enable strict validation. |
| **Automated CI/CD Test Pipeline** | [ ] | *Pending*: Add GitHub Actions workflow for linting and unit tests. |
