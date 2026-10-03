import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const isSSL = process.env.DB_SSL === 'true' || process.env.DB_PORT === '12991';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  ssl: isSSL ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Demo accounts password is: DemonSlayer2024!
const DEMO_PW_HASH = '$2b$12$WZatQWMvQH8U2PlMkZ7a5eXmcnBQeoz0sDE.aR/Y4W7FkAmCxUrXC';

// Auto-initialize schema and seed Demon Slayer data on startup
async function initDB() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log(`✅ Connected to MySQL database (${process.env.DB_NAME} on ${process.env.DB_HOST})`);

    // 1. Users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('patient', 'doctor', 'admin') NOT NULL DEFAULT 'patient',
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Doctors table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        specialty VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        room VARCHAR(50) NOT NULL,
        patients_count INT DEFAULT 0,
        status ENUM('active', 'on-leave', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Patients table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        assigned_doctor VARCHAR(100) NOT NULL,
        condition_name VARCHAR(150) NOT NULL,
        age INT NOT NULL,
        gender VARCHAR(20) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        blood_type VARCHAR(10) NOT NULL,
        allergies VARCHAR(255) DEFAULT 'None',
        last_visit VARCHAR(50) DEFAULT 'Today',
        registered DATE DEFAULT (CURRENT_DATE),
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Appointments table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT NOT NULL AUTO_INCREMENT,
        patient_name VARCHAR(100) NOT NULL,
        doctor_name VARCHAR(100) NOT NULL,
        date VARCHAR(50) NOT NULL,
        time VARCHAR(50) NOT NULL,
        room VARCHAR(50) NOT NULL,
        mode VARCHAR(50) DEFAULT 'In-Clinic',
        type VARCHAR(100) DEFAULT 'Clinical Consultation',
        status ENUM('confirmed', 'pending', 'completed', 'in-progress', 'upcoming') DEFAULT 'confirmed',
        notes TEXT NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Medical History table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS medical_history (
        id INT NOT NULL AUTO_INCREMENT,
        patient_name VARCHAR(100) NOT NULL,
        doctor_name VARCHAR(100) NOT NULL,
        date VARCHAR(50) NOT NULL,
        type VARCHAR(100) NOT NULL,
        diagnosis VARCHAR(150) NULL,
        note TEXT NOT NULL,
        prescription VARCHAR(255) NULL,
        follow_up VARCHAR(100) NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Prescriptions table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id INT NOT NULL AUTO_INCREMENT,
        patient_name VARCHAR(100) NOT NULL,
        doctor_name VARCHAR(100) NOT NULL,
        name VARCHAR(100) NOT NULL,
        dosage VARCHAR(100) NOT NULL,
        frequency VARCHAR(150) NOT NULL,
        refills INT DEFAULT 1,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. Vitals table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS vitals (
        id INT NOT NULL AUTO_INCREMENT,
        patient_name VARCHAR(100) NOT NULL,
        blood_pressure VARCHAR(50) NOT NULL,
        heart_rate VARCHAR(50) NOT NULL,
        blood_glucose VARCHAR(50) NOT NULL,
        weight VARCHAR(50) NOT NULL,
        oxygen_level VARCHAR(50) NOT NULL,
        last_updated VARCHAR(100) NOT NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 8. System logs table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id INT NOT NULL AUTO_INCREMENT,
        action VARCHAR(150) NOT NULL,
        detail TEXT NOT NULL,
        time VARCHAR(50) NOT NULL,
        severity ENUM('info', 'warning', 'error') DEFAULT 'info',
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ─────────────────────────────────────────────
    // SEED DEMON SLAYER USERS (if not already seeded)
    // ─────────────────────────────────────────────
    const demonSlayerUsers = [
      // Admins
      ['Kagaya Ubuyashiki', 'kagaya.ubuyashiki@drumgate.internal', DEMO_PW_HASH, 'admin'],
      ['Yushiro', 'yushiro@drumgate.internal', DEMO_PW_HASH, 'admin'],
      ['Amane Ubuyashiki', 'amane.ubuyashiki@drumgate.internal', DEMO_PW_HASH, 'admin'],
      // Doctors
      ['Dr. Shinobu Kocho', 'shinobu.kocho@drumgate.internal', DEMO_PW_HASH, 'doctor'],
      ['Dr. Tamayo', 'tamayo@drumgate.internal', DEMO_PW_HASH, 'doctor'],
      ['Dr. Aoi Kanzaki', 'aoi.kanzaki@drumgate.internal', DEMO_PW_HASH, 'doctor'],
      ['Dr. Kyojuro Rengoku', 'kyojuro.rengoku@drumgate.internal', DEMO_PW_HASH, 'doctor'],
      ['Dr. Giyu Tomioka', 'giyu.tomioka@drumgate.internal', DEMO_PW_HASH, 'doctor'],
      // Patients
      ['Tanjiro Kamado', 'tanjiro.kamado@patient.drumgate.com', DEMO_PW_HASH, 'patient'],
      ['Zenitsu Agatsuma', 'zenitsu.agatsuma@patient.drumgate.com', DEMO_PW_HASH, 'patient'],
      ['Inosuke Hashibira', 'inosuke.hashibira@patient.drumgate.com', DEMO_PW_HASH, 'patient'],
      ['Nezuko Kamado', 'nezuko.kamado@patient.drumgate.com', DEMO_PW_HASH, 'patient'],
      ['Kanao Tsuyuri', 'kanao.tsuyuri@patient.drumgate.com', DEMO_PW_HASH, 'patient'],
    ];

    for (const [name, email, pw, role] of demonSlayerUsers) {
      await conn.query(
        'INSERT IGNORE INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [name, email, pw, role]
      );
    }

    // ─────────────────────────────────────────────
    // SEED DOCTORS
    // ─────────────────────────────────────────────
    const [docCount] = await conn.query('SELECT COUNT(*) as count FROM doctors');
    if (docCount[0].count === 0) {
      const doctorsData = [
        ['Dr. Shinobu Kocho', 'Insect Hashira • Chief of Pharmacology', 'shinobu.kocho@drumgate.internal', '+81 90-1888-0001', 'Butterfly Ward 1', 38, 'active'],
        ['Dr. Tamayo', 'Chief Medical Officer • Hematology & Regeneration', 'tamayo@drumgate.internal', '+81 90-1888-0002', 'Asakusa Research Suite', 45, 'active'],
        ['Dr. Aoi Kanzaki', 'Lead Clinical Practitioner • Trauma & Rehab', 'aoi.kanzaki@drumgate.internal', '+81 90-1888-0003', 'Recovery Wing A', 29, 'active'],
        ['Dr. Kyojuro Rengoku', 'Flame Hashira • Cardiology & Vital Resuscitation', 'kyojuro.rengoku@drumgate.internal', '+81 90-1888-0004', 'Solar Pavilion 3', 34, 'active'],
        ['Dr. Giyu Tomioka', 'Water Hashira • Pulmonology & Recovery', 'giyu.tomioka@drumgate.internal', '+81 90-1888-0005', 'Stream Chamber 2', 21, 'active'],
      ];

      for (const d of doctorsData) {
        await conn.query(
          'INSERT INTO doctors (name, specialty, email, phone, room, patients_count, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
          d
        );
      }
    }

    // ─────────────────────────────────────────────
    // SEED PATIENTS
    // ─────────────────────────────────────────────
    const [patCount] = await conn.query('SELECT COUNT(*) as count FROM patients');
    if (patCount[0].count === 0) {
      const patientsData = [
        ['Tanjiro Kamado', 'tanjiro.kamado@patient.drumgate.com', 'Dr. Shinobu Kocho', 'Sun Breathing Strain & Thoracic Recovery', 16, 'Male', '+81 90-7771-0001', 'A+', 'None', 'Today', '2026-10-01'],
        ['Zenitsu Agatsuma', 'zenitsu.agatsuma@patient.drumgate.com', 'Dr. Aoi Kanzaki', 'Lightning Strain & Nervous System Stress', 16, 'Male', '+81 90-7771-0002', 'O+', 'Spider Venom (Desensitized)', 'Today', '2026-09-28'],
        ['Inosuke Hashibira', 'inosuke.hashibira@patient.drumgate.com', 'Dr. Aoi Kanzaki', 'Acute Rib Fracture & Joint Realignment', 15, 'Male', '+81 90-7771-0003', 'B+', 'None (Dislikes Bitter Tonics)', 'Yesterday', '2026-09-25'],
        ['Nezuko Kamado', 'nezuko.kamado@patient.drumgate.com', 'Dr. Tamayo', 'Regenerative Homeostasis & Sleep Therapy', 14, 'Female', '+81 90-7771-0004', 'AB+', 'Sunlight Sensitivity', 'Sep 28', '2026-09-22'],
        ['Kanao Tsuyuri', 'kanao.tsuyuri@patient.drumgate.com', 'Dr. Shinobu Kocho', 'Vermilion Eye Strain & Physical Stamina', 16, 'Female', '+81 90-7771-0005', 'A-', 'None', 'Sep 25', '2026-09-18'],
      ];

      for (const p of patientsData) {
        await conn.query(
          'INSERT INTO patients (name, email, assigned_doctor, condition_name, age, gender, phone, blood_type, allergies, last_visit, registered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          p
        );
      }
    }

    // ─────────────────────────────────────────────
    // SEED APPOINTMENTS
    // ─────────────────────────────────────────────
    const [aptCount] = await conn.query('SELECT COUNT(*) as count FROM appointments');
    if (aptCount[0].count === 0) {
      const appointmentsData = [
        ['Tanjiro Kamado', 'Dr. Shinobu Kocho', '2026-10-08', '10:30 AM', 'Butterfly Ward 1', 'In-Clinic', 'Total Concentration Review', 'confirmed', 'Evaluation of thoracic cage healing and breath regulation.'],
        ['Zenitsu Agatsuma', 'Dr. Aoi Kanzaki', '2026-10-08', '02:00 PM', 'Recovery Wing A', 'In-Clinic', 'Mobility & Herbal Infusion', 'confirmed', 'Limb flexibility review following high-voltage discharge recovery.'],
        ['Inosuke Hashibira', 'Dr. Aoi Kanzaki', '2026-10-10', '09:00 AM', 'Recovery Wing A', 'In-Clinic', 'Rib Bone Ultrasound', 'pending', 'Verify bilateral 5th & 6th rib bone consolidation.'],
        ['Nezuko Kamado', 'Dr. Tamayo', '2026-10-12', '11:00 AM', 'Asakusa Research Suite', 'In-Clinic', 'Cellular Equilibrium Screening', 'confirmed', 'Monitoring daytime sleep metabolic metrics and herbal absorption.'],
        ['Kanao Tsuyuri', 'Dr. Shinobu Kocho', '2026-10-15', '03:30 PM', 'Butterfly Ward 1', 'In-Clinic', 'Visual Cortex Exam', 'pending', 'Ophthalmic ocular strain check and restorative eyewash.'],
      ];

      for (const a of appointmentsData) {
        await conn.query(
          'INSERT INTO appointments (patient_name, doctor_name, date, time, room, mode, type, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          a
        );
      }
    }

    // ─────────────────────────────────────────────
    // SEED MEDICAL HISTORY
    // ─────────────────────────────────────────────
    const [histCount] = await conn.query('SELECT COUNT(*) as count FROM medical_history');
    if (histCount[0].count === 0) {
      const historyData = [
        ['Tanjiro Kamado', 'Dr. Shinobu Kocho', '2026-09-28', 'Consultation', 'Thoracic Recovery Progressing', 'Thoracic ribs fully aligned. Lung capacity expanded to 5.2L via Total Concentration breathing. Cleared for light gourd exercise.', 'Wisteria Restorative Tonic — 20ml twice daily', '2 weeks'],
        ['Tanjiro Kamado', 'Dr. Tamayo', '2026-09-12', 'Lab Results', 'Optimal Cellular Vitality', 'Metabolic and hematology markers within ideal physiological range. No lingering poison residues detected.', 'Nutritional Rehydration Compound', '1 month'],
        ['Zenitsu Agatsuma', 'Dr. Aoi Kanzaki', '2026-09-30', 'Therapy Session', 'Neural Pathway Stabilization', 'Reflex testing shows normal neural conductivity. Tremors completely ceased after herbal soak.', 'Bitter Relaxation Tea (Strictly 3x daily)', '1 week'],
        ['Inosuke Hashibira', 'Dr. Aoi Kanzaki', '2026-09-25', 'Follow-up', 'Rib Fracture Consolidation', 'Callus formation solid on bilateral ribs. Patient attempted combat sparring; ordered 5 days of mandatory rest.', 'Wild Root Calcium Paste (Topical)', '2 weeks'],
        ['Nezuko Kamado', 'Dr. Tamayo', '2026-09-18', 'Consultation', 'Regenerative Homeostasis', 'Cellular state tranquil. Body naturally synthesizing energy through prolonged restful sleep.', 'Tamayo Botanical Compound — 10ml weekly', '4 weeks'],
      ];

      for (const h of historyData) {
        await conn.query(
          'INSERT INTO medical_history (patient_name, doctor_name, date, type, diagnosis, note, prescription, follow_up) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          h
        );
      }
    }

    // ─────────────────────────────────────────────
    // SEED PRESCRIPTIONS
    // ─────────────────────────────────────────────
    const [rxCount] = await conn.query('SELECT COUNT(*) as count FROM prescriptions');
    if (rxCount[0].count === 0) {
      const rxData = [
        ['Tanjiro Kamado', 'Dr. Shinobu Kocho', 'Wisteria Restorative Tonic', '20ml', 'Twice daily after meals', 3, 'Active'],
        ['Tanjiro Kamado', 'Dr. Tamayo', 'Calming Herbal Compound', '10mg', 'Once daily at bedtime', 2, 'Active'],
        ['Zenitsu Agatsuma', 'Dr. Aoi Kanzaki', 'Bitter Relaxation Tea', '1 cup', 'Three times daily (Do not skip)', 4, 'Active'],
        ['Inosuke Hashibira', 'Dr. Aoi Kanzaki', 'Wild Root Calcium Paste', 'Topical', 'Apply to chest morning and evening', 2, 'Active'],
        ['Kanao Tsuyuri', 'Dr. Shinobu Kocho', 'Purified Eyebright Wash', '2 drops', 'As needed after visual focus training', 5, 'Active'],
      ];

      for (const r of rxData) {
        await conn.query(
          'INSERT INTO prescriptions (patient_name, doctor_name, name, dosage, frequency, refills, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
          r
        );
      }
    }

    // ─────────────────────────────────────────────
    // SEED VITALS
    // ─────────────────────────────────────────────
    const [vitCount] = await conn.query('SELECT COUNT(*) as count FROM vitals');
    if (vitCount[0].count === 0) {
      const vitalsData = [
        ['Tanjiro Kamado', '118/76', '64', '92', '61.0', '99', 'Today, 8:45 AM'],
        ['Zenitsu Agatsuma', '128/84', '88', '98', '58.5', '98', 'Today, 9:15 AM'],
        ['Inosuke Hashibira', '122/78', '70', '90', '63.0', '99', 'Yesterday, 4:30 PM'],
        ['Nezuko Kamado', '110/70', '60', '88', '45.0', '100', 'Sep 28, 10:00 AM'],
        ['Kanao Tsuyuri', '116/74', '66', '91', '50.0', '99', 'Sep 25, 2:00 PM'],
      ];

      for (const v of vitalsData) {
        await conn.query(
          'INSERT INTO vitals (patient_name, blood_pressure, heart_rate, blood_glucose, weight, oxygen_level, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?)',
          v
        );
      }
    }

    // ─────────────────────────────────────────────
    // SEED SYSTEM LOGS
    // ─────────────────────────────────────────────
    const [logCount] = await conn.query('SELECT COUNT(*) as count FROM system_logs');
    if (logCount[0].count === 0) {
      const logsData = [
        ['Demon Slayer Medical Portal synchronized', 'Aiven Cloud MySQL connected with SSL encryption', 'Just now', 'info'],
        ['Butterfly Mansion Clinic opened', 'Dr. Shinobu Kocho active in Butterfly Ward 1', '14 mins ago', 'info'],
        ['Asakusa Research Lab online', 'Dr. Tamayo verified encrypted patient records vault', '35 mins ago', 'info'],
        ['Oyakata-sama Security Audit complete', 'Role-based cryptographic tokens active for all Corps members', '1 hour ago', 'info'],
        ['Automated database backup verified', 'Encrypted cloud snapshot replicated successfully', '3 hours ago', 'info'],
      ];

      for (const l of logsData) {
        await conn.query(
          'INSERT INTO system_logs (action, detail, time, severity) VALUES (?, ?, ?, ?)',
          l
        );
      }
    }

    console.log('✅ Database schema verified & Demon Slayer data seeded successfully!');
  } catch (err) {
    console.error('❌ Database connection / initialization failed:', err.message);
  } finally {
    if (conn) conn.release();
  }
}

initDB();

export default pool;
