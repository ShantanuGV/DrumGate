# DrumGate Technical Documentation Index

Welcome to the official technical documentation for **DrumGate** (鼓門), a full-stack clinical healthcare and clinic management platform blending modern clinical workflows with a Japanese/Demon Slayer (*Kimetsu no Yaiba*) design aesthetic.

This documentation suite provides a comprehensive, ground-truth analysis of the application's actual implementation, architecture, database schemas, REST APIs, security posture, and deployment configuration.

---

## Documentation Suite Overview

```
docs/
├── README.md                     # Documentation Hub (This file)
├── 01-PRD.md                     # Product Requirements Document
├── 02-System-Architecture.md      # System Architecture & Technical Specifications
├── 03-Database-Documentation.md  # Database Schema, Constraints & ERD
├── 04-API-Documentation.md       # Comprehensive REST API Specification
├── 05-Security-Documentation.md  # Security Audit, RBAC & Vulnerability Analysis
└── 06-Deployment-Documentation.md# Deployment, Operations & Production Runbook
```

---

## Document Index

### 1. [Product Requirements Document (PRD)](file:///c:/Users/hp/Desktop/Codes/React/DrumGate/docs/01-PRD.md)
* **File**: `docs/01-PRD.md`
* **Summary**: Outlines the product vision, core problem statements, target user personas (Patient, Doctor, Admin), user journeys, functional requirements (FR-01 to FR-16), non-functional requirements, and the explicit boundary between implemented scope and future enhancements.

### 2. [System Architecture Documentation](file:///c:/Users/hp/Desktop/Codes/React/DrumGate/docs/02-System-Architecture.md)
* **File**: `docs/02-System-Architecture.md`
* **Summary**: Details the decoupled SPA and serverless backend architecture. Features an architectural Mermaid diagram, complete verified technology stack table with exact library versions, frontend and backend breakdown, request lifecycles, and environment configurations.

### 3. [Database & ERD Documentation](file:///c:/Users/hp/Desktop/Codes/React/DrumGate/docs/03-Database-Documentation.md)
* **File**: `docs/03-Database-Documentation.md`
* **Summary**: Documents the MySQL relational schema initialized in `server/db.js`. Includes comprehensive column dictionaries for all 8 application tables (`users`, `doctors`, `patients`, `appointments`, `medical_history`, `prescriptions`, `vitals`, `system_logs`), relational Mermaid ER diagram, data integrity assessment, and Demon Slayer seed data catalog.

### 4. [REST API Documentation](file:///c:/Users/hp/Desktop/Codes/React/DrumGate/docs/04-API-Documentation.md)
* **File**: `docs/04-API-Documentation.md`
* **Summary**: Complete reference for all 20 implemented Express endpoints across authentication (`/api/auth/*`), clinical data (`/api/doctors`, `/api/patients`, `/api/appointments`, `/api/history`, `/api/prescriptions`, `/api/vitals`), and system logs (`/api/logs`). Specifies HTTP methods, request headers, payload schemas, success responses, and error codes.

### 5. [Security Documentation & Vulnerability Review](file:///c:/Users/hp/Desktop/Codes/React/DrumGate/docs/05-Security-Documentation.md)
* **File**: `docs/05-Security-Documentation.md`
* **Summary**: A thorough security audit analyzing bcrypt hashing (12 rounds), JWT token handling, frontend vs. backend RBAC enforcement gaps, parameterized query safeguards, network CORS configurations, and secrets isolation. Features a prioritized Security Findings Matrix (SEC-01 to SEC-07) and pre-production remediation steps.

### 6. [Deployment & Operations Guide](file:///c:/Users/hp/Desktop/Codes/React/DrumGate/docs/06-Deployment-Documentation.md)
* **File**: `docs/06-Deployment-Documentation.md`
* **Summary**: Operational runbook covering the dual-runtime architecture: Vercel Serverless Function (`api/index.js`) and standalone Node.js server. Provides step-by-step guides for local development, Aiven Cloud MySQL setup, custom domain mapping (`drumgate.rakeshbhai.me`), a safe `.env.example` template, and a verified production readiness checklist.

---

## Quick Reference: Test Accounts & Seed Credentials

The application initializes with demo accounts for evaluation. All test accounts share the default seed password:

```text
DemonSlayer2024!
```

| Role | Name | Email | Primary Sanctuary / Screen |
| :--- | :--- | :--- | :--- |
| **Patient** | Tanjiro Kamado | `tanjiro.kamado@patient.drumgate.com` | Patient Sanctuary (Vitals, Appointments, Prescriptions) |
| **Doctor** | Dr. Shinobu Kocho | `shinobu.kocho@drumgate.internal` | Physician Console (Visits, Patient Dossiers, Clinical Notes) |
| **Admin** | Kagaya Ubuyashiki | `kagaya.ubuyashiki@drumgate.internal` | Platform Command (Staff Credentialing, System Logs) |

---

*Documentation maintained by the DrumGate Engineering Team.*
