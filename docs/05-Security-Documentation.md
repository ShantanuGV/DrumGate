# Security Architecture & Vulnerability Review — DrumGate

## Document Metadata
- **Document Version**: 1.0.0
- **Scope**: Source Code Security Audit of Frontend, Backend API, Database, and Deployment Artifacts
- **Audit Date**: October 2026
- **Status**: Completed Review

---

## 1. Authentication Review

### 1.1 Password Handling & Cryptographic Storage
- **Mechanism**: Passwords are never stored in plaintext. In `server/auth.js`, passwords submitted during registration (`POST /api/auth/signup`) are hashed using `bcryptjs` with **12 salt rounds** (`const SALT_ROUNDS = 12`).
- **Validation**:
  - Registration enforces a minimum password length of 8 characters:
    ```javascript
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }
    ```
  - *Observation*: Password complexity checks (requiring numbers, symbols, uppercase letters) are not enforced at the backend level.

### 1.2 Token & Session Mechanism
- **Algorithm**: JSON Web Tokens (JWT) signed via HMAC-SHA256 using `jsonwebtoken`.
- **Payload**: Contains minimal identity claims:
  ```json
  { "id": 1, "email": "...", "role": "patient", "full_name": "..." }
  ```
- **Secret**: Loaded from environment variable `process.env.JWT_SECRET`.
- **Expiration**: Defaults to 7 days (`JWT_EXPIRES_IN || '7d'`).
- **Client Storage**: Tokens are stored in browser `localStorage` under the key `'drumgate_token'`.
- **Session Verification**: On initial application load, `AuthContext.tsx` verifies the token by sending `GET /api/auth/me` with `Authorization: Bearer <token>`.
- **Sign Out**: `signOut()` in `AuthContext.tsx` removes `'drumgate_token'` from `localStorage` and clears the React context state.

---

## 2. Authorization & Access Control Review

### 2.1 Role-Based Access Control (RBAC)
The application defines three distinct roles: `patient`, `doctor`, and `admin`.

| Role | Frontend Access Scope | Backend Enforced Scope |
| :--- | :--- | :--- |
| **Patient** | Patient Sanctuary (`PatientDashboard.tsx`): Overview, personal appointments, vitals logging, medical history, prescriptions, profile. | Access to `GET /api/auth/me` with valid token. **No role verification on `/api/*` data routes.** |
| **Doctor** | Clinical Console (`DoctorDashboard.tsx`): Schedule management, assigned patient dossiers, consultation notes, physician profile. | Access to `GET /api/auth/me` with valid token. **No role verification on `/api/*` data routes.** |
| **Admin** | Command Center (`AdminDashboard.tsx`): Doctor provisioning, patient directory, global appointments, security governance audit logs. | Access to `GET /api/auth/me` with valid token. **No role verification on `/api/*` data routes.** |

### 2.2 Critical Authorization Finding: Frontend vs. Backend Enforcement
> [!WARNING]
> **Data Route Authorization Gap**:
> Role-based authorization is **currently enforced exclusively on the client side**:
> 1. React Router guards (`<ProtectedRoute>` in `src/App.tsx`) and `Dashboard.tsx` switch components based on `user.role`.
> 2. However, the REST endpoints in `server/data.js` (`/api/doctors`, `/api/patients`, `/api/appointments`, `/api/history`, `/api/prescriptions`, `/api/vitals`, `/api/logs`) do **NOT** inspect the `Authorization` header or verify JWT claims.
> 3. Any HTTP client (e.g. `curl`, Postman) can invoke `GET /api/patients` or `DELETE /api/appointments/:id` without supplying a bearer token or presenting an admin/doctor role.

### 2.3 Resource Ownership & Multi-Tenant Isolation
- In the current API implementation, resource ownership is not checked. For example, `GET /api/appointments?patient=Tanjiro` filters by query string rather than binding the query to the authenticated caller's verified `user.id`.
- *Status*: **Partially implemented** (Architectural isolation exists in the frontend UI; backend data isolation requires middleware attachment).

---

## 3. Input Validation Review

### 3.1 Authentication Routes (`server/auth.js`)
- **Email Validation**: Validated using standard regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- **Field Presence**: Rejection of requests with missing `full_name`, `email`, or `password`.
- **Role Whitelisting**: The role field is checked against an explicit whitelist:
  ```javascript
  const allowedRoles = ['patient', 'doctor', 'admin'];
  const userRole = allowedRoles.includes(role) ? role : 'patient';
  ```
- **String Sanitization**: Uses `.trim()` and `.toLowerCase()` on email inputs to normalize accounts.

### 3.2 Data Routes (`server/data.js`)
- Routes provide fallback default values (e.g., `blood_type || 'O+'`, `assigned_doctor || 'Dr. Shinobu Kocho'`).
- However, schema-level validation libraries (e.g., Zod, Joi, or express-validator) are not utilized. Unexpected or malformed data types could cause MySQL query rejections.

---

## 4. Database Security Review

### 4.1 SQL Injection Protection
- **Verified Protection**: The backend consistently utilizes `mysql2/promise` parameterized statements (`pool.execute(sql, [params])`) across both `server/auth.js` and `server/data.js`.
- User input is bound using `?` placeholders. No string concatenation or template literal interpolation is used for values in SQL queries.
- In `server/data.js` dynamic updates (`PUT /api/appointments/:id`), column names are hardcoded based on explicit property presence checks (`status = ?`, `room = ?`, etc.), preventing SQL injection via field names.

### 4.2 Transport Layer Security (TLS/SSL)
- Database connections to Aiven Cloud MySQL mandate SSL:
  ```javascript
  const isSSL = process.env.DB_SSL === 'true' || process.env.DB_PORT === '12991';
  // ...
  ssl: isSSL ? { rejectUnauthorized: false } : undefined,
  ```
- *Observation*: `rejectUnauthorized: false` allows self-signed or cloud-managed CA certificates without failing the handshake, but leaves connections open to Man-in-the-Middle (MITM) attacks if DNS or transport is compromised. For production, providing the Aiven CA certificate (`ca: fs.readFileSync(...)`) is recommended.

---

## 5. API & Network Security Review

### 5.1 Cross-Origin Resource Sharing (CORS)
- **Local Development (`server/index.js`)**:
  ```javascript
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
  ```
  Strictly allows requests from the Vite local dev server.
- **Serverless Production (`api/index.js`)**:
  ```javascript
  app.use(cors({
    origin: true, // Reflects request origin
    credentials: true,
  }));
  ```
  *Observation*: Setting `origin: true` reflects any calling origin, permitting cross-site requests from untrusted web pages if cookies or credentials were used.

### 5.2 Rate Limiting
- **Current Status**: **Not implemented**.
- There is no rate-limiting middleware (such as `express-rate-limit`) installed on `POST /api/auth/signin` or `POST /api/auth/signup`, making the authentication endpoints susceptible to brute-force or credential-stuffing attacks.

### 5.3 Error Information Leakage
- Generic error messages are returned to clients on auth failures (`"Invalid email."`, `"Invalid password."`, `"Something went wrong."`).
- In `server/data.js`, some database catch blocks return `res.status(500).json({ success: false, message: err.message })`. In production, raw MySQL error strings should be masked to avoid leaking table structures or database hostnames.

---

## 6. Secrets & Environment Configuration Review

- **Version Control Exclusions**:
  - The repository root `.gitignore` explicitly excludes `.env`, `.env.*`, `*.env`, `**/.env`, and `**/.env.*`.
  - Git history inspection confirms that no production `.env` files containing live credentials have been committed.
- **Template Configuration**:
  - `server/.env.example` provides a safe placeholder template with dummy strings.
- **Frontend Secrets**:
  - No database passwords, JWT signing secrets, or private keys are bundled or exposed in Vite client-side bundles.

---

## 7. Data Protection & Privacy (Healthcare Context)

- **Biometric & Health Records**: The platform stores sensitive physiological vitals (blood pressure, heart rate, blood glucose), clinical diagnoses, and prescriptions in the MySQL database.
- **Data in Transit**: Transmitted over HTTPS when deployed on Vercel and secured with SSL/TLS to the Aiven MySQL cluster.
- **Data at Rest**: Dependent on the cloud provider's underlying encryption (Aiven Cloud provides encrypted disks at rest by default). Application-level column encryption (e.g. for `condition_name` or `diagnosis`) is not currently implemented.

---

## 8. Security Findings Matrix

| Finding ID | Title | Severity | Status | Remediation Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Data Endpoints Lack Authentication Middleware | **High** | Requires Remediation | Implement an Express middleware (`authenticateJWT`) that verifies the `Authorization: Bearer` header on all `/api/*` data routes. |
| **SEC-02** | Missing Backend RBAC Enforcement | **High** | Requires Remediation | Implement a role-guard middleware (`requireRole('doctor')`, `requireRole('admin')`) to verify that the token's `role` claim authorizes the action. |
| **SEC-03** | Permissive CORS in Serverless Entry | **Medium** | Requires Remediation | In `api/index.js`, replace `origin: true` with an explicit origin whitelist (e.g., `https://drumgate.rakeshbhai.me`). |
| **SEC-04** | No Rate Limiting on Authentication Endpoints | **Medium** | Requires Remediation | Integrate `express-rate-limit` on `/api/auth/signin` and `/api/auth/signup` (e.g., maximum 5 login attempts per 15 minutes per IP). |
| **SEC-05** | JWT Stored in Browser LocalStorage | **Low** | Requires Hardening | Transition JWT delivery from `localStorage` to `HttpOnly`, `Secure`, `SameSite=Strict` cookies to eliminate XSS token theft risks. |
| **SEC-06** | SSL Certificate Validation Disabled (`rejectUnauthorized: false`)| **Low** | Requires Hardening | Download the Aiven Cloud CA certificate bundle and supply it via the `ssl.ca` property in `mysql2` configuration. |
| **SEC-07** | Raw Database Error Leakage in Data Endpoints | **Low** | Requires Hardening | Standardize 500 error handlers in `server/data.js` to log errors internally and return a generic user message. |

---

## 9. Security Improvements Status

### 9.1 Already Implemented
- [x] Passwords securely hashed with bcrypt using a high work factor (12 rounds).
- [x] Parameterized SQL statements (`mysql2/promise` `pool.execute`) preventing SQL injection.
- [x] Dynamic server-side role resolution upon sign-in (prevents role tampering).
- [x] Client-side route protection and role-based view isolation.
- [x] Mandatory TLS/SSL connection to cloud database.
- [x] Zero committed secrets in Git repository; comprehensive `.gitignore`.
- [x] Email normalization and basic input sanitization on registration.

### 9.2 Recommended Before Production
1. **Attach JWT Verification Middleware to Data Routes**:
   ```javascript
   function authenticateJWT(req, res, next) {
     const authHeader = req.headers.authorization;
     if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
     const token = authHeader.split(' ')[1];
     try {
       req.user = jwt.verify(token, process.env.JWT_SECRET);
       next();
     } catch {
       return res.status(403).json({ message: 'Invalid or expired token' });
     }
   }
   ```
2. **Implement Rate Limiting**: Protect authentication endpoints against brute force using `express-rate-limit`.
3. **Restrict CORS Whitelist**: Lock down production origins strictly to `https://drumgate.rakeshbhai.me`.
4. **Transition to HttpOnly Cookies**: Store authentication tokens in cookies rather than `localStorage`.
5. **Enforce Password Complexity**: Require uppercase, lowercase, numbers, and special characters.
