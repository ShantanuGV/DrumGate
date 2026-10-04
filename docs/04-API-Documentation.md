# REST API Documentation — DrumGate

## Document Metadata
- **Document Version**: 1.0.0
- **Base URL (Local)**: `http://localhost:3001/api`
- **Base URL (Production)**: `/api` (or custom domain `https://drumgate.rakeshbhai.me/api`)
- **Protocol**: HTTP/1.1 / HTTPS
- **Payload Format**: `application/json`

---

## 1. Overview & Architectural Note

DrumGate exposes RESTful endpoints routed through Express.
- Authentication endpoints are defined in `server/auth.js` (mounted under `/api/auth`).
- Domain clinical and governance endpoints are defined in `server/data.js` (mounted under `/api`).
- Serverless entry (`api/index.js`) mounts routes under both `/api/*` and `/*` to accommodate Vercel URL rewrite configurations.

> [!IMPORTANT]
> **Authentication Status Across Endpoints**:
> - `GET /api/auth/me` **requires** a valid JWT passed via `Authorization: Bearer <token>`.
> - `POST /api/auth/signup` and `POST /api/auth/signin` are **public**.
> - All domain endpoints under `server/data.js` (`/doctors`, `/patients`, `/appointments`, etc.) currently execute **without token verification middleware**. In the existing codebase, role enforcement occurs at the React router and component level. Adding JWT middleware to all data endpoints is documented as a priority recommendation in the Security Documentation.

---

## 2. Health & System Status

### `GET /api/health`

#### Purpose
Verifies that the DrumGate Express API service is online and responsive.

#### Authentication
- **Not required** (Public)

#### Request
```http
GET /api/health HTTP/1.1
Host: localhost:3001
```

#### Response (Success - 200 OK)
```json
{
  "status": "ok",
  "service": "DrumGate API"
}
```
*(On Vercel Serverless, returns `"service": "DrumGate API (Vercel Serverless)"`)*

---

## 3. Authentication Endpoints

### `POST /api/auth/signup`

#### Purpose
Registers a new user account with a hashed password, assigns a role, and issues a JWT token.

#### Authentication
- **Not required** (Public registration)

#### Request
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "full_name": "Tanjiro Kamado",
  "email": "tanjiro.kamado@patient.drumgate.com",
  "password": "DemonSlayer2024!",
  "role": "patient"
}
```

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `full_name` | `string` | Yes | Legal user name |
| `email` | `string` | Yes | Valid email address |
| `password` | `string` | Yes | Minimum 8 characters |
| `role` | `string` | No | Whitelisted: `'patient'`, `'doctor'`, `'admin'` (default: `'patient'`) |

#### Response (Success - 201 Created)
```json
{
  "success": true,
  "message": "Account created successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 14,
    "full_name": "Tanjiro Kamado",
    "email": "tanjiro.kamado@patient.drumgate.com",
    "role": "patient"
  }
}
```

#### Error Responses
- **400 Bad Request** (Missing fields):
  ```json
  { "success": false, "message": "Full name, email, and password are required." }
  ```
- **400 Bad Request** (Invalid email format):
  ```json
  { "success": false, "message": "Please provide a valid email address." }
  ```
- **400 Bad Request** (Password too short):
  ```json
  { "success": false, "message": "Password must be at least 8 characters long." }
  ```
- **409 Conflict** (Email already registered):
  ```json
  { "success": false, "message": "An account with this email already exists." }
  ```
- **500 Internal Server Error**:
  ```json
  { "success": false, "message": "Something went wrong. Please try again." }
  ```

---

### `POST /api/auth/signin`

#### Purpose
Authenticates an existing user via email and password. Resolves the user's role dynamically from the database and returns a signed 7-day JWT.

#### Authentication
- **Not required** (Public login)

#### Request
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "shinobu.kocho@drumgate.internal",
  "password": "DemonSlayer2024!"
}
```

#### Response (Success - 200 OK)
```json
{
  "success": true,
  "message": "Welcome back, Dr. Shinobu Kocho.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "full_name": "Dr. Shinobu Kocho",
    "email": "shinobu.kocho@drumgate.internal",
    "role": "doctor"
  }
}
```

#### Error Responses
- **400 Bad Request** (Missing credentials):
  ```json
  { "success": false, "message": "Email and password are required." }
  ```
- **401 Unauthorized** (Invalid email):
  ```json
  { "success": false, "message": "Invalid email." }
  ```
- **401 Unauthorized** (Invalid password):
  ```json
  { "success": false, "message": "Invalid password." }
  ```
- **500 Internal Server Error**:
  ```json
  { "success": false, "message": "Something went wrong. Please try again." }
  ```

---

### `GET /api/auth/me`

#### Purpose
Verifies the caller's JWT token and returns fresh user profile data from the database.

#### Authentication
- **Required**: `Authorization: Bearer <token>`

#### Request
```http
GET /api/auth/me HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (Success - 200 OK)
```json
{
  "success": true,
  "user": {
    "id": 1,
    "full_name": "Kagaya Ubuyashiki",
    "email": "kagaya.ubuyashiki@drumgate.internal",
    "role": "admin",
    "created_at": "2026-10-01T08:00:00.000Z"
  }
}
```

#### Error Responses
- **401 Unauthorized** (No token):
  ```json
  { "success": false, "message": "No token provided." }
  ```
- **401 Unauthorized** (Invalid or expired token):
  ```json
  { "success": false, "message": "Invalid or expired token." }
  ```
- **404 Not Found** (User no longer in database):
  ```json
  { "success": false, "message": "User not found." }
  ```

---

## 4. Doctors Endpoints

### `GET /api/doctors`

#### Purpose
Retrieves the complete directory of registered physicians.

#### Request
```http
GET /api/doctors HTTP/1.1
```

#### Response (Success - 200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Dr. Shinobu Kocho",
      "specialty": "Insect Hashira • Chief of Pharmacology",
      "email": "shinobu.kocho@drumgate.internal",
      "phone": "+81 90-1888-0001",
      "room": "Butterfly Ward 1",
      "patients_count": 38,
      "status": "active",
      "created_at": "2026-10-01T08:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/doctors`

#### Purpose
Provisions and credentials a new medical doctor in the database.

#### Request
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Dr. Kenzo Tange",
  "specialty": "Cardiology",
  "email": "kenzo.tange@drumgate.internal",
  "phone": "+81 90-1888-0009",
  "room": "Solar Pavilion 2",
  "status": "active"
}
```

#### Response (Success - 201 Created)
```json
{
  "success": true,
  "id": 6
}
```

---

## 5. Patients Endpoints

### `GET /api/patients`

#### Purpose
Retrieves all registered patient records.

#### Request
```http
GET /api/patients HTTP/1.1
```

#### Response (Success - 200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Tanjiro Kamado",
      "email": "tanjiro.kamado@patient.drumgate.com",
      "assigned_doctor": "Dr. Shinobu Kocho",
      "condition_name": "Sun Breathing Strain & Thoracic Recovery",
      "age": 16,
      "gender": "Male",
      "phone": "+81 90-7771-0001",
      "blood_type": "A+",
      "allergies": "None",
      "last_visit": "Today",
      "registered": "2026-10-01",
      "created_at": "2026-10-01T08:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/patients`

#### Purpose
Registers a new patient clinical dossier in the database.

#### Request
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Genya Shinazugawa",
  "email": "genya.shinazugawa@patient.drumgate.com",
  "assigned_doctor": "Dr. Shinobu Kocho",
  "condition_name": "Cellular Regeneration & Muscle Stress",
  "age": 16,
  "gender": "Male",
  "phone": "+81 90-7771-0009",
  "blood_type": "O-",
  "allergies": "None"
}
```

#### Response (Success - 201 Created)
```json
{
  "success": true,
  "id": 6
}
```

---

## 6. Appointments Endpoints

### `GET /api/appointments`

#### Purpose
Retrieves appointments. Supports optional filtering by `doctor` or `patient` query parameter.

#### Query Parameters
- `doctor` *(optional)*: Filter by doctor name substring (e.g. `?doctor=Shinobu`).
- `patient` *(optional)*: Filter by patient name substring (e.g. `?patient=Tanjiro`).

#### Request
```http
GET /api/appointments?patient=Tanjiro HTTP/1.1
```

#### Response (Success - 200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patient_name": "Tanjiro Kamado",
      "doctor_name": "Dr. Shinobu Kocho",
      "date": "2026-10-08",
      "time": "10:30 AM",
      "room": "Butterfly Ward 1",
      "mode": "In-Clinic",
      "type": "Total Concentration Review",
      "status": "confirmed",
      "notes": "Evaluation of thoracic cage healing and breath regulation.",
      "created_at": "2026-10-01T08:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/appointments`

#### Purpose
Schedules and persists a new appointment.

#### Request
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "patient_name": "Tanjiro Kamado",
  "doctor_name": "Dr. Shinobu Kocho",
  "date": "2026-10-14",
  "time": "11:00 AM",
  "room": "Butterfly Ward 1",
  "mode": "In-Clinic",
  "type": "Clinical Consultation",
  "status": "confirmed",
  "notes": "Follow-up thoracic check"
}
```

#### Response (Success - 201 Created)
```json
{
  "success": true,
  "id": 6,
  "message": "Appointment booked successfully"
}
```

---

### `PUT /api/appointments/:id`

#### Purpose
Dynamically updates one or more fields of an existing appointment (e.g., status, room, time, date, notes).

#### Request
- **Headers**: `Content-Type: application/json`
- **URL Parameter**: `id` (Appointment ID)
- **Body**:
```json
{
  "status": "completed",
  "notes": "Patient examined. Thoracic breathing clear."
}
```

#### Response (Success - 200 OK)
```json
{
  "success": true,
  "message": "Appointment updated"
}
```

---

### `DELETE /api/appointments/:id`

#### Purpose
Cancels and removes an appointment from the database.

#### Request
```http
DELETE /api/appointments/6 HTTP/1.1
```

#### Response (Success - 200 OK)
```json
{
  "success": true,
  "message": "Appointment deleted"
}
```

---

## 7. Medical History Endpoints

### `GET /api/history`

#### Purpose
Retrieves clinical history and progress notes. Supports optional filtering by `patient` or `doctor`.

#### Query Parameters
- `patient` *(optional)*: Filter by patient name substring (e.g. `?patient=Tanjiro`).
- `doctor` *(optional)*: Filter by doctor name substring (e.g. `?doctor=Shinobu`).

#### Request
```http
GET /api/history?patient=Tanjiro HTTP/1.1
```

#### Response (Success - 200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patient_name": "Tanjiro Kamado",
      "doctor_name": "Dr. Shinobu Kocho",
      "date": "2026-09-28",
      "type": "Consultation",
      "diagnosis": "Thoracic Recovery Progressing",
      "note": "Thoracic ribs fully aligned. Lung capacity expanded to 5.2L via Total Concentration breathing.",
      "prescription": "Wisteria Restorative Tonic — 20ml twice daily",
      "follow_up": "2 weeks",
      "created_at": "2026-10-01T08:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/history`

#### Purpose
Documents a new medical history or clinical consultation note.

#### Request
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "patient_name": "Tanjiro Kamado",
  "doctor_name": "Dr. Shinobu Kocho",
  "date": "2026-10-04",
  "type": "Consultation",
  "diagnosis": "Thoracic Recovery Complete",
  "note": "Patient fully rehabilitated.",
  "prescription": "Wisteria Maintenance Tonic",
  "follow_up": "3 months"
}
```

#### Response (Success - 201 Created)
```json
{
  "success": true,
  "id": 6
}
```

---

## 8. Prescriptions Endpoints

### `GET /api/prescriptions`

#### Purpose
Retrieves active and historical medication prescriptions. Supports optional filtering by `patient`.

#### Query Parameters
- `patient` *(optional)*: Filter by patient name substring (e.g. `?patient=Tanjiro`).

#### Request
```http
GET /api/prescriptions?patient=Tanjiro HTTP/1.1
```

#### Response (Success - 200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patient_name": "Tanjiro Kamado",
      "doctor_name": "Dr. Shinobu Kocho",
      "name": "Wisteria Restorative Tonic",
      "dosage": "20ml",
      "frequency": "Twice daily after meals",
      "refills": 3,
      "status": "Active",
      "created_at": "2026-10-01T08:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/prescriptions`

#### Purpose
Issues a new pharmaceutical prescription.

#### Request
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "patient_name": "Tanjiro Kamado",
  "doctor_name": "Dr. Shinobu Kocho",
  "name": "Wisteria Concentrated Elixir",
  "dosage": "15ml",
  "frequency": "Once daily at dusk",
  "refills": 2,
  "status": "Active"
}
```

#### Response (Success - 201 Created)
```json
{
  "success": true,
  "id": 6
}
```

---

## 9. Vitals Endpoints

### `GET /api/vitals`

#### Purpose
Retrieves vital sign records. If `?patient=<name>` is supplied, returns the single most recent vital record under `data`, alongside all historical records under `all`.

#### Query Parameters
- `patient` *(optional)*: Filter by patient name.

#### Request
```http
GET /api/vitals?patient=Tanjiro HTTP/1.1
```

#### Response (Success - 200 OK)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patient_name": "Tanjiro Kamado",
    "blood_pressure": "118/76",
    "heart_rate": "64",
    "blood_glucose": "92",
    "weight": "61.0",
    "oxygen_level": "99",
    "last_updated": "Today, 8:45 AM",
    "created_at": "2026-10-01T08:00:00.000Z"
  },
  "all": [
    {
      "id": 1,
      "patient_name": "Tanjiro Kamado",
      "blood_pressure": "118/76",
      "heart_rate": "64",
      "blood_glucose": "92",
      "weight": "61.0",
      "oxygen_level": "99",
      "last_updated": "Today, 8:45 AM",
      "created_at": "2026-10-01T08:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/vitals`

#### Purpose
Logs a new set of biometric vital signs for a patient.

#### Request
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "patient_name": "Tanjiro Kamado",
  "blood_pressure": "116/74",
  "heart_rate": "62",
  "blood_glucose": "90",
  "weight": "61.2",
  "oxygen_level": "99"
}
```

#### Response (Success - 201 Created)
```json
{
  "success": true,
  "id": 6
}
```

---

## 10. System Logs Endpoints

### `GET /api/logs`

#### Purpose
Retrieves the 50 most recent administrative and security audit logs, ordered by newest first.

#### Request
```http
GET /api/logs HTTP/1.1
```

#### Response (Success - 200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "action": "Demon Slayer Medical Portal synchronized",
      "detail": "Aiven Cloud MySQL connected with SSL encryption",
      "time": "Just now",
      "severity": "info",
      "created_at": "2026-10-01T08:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/logs`

#### Purpose
Appends a new audit or operational event to `system_logs`.

#### Request
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "action": "Manual Security Audit Triggered",
  "detail": "Administrator reviewed active physician access tokens",
  "severity": "info"
}
```

#### Response (Success - 201 Created)
```json
{
  "success": true,
  "id": 6
}
```
