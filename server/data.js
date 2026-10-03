import { Router } from 'express';
import pool from './db.js';

const router = Router();

// ─────────────────────────────────────────────
// DOCTORS
// ─────────────────────────────────────────────
router.get('/doctors', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM doctors ORDER BY id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/doctors', async (req, res) => {
  try {
    const { name, specialty, email, phone, room, status } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO doctors (name, specialty, email, phone, room, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, specialty, email, phone || '', room || '', status || 'active']
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// PATIENTS
// ─────────────────────────────────────────────
router.get('/patients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patients ORDER BY id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/patients', async (req, res) => {
  try {
    const { name, email, assigned_doctor, condition_name, age, gender, phone, blood_type, allergies } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO patients (name, email, assigned_doctor, condition_name, age, gender, phone, blood_type, allergies, last_visit, registered)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Today', CURRENT_DATE)`,
      [name, email, assigned_doctor || 'Dr. Shinobu Kocho', condition_name || 'General Health', age || 20, gender || 'Other', phone || '', blood_type || 'O+', allergies || 'None']
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// APPOINTMENTS
// ─────────────────────────────────────────────
router.get('/appointments', async (req, res) => {
  try {
    const { doctor, patient } = req.query;
    let query = 'SELECT * FROM appointments';
    const params = [];

    if (doctor) {
      query += ' WHERE doctor_name LIKE ?';
      params.push(`%${doctor}%`);
    } else if (patient) {
      query += ' WHERE patient_name LIKE ?';
      params.push(`%${patient}%`);
    }

    query += ' ORDER BY id DESC';
    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/appointments', async (req, res) => {
  try {
    const { patient_name, doctor_name, date, time, room, mode, type, status, notes } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO appointments (patient_name, doctor_name, date, time, room, mode, type, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_name || 'Tanjiro Kamado',
        doctor_name || 'Dr. Shinobu Kocho',
        date || new Date().toISOString().split('T')[0],
        time || '10:00 AM',
        room || 'Butterfly Ward 1',
        mode || 'In-Clinic',
        type || 'Clinical Consultation',
        status || 'confirmed',
        notes || '',
      ]
    );
    res.status(201).json({ success: true, id: result.insertId, message: 'Appointment booked successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, room, time, date, notes } = req.body;
    
    // Dynamic update
    const fields = [];
    const values = [];
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }
    if (room !== undefined) { fields.push('room = ?'); values.push(room); }
    if (time !== undefined) { fields.push('time = ?'); values.push(time); }
    if (date !== undefined) { fields.push('date = ?'); values.push(date); }
    if (notes !== undefined) { fields.push('notes = ?'); values.push(notes); }

    if (fields.length === 0) return res.json({ success: true });

    values.push(id);
    await pool.execute(`UPDATE appointments SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ success: true, message: 'Appointment updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM appointments WHERE id = ?', [id]);
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// MEDICAL HISTORY / CLINICAL NOTES
// ─────────────────────────────────────────────
router.get('/history', async (req, res) => {
  try {
    const { patient, doctor } = req.query;
    let query = 'SELECT * FROM medical_history';
    const params = [];

    if (patient) {
      query += ' WHERE patient_name LIKE ?';
      params.push(`%${patient}%`);
    } else if (doctor) {
      query += ' WHERE doctor_name LIKE ?';
      params.push(`%${doctor}%`);
    }

    query += ' ORDER BY id DESC';
    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/history', async (req, res) => {
  try {
    const { patient_name, doctor_name, date, type, diagnosis, note, prescription, follow_up } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO medical_history (patient_name, doctor_name, date, type, diagnosis, note, prescription, follow_up)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_name || 'Tanjiro Kamado',
        doctor_name || 'Dr. Shinobu Kocho',
        date || new Date().toISOString().split('T')[0],
        type || 'Consultation',
        diagnosis || '',
        note || '',
        prescription || '',
        follow_up || '',
      ]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// PRESCRIPTIONS
// ─────────────────────────────────────────────
router.get('/prescriptions', async (req, res) => {
  try {
    const { patient } = req.query;
    let query = 'SELECT * FROM prescriptions';
    const params = [];

    if (patient) {
      query += ' WHERE patient_name LIKE ?';
      params.push(`%${patient}%`);
    }

    query += ' ORDER BY id DESC';
    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/prescriptions', async (req, res) => {
  try {
    const { patient_name, doctor_name, name, dosage, frequency, refills, status } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO prescriptions (patient_name, doctor_name, name, dosage, frequency, refills, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [patient_name, doctor_name, name, dosage, frequency, refills || 1, status || 'Active']
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// VITALS
// ─────────────────────────────────────────────
router.get('/vitals', async (req, res) => {
  try {
    const { patient } = req.query;
    let query = 'SELECT * FROM vitals';
    const params = [];

    if (patient) {
      query += ' WHERE patient_name LIKE ? ORDER BY id DESC LIMIT 1';
      params.push(`%${patient}%`);
    } else {
      query += ' ORDER BY id DESC';
    }

    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows.length > 0 ? rows[0] : null, all: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/vitals', async (req, res) => {
  try {
    const { patient_name, blood_pressure, heart_rate, blood_glucose, weight, oxygen_level } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO vitals (patient_name, blood_pressure, heart_rate, blood_glucose, weight, oxygen_level, last_updated)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_name || 'Tanjiro Kamado',
        blood_pressure || '120/80',
        heart_rate || '72',
        blood_glucose || '94',
        weight || '62.0',
        oxygen_level || '99',
        `Today, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      ]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// SYSTEM LOGS
// ─────────────────────────────────────────────
router.get('/logs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM system_logs ORDER BY id DESC LIMIT 50');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/logs', async (req, res) => {
  try {
    const { action, detail, severity } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO system_logs (action, detail, time, severity) VALUES (?, ?, ?, ?)',
      [action, detail, 'Just now', severity || 'info']
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
