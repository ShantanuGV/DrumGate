# DrumGate (鼓門)

> A full-stack clinical healthcare and clinic management platform combining modern clinical workflows with a serene Japanese and Demon Slayer (*Kimetsu no Yaiba*) aesthetic.

---

## 📚 Project Documentation

The complete, professional technical documentation suite is available in the [`docs/`](./docs/README.md) directory:

1. **[Product Requirements Document (PRD)](./docs/01-PRD.md)** — Product overview, user roles, user capabilities, workflows, and functional requirements.
2. **[System Architecture Documentation](./docs/02-System-Architecture.md)** — Architectural diagrams, tech stack, frontend & backend architecture, request flows, and environment configurations.
3. **[Database & ERD Documentation](./docs/03-Database-Documentation.md)** — MySQL 8 schema, table dictionaries for all 8 tables, Mermaid ER diagram, constraints, and seed data.
4. **[REST API Documentation](./docs/04-API-Documentation.md)** — Full specification for all 20 Express endpoints (Authentication, Doctors, Patients, Appointments, History, Prescriptions, Vitals, Logs).
5. **[Security Documentation](./docs/05-Security-Documentation.md)** — In-depth security audit, bcrypt/JWT mechanics, RBAC analysis, vulnerability findings matrix, and remediation roadmap.
6. **[Deployment & Operations Guide](./docs/06-Deployment-Documentation.md)** — Vercel serverless and standalone deployment runbooks, Aiven Cloud MySQL integration, and production verification checklist.

*See the [Documentation Index (docs/README.md)](./docs/README.md) for complete details.*

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/ShantanuGV/DrumGate.git
cd DrumGate

# 2. Install dependencies
npm install
cd server && npm install && cd ..

# 3. Configure environment
# Copy server/.env.example to server/.env and fill in database credentials

# 4. Start development servers
# Terminal 1 (Backend API on :3001):
cd server && npm run dev

# Terminal 2 (Frontend Vite on :5173):
npm run dev
```

---

## 👥 Demo Test Accounts

Default seed password for all test accounts: `DemonSlayer2024!`

* **Patient**: `tanjiro.kamado@patient.drumgate.com`
* **Doctor**: `shinobu.kocho@drumgate.internal`
* **Admin**: `kagaya.ubuyashiki@drumgate.internal`
