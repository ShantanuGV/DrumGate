import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import {
  LayoutDashboard,
  Calendar,
  FileText,
  User,
  Clock,
  MapPin,
  ArrowUpRight,
  Heart,
  ChevronRight,
  Plus,
  X,
  Check,
  Save,
  Edit3,
  Pill,
  Activity,
  Download,
  AlertCircle,
  Video,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: Calendar, label: 'Appointments', id: 'appointments' },
  { icon: FileText, label: 'Medical History', id: 'history' },
  { icon: Pill, label: 'Prescriptions', id: 'prescriptions' },
  { icon: User, label: 'Profile & Health', id: 'profile' },
]

/* ─── Demon Slayer Clinical Records (MySQL Synced) ─── */
const initialAppointments = [
  { id: 1, doctor: 'Dr. Shinobu Kocho', specialty: 'Insect Hashira • Chief Pharmacologist', date: '2026-10-08', time: '10:30 AM', location: 'Butterfly Ward 1', mode: 'In-Clinic', status: 'confirmed' as const, note: 'Total Concentration respiratory & thoracic follow-up' },
  { id: 2, doctor: 'Dr. Aoi Kanzaki', specialty: 'Rehabilitation & Trauma Care', date: '2026-10-22', time: '2:00 PM', location: 'Recovery Wing A', mode: 'In-Clinic', status: 'confirmed' as const, note: 'Muscle flexibility and medicinal tea infusion therapy' },
  { id: 3, doctor: 'Dr. Tamayo', specialty: 'Hematology & Regeneration', date: '2026-11-05', time: '9:00 AM', location: 'Asakusa Research Suite', mode: 'Video Call', status: 'pending' as const, note: 'Cellular equilibrium and sleep vital screening' },
]

const initialHistory = [
  { id: 1, date: '2026-09-28', type: 'Consultation', doctor: 'Dr. Shinobu Kocho', note: 'Thoracic recovery progressing exceptionally well. Lung capacity expanded via Total Concentration breathing. Cleared for light gourd exercise.' },
  { id: 2, date: '2026-09-12', type: 'Lab Results', doctor: 'Dr. Tamayo', note: 'Comprehensive cellular vitality screen. All inflammatory markers returned to baseline. Poison traces completely metabolized.' },
  { id: 3, date: '2026-08-30', type: 'Therapy Session', doctor: 'Dr. Aoi Kanzaki', note: 'Acupuncture and soothing herbal compresses applied to limbs. Reflexes sharp and tremors subsided.' },
  { id: 4, date: '2026-08-15', type: 'Prescription', doctor: 'Dr. Kyojuro Rengoku', note: 'Cardiovascular check: Pulse steady and powerful like a burning flame. Prescribed maintenance herbal tonic.' },
]

const initialPrescriptions = [
  { id: 1, name: 'Wisteria Restorative Tonic', dosage: '20ml', frequency: 'Twice daily after morning meal', doctor: 'Dr. Shinobu Kocho', refills: 3, status: 'Active' },
  { id: 2, name: 'Calming Herbal Compound', dosage: '10mg', frequency: 'Once daily before evening rest', doctor: 'Dr. Tamayo', refills: 2, status: 'Active' },
  { id: 3, name: 'Bitter Relaxation Tea', dosage: '1 cup', frequency: 'Three times daily (Do not skip)', doctor: 'Dr. Aoi Kanzaki', refills: 4, status: 'Active' },
]

const initialVitals = {
  bloodPressure: '118/76',
  heartRate: '64',
  bloodGlucose: '92',
  weight: '61.0',
  oxygenLevel: '99',
  lastUpdated: 'Today, 8:45 AM',
}

const availableDoctors = [
  { name: 'Dr. Shinobu Kocho', specialty: 'Insect Hashira • Chief of Pharmacology' },
  { name: 'Dr. Tamayo', specialty: 'Chief Medical Officer • Hematology & Regeneration' },
  { name: 'Dr. Aoi Kanzaki', specialty: 'Lead Clinical Practitioner • Trauma & Rehab' },
  { name: 'Dr. Kyojuro Rengoku', specialty: 'Flame Hashira • Cardiology & Vital Resuscitation' },
  { name: 'Dr. Giyu Tomioka', specialty: 'Water Hashira • Pulmonology & Recovery' },
]

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

/* ─── Overview Section ─── */
function OverviewSection({
  userName,
  appointments,
  history,
  vitals,
  onNavigate,
  onOpenLogVitals,
  onOpenBookAppointment,
}: {
  userName: string
  appointments: typeof initialAppointments
  history: typeof initialHistory
  vitals: typeof initialVitals
  onNavigate: (id: string) => void
  onOpenLogVitals: () => void
  onOpenBookAppointment: () => void
}) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const next = appointments.find((a) => a.status === 'confirmed')

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1100px] space-y-10">
      {/* Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-charcoal/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aka/10 border border-aka/30 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-aka animate-pulse" />
            <span className="text-[0.65rem] tracking-[0.2em] uppercase text-aka font-mono">
              Patient Sanctuary
            </span>
          </div>
          <p className="text-stone text-xs tracking-[0.2em] uppercase mb-1">{greeting}</p>
          <h1 className="font-serif text-shiro text-3xl md:text-4xl leading-tight">
            {userName}
          </h1>
          <p className="text-stone text-sm italic font-serif mt-1">
            "In every breath, tranquility. In every check-up, peace of mind."
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onOpenBookAppointment}
            className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-4 py-2.5 rounded-lg shadow-sm transition-all hover:shadow-aka/20"
          >
            <Plus size={14} /> Book Appointment
          </button>
          <button
            onClick={onOpenLogVitals}
            className="flex items-center gap-2 text-xs font-medium text-washi bg-sumi/40 hover:bg-sumi/70 border border-charcoal/50 hover:border-charcoal px-4 py-2.5 rounded-lg transition-all"
          >
            <Activity size={14} className="text-aka" /> Log Vitals
          </button>
        </div>
      </div>

      {/* Vitals Summary Strip */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-aka" />
            <h2 className="text-xs tracking-[0.18em] uppercase text-stone font-mono">
              Current Health Vitals
            </h2>
          </div>
          <span className="text-[0.65rem] text-stone/70">Updated: {vitals.lastUpdated}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-charcoal/30 bg-sumi/20 hover:border-aka/30 transition-colors">
            <span className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Blood Pressure</span>
            <span className="text-xl md:text-2xl font-serif text-washi font-medium">{vitals.bloodPressure}</span>
            <span className="text-[0.6rem] text-emerald-400 block mt-1">Optimal · mmHg</span>
          </div>
          <div className="p-4 rounded-xl border border-charcoal/30 bg-sumi/20 hover:border-aka/30 transition-colors">
            <span className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Resting Heart Rate</span>
            <span className="text-xl md:text-2xl font-serif text-washi font-medium">{vitals.heartRate} <span className="text-xs font-sans text-stone">bpm</span></span>
            <span className="text-[0.6rem] text-emerald-400 block mt-1">Normal rhythm</span>
          </div>
          <div className="p-4 rounded-xl border border-charcoal/30 bg-sumi/20 hover:border-aka/30 transition-colors">
            <span className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Blood Glucose</span>
            <span className="text-xl md:text-2xl font-serif text-washi font-medium">{vitals.bloodGlucose} <span className="text-xs font-sans text-stone">mg/dL</span></span>
            <span className="text-[0.6rem] text-emerald-400 block mt-1">Fasting normal</span>
          </div>
          <div className="p-4 rounded-xl border border-charcoal/30 bg-sumi/20 hover:border-aka/30 transition-colors">
            <span className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Weight / SpO2</span>
            <span className="text-xl md:text-2xl font-serif text-washi font-medium">{vitals.weight} <span className="text-xs font-sans text-stone">kg</span></span>
            <span className="text-[0.6rem] text-mist/70 block mt-1">Oxygen: {vitals.oxygenLevel}%</span>
          </div>
        </div>
      </div>

      {/* Next Appointment Feature Card */}
      {next && (
        <div className="relative p-6 sm:p-7 rounded-2xl border border-charcoal/40 bg-gradient-to-br from-sumi/60 via-sumi/30 to-kuro overflow-hidden shadow-lg group hover:border-aka/40 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-aka animate-ping" />
              <span className="text-aka text-xs tracking-[0.18em] uppercase font-mono font-medium">
                Confirmed Upcoming Visit
              </span>
            </div>
            <span className="text-xs text-mist/80 bg-kuro/60 border border-charcoal/40 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
              {next.mode === 'Video Call' ? <Video size={12} className="text-aka" /> : <MapPin size={12} className="text-aka" />}
              {next.location}
            </span>
          </div>

          <div className="grid md:grid-cols-[1.5fr_1fr] gap-6 items-center">
            <div>
              <h3 className="font-serif text-2xl text-shiro mb-1">{next.doctor}</h3>
              <p className="text-stone text-xs mb-3">{next.specialty} · {next.note}</p>
              <div className="flex flex-wrap items-center gap-5 text-sm text-mist">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-aka" />
                  <span>{formatDate(next.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-aka" />
                  <span>{next.time}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-charcoal/30">
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs text-aka hover:text-washi flex items-center gap-1.5 transition-colors font-medium"
              >
                Manage Schedule <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two columns: Upcoming visits & Recent Health Records */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Appointments Preview */}
        <div className="p-6 rounded-2xl border border-charcoal/30 bg-sumi/15">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-aka" />
              <h2 className="text-xs tracking-[0.15em] uppercase text-stone font-mono">Scheduled Visits</h2>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-[0.65rem] text-aka tracking-wider uppercase flex items-center gap-1 hover:gap-2 transition-all"
            >
              All ({appointments.length}) <ChevronRight size={11} />
            </button>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-4 p-3.5 rounded-xl border border-charcoal/20 bg-kuro/40 hover:border-charcoal/60 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-sumi border border-charcoal/40 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[0.6rem] text-stone uppercase">{formatDate(apt.date).split(' ')[0]}</span>
                  <span className="text-sm text-washi font-medium font-serif">{formatDate(apt.date).split(' ')[1]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-washi truncate font-medium">{apt.doctor}</p>
                  <p className="text-xs text-stone">{apt.specialty} · {apt.time}</p>
                </div>
                <span className={`text-[0.6rem] px-2 py-0.5 rounded uppercase tracking-wider ${
                  apt.status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* History Preview */}
        <div className="p-6 rounded-2xl border border-charcoal/30 bg-sumi/15">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-aka" />
              <h2 className="text-xs tracking-[0.15em] uppercase text-stone font-mono">Recent Records</h2>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-[0.65rem] text-aka tracking-wider uppercase flex items-center gap-1 hover:gap-2 transition-all"
            >
              Full History <ChevronRight size={11} />
            </button>
          </div>

          <div className="space-y-3">
            {history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-charcoal/20 bg-kuro/40 hover:border-charcoal/60 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-washi font-medium">{item.type}</span>
                  <span className="text-[0.65rem] text-stone">{formatDate(item.date)}</span>
                </div>
                <p className="text-xs text-stone line-clamp-2 leading-relaxed">{item.note}</p>
                <p className="text-[0.6rem] text-mist/60 mt-2 font-mono">{item.doctor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Appointments Section ─── */
function AppointmentsSection({
  appointments,
  setAppointments,
  showForm,
  setShowForm,
}: {
  appointments: typeof initialAppointments
  setAppointments: React.Dispatch<React.SetStateAction<typeof initialAppointments>>
  showForm: boolean
  setShowForm: (show: boolean) => void
}) {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    doctor: availableDoctors[0].name,
    specialty: availableDoctors[0].specialty,
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    time: '10:00 AM',
    location: 'Room 204 (In-Clinic)',
    mode: 'In-Clinic',
    note: '',
  })
  const [feedback, setFeedback] = useState('')

  const handleDoctorChange = (docName: string) => {
    const found = availableDoctors.find((d) => d.name === docName)
    setForm({
      ...form,
      doctor: docName,
      specialty: found ? found.specialty : 'General Medicine',
    })
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.doctor || !form.date) return
    const newApt = {
      id: Date.now(),
      doctor: form.doctor,
      specialty: form.specialty,
      date: form.date,
      time: form.time,
      location: form.location,
      mode: form.mode,
      status: 'confirmed' as const,
      note: form.note || 'Scheduled patient consultation',
    }
    setAppointments((prev) => [newApt, ...prev])
    setShowForm(false)

    // Persist to MySQL
    fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_name: 'Tanjiro Kamado',
        doctor_name: form.doctor,
        date: form.date,
        time: form.time,
        room: form.location,
        mode: form.mode,
        type: 'Clinical Consultation',
        status: 'confirmed',
        notes: form.note || 'Scheduled consultation',
      }),
    }).catch((err) => console.log('Booking persistence note:', err))

    setForm({
      doctor: availableDoctors[0].name,
      specialty: availableDoctors[0].specialty,
      date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      time: '10:00 AM',
      location: 'Butterfly Ward 1',
      mode: 'In-Clinic',
      note: '',
    })
    setFeedback('Appointment scheduled successfully!')
    setTimeout(() => setFeedback(''), 3000)
  }

  const handleCancel = (id: number) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id))
    fetch(`/api/appointments/${id}`, { method: 'DELETE' }).catch((err) =>
      console.log('Delete note:', err)
    )
    setFeedback('Appointment cancelled.')
    setTimeout(() => setFeedback(''), 2500)
  }

  const filtered = appointments.filter((a) => {
    const matchesFilter = filter === 'all' || a.status === filter
    const matchesSearch =
      a.doctor.toLowerCase().includes(search.toLowerCase()) ||
      a.specialty.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1000px] space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-shiro mb-1">Appointments</h1>
          <p className="text-stone text-sm">Schedule, manage, and review your doctor visits.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-4 py-2.5 rounded-lg transition-colors w-fit"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Close Form' : 'Book New Visit'}
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400 animate-fadeIn">
          <Check size={14} /> {feedback}
        </div>
      )}

      {/* Booking Form Modal/Drawer */}
      {showForm && (
        <div className="p-6 sm:p-7 rounded-2xl border border-aka/30 bg-sumi/30 shadow-xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-charcoal/30 pb-3">
            <h3 className="font-serif text-lg text-washi">Book Clinical Consultation</h3>
            <span className="text-[0.65rem] text-aka uppercase tracking-widest font-mono">Immediate Confirmation</span>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Select Doctor *</label>
                <select
                  value={form.doctor}
                  onChange={(e) => handleDoctorChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi focus:outline-none focus:border-aka/60 transition-colors"
                >
                  {availableDoctors.map((doc) => (
                    <option key={doc.name} value={doc.name}>
                      {doc.name} ({doc.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Specialty / Department</label>
                <input
                  type="text"
                  value={form.specialty}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-kuro/60 border border-charcoal/40 rounded-lg text-sm text-stone cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi focus:outline-none focus:border-aka/60 transition-colors"
                />
              </div>

              <div>
                <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Time Slot *</label>
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi focus:outline-none focus:border-aka/60 transition-colors"
                >
                  <option value="9:00 AM">9:00 AM — Morning</option>
                  <option value="10:30 AM">10:30 AM — Morning</option>
                  <option value="11:45 AM">11:45 AM — Late Morning</option>
                  <option value="2:00 PM">2:00 PM — Afternoon</option>
                  <option value="3:30 PM">3:30 PM — Afternoon</option>
                  <option value="4:45 PM">4:45 PM — Evening</option>
                </select>
              </div>

              <div>
                <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Consultation Mode</label>
                <select
                  value={form.mode}
                  onChange={(e) => {
                    const mode = e.target.value
                    setForm({
                      ...form,
                      mode,
                      location: mode === 'Video Call' ? 'Virtual Telehealth (Encrypted Link)' : 'Room 204 (In-Clinic)',
                    })
                  }}
                  className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi focus:outline-none focus:border-aka/60 transition-colors"
                >
                  <option value="In-Clinic">In-Clinic (Room Visit)</option>
                  <option value="Video Call">Telehealth Video Call</option>
                </select>
              </div>

              <div>
                <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Location / Room</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi focus:outline-none focus:border-aka/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Reason for Visit / Symptoms</label>
              <textarea
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Briefly describe your symptoms or reason for visit..."
                rows={2}
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi focus:outline-none focus:border-aka/60 transition-colors resize-none placeholder:text-stone/40"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-5 py-2.5 rounded-lg transition-colors"
              >
                <Check size={14} /> Confirm Reservation
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs text-stone hover:text-washi px-4 py-2.5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-sumi/30 p-1 rounded-lg border border-charcoal/30 w-fit">
          {(['all', 'confirmed', 'pending'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded text-xs capitalize transition-colors ${
                filter === tab ? 'bg-aka/20 text-washi font-medium border border-aka/30' : 'text-stone hover:text-washi'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctor or specialty..."
            className="w-full pl-9 pr-3 py-2 bg-sumi/20 border border-charcoal/40 rounded-lg text-xs text-washi placeholder:text-stone/50 focus:outline-none focus:border-aka/40"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-charcoal/40 rounded-2xl">
            <Calendar size={32} className="text-charcoal mx-auto mb-3" />
            <p className="text-stone text-sm mb-2">No matching appointments found.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-xs text-aka hover:underline uppercase tracking-wider"
            >
              Book an appointment
            </button>
          </div>
        ) : (
          filtered.map((apt) => (
            <div
              key={apt.id}
              className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/20 hover:border-charcoal/60 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-kuro border border-charcoal/50 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[0.65rem] text-stone uppercase">{formatDate(apt.date).split(' ')[0]}</span>
                  <span className="text-xl text-washi font-serif font-medium">{formatDate(apt.date).split(' ')[1]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base text-washi font-medium">{apt.doctor}</h3>
                    <span className={`text-[0.6rem] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      apt.status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone mb-1">{apt.specialty} · {apt.note}</p>
                  <p className="text-xs text-mist/70 flex items-center gap-2">
                    <Clock size={12} className="text-aka" /> {apt.time}
                    <span className="text-stone/40">·</span>
                    <MapPin size={12} className="text-aka" /> {apt.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  onClick={() => handleCancel(apt.id)}
                  className="text-xs text-stone hover:text-aka border border-charcoal/40 hover:border-aka/40 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Cancel Visit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ─── Medical History Section ─── */
function HistorySection({
  history,
  setHistory,
}: {
  history: typeof initialHistory
  setHistory: React.Dispatch<React.SetStateAction<typeof initialHistory>>
}) {
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    type: 'Consultation',
    doctor: 'Dr. Haruki Tanaka',
    note: '',
    date: new Date().toISOString().split('T')[0],
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.note) return
    const newRecord = {
      id: Date.now(),
      type: form.type,
      doctor: form.doctor,
      note: form.note,
      date: form.date,
    }
    setHistory((prev) => [newRecord, ...prev])
    setForm({
      type: 'Consultation',
      doctor: 'Dr. Haruki Tanaka',
      note: '',
      date: new Date().toISOString().split('T')[0],
    })
    setShowForm(false)
  }

  const handleDelete = (id: number) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const categories = ['All', 'Consultation', 'Lab Results', 'Follow-up', 'Prescription']

  const filtered = history.filter((item) => {
    const matchesFilter = filter === 'All' || item.type === filter
    const matchesSearch =
      item.note.toLowerCase().includes(search.toLowerCase()) ||
      item.doctor.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1000px] space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-shiro mb-1">Medical Records & History</h1>
          <p className="text-stone text-sm">Official consultation logs, diagnostic reports, and medical notes.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-4 py-2.5 rounded-lg transition-colors w-fit"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Close Form' : 'Log New Record'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="p-6 rounded-2xl border border-aka/30 bg-sumi/30 space-y-4 shadow-xl animate-fadeIn">
          <h3 className="font-serif text-lg text-washi">Add Personal Health Record / Doctor Note</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Record Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi focus:outline-none focus:border-aka/60"
              >
                <option value="Consultation">Consultation</option>
                <option value="Lab Results">Lab Results</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Prescription">Prescription</option>
                <option value="Vaccination">Vaccination</option>
              </select>
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Doctor / Clinic</label>
              <input
                type="text"
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                placeholder="Doctor or Clinic name"
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi focus:outline-none focus:border-aka/60"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi focus:outline-none focus:border-aka/60"
              />
            </div>
          </div>
          <div>
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Clinical Notes / Summary *</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Record details, physician recommendations, lab values..."
              rows={3}
              required
              className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi focus:outline-none focus:border-aka/60 resize-none"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-5 py-2.5 rounded-lg transition-colors"
          >
            <Check size={14} /> Save Record
          </button>
        </form>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1 bg-sumi/30 p-1 rounded-lg border border-charcoal/30">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded text-xs transition-colors ${
                filter === cat ? 'bg-aka/20 text-washi font-medium border border-aka/30' : 'text-stone hover:text-washi'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records..."
            className="w-full pl-9 pr-3 py-2 bg-sumi/20 border border-charcoal/40 rounded-lg text-xs text-washi placeholder:text-stone/50 focus:outline-none focus:border-aka/40"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/60 transition-all group"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-aka" />
                <span className="text-sm text-washi font-medium">{item.type}</span>
                <span className="text-xs text-stone/50">·</span>
                <span className="text-xs text-stone">{formatDate(item.date)}</span>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-stone hover:text-aka transition-colors opacity-0 group-hover:opacity-100 p-1"
                title="Remove Record"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-sm text-mist/90 leading-relaxed">{item.note}</p>
            <div className="mt-3 pt-3 border-t border-charcoal/20 flex items-center justify-between text-[0.65rem] text-stone font-mono">
              <span>Physician: {item.doctor}</span>
              <span className="text-emerald-400">Verified Health Record</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Prescriptions Section ─── */
function PrescriptionsSection({
  prescriptions,
  setPrescriptions,
}: {
  prescriptions: typeof initialPrescriptions
  setPrescriptions: React.Dispatch<React.SetStateAction<typeof initialPrescriptions>>
}) {
  const [feedback, setFeedback] = useState('')

  const handleRefill = (id: number) => {
    setPrescriptions((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newRefills = Math.max(0, p.refills - 1)
          return {
            ...p,
            refills: newRefills,
            status: newRefills === 0 ? 'Refill Requested' : p.status,
          }
        }
        return p
      })
    )
    setFeedback('Refill request dispatched to clinic pharmacy!')
    setTimeout(() => setFeedback(''), 3000)
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1000px] space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-shiro mb-1">Active Prescriptions & Pharmacy</h1>
        <p className="text-stone text-sm">View currently prescribed medications and request automated refills.</p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400 animate-fadeIn">
          <Check size={14} /> {feedback}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {prescriptions.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/20 hover:border-aka/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-kuro border border-charcoal/50 flex items-center justify-center">
                  <Pill size={16} className="text-aka" />
                </div>
                <span className={`text-[0.6rem] px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                  p.refills > 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                }`}>
                  {p.refills} refills left
                </span>
              </div>
              <h3 className="font-serif text-lg text-washi mb-1">{p.name}</h3>
              <p className="text-xs text-stone font-mono mb-2">{p.dosage}</p>
              <p className="text-xs text-mist/80 mb-4">{p.frequency}</p>
            </div>

            <div className="pt-4 border-t border-charcoal/30 flex items-center justify-between">
              <span className="text-[0.65rem] text-stone">{p.doctor}</span>
              <button
                onClick={() => handleRefill(p.id)}
                disabled={p.refills === 0}
                className="text-xs font-medium text-kuro bg-aka/80 hover:bg-aka disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-colors"
              >
                {p.refills > 0 ? 'Request Refill' : 'Renewal Pending'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-2xl border border-charcoal/30 bg-kuro/60 flex items-start gap-4">
        <ShieldCheck size={20} className="text-aka flex-shrink-0 mt-0.5" />
        <div className="text-xs text-stone leading-relaxed">
          <span className="text-washi font-medium block mb-1">Direct Pharmacy Integration</span>
          All prescriptions issued via DrumGate are digitally signed and transmitted directly to your registered pharmacy in compliance with Japanese & International e-Prescription standards.
        </div>
      </div>
    </div>
  )
}

/* ─── Profile & Health Data Section ─── */
function ProfileSection({
  user,
  vitals,
}: {
  user: { full_name: string; email: string; role: string }
  vitals: typeof initialVitals
}) {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: user.full_name,
    phone: '+81 (03) 5555-0192',
    dob: '1992-06-14',
    bloodType: 'A Positive (A+)',
    allergies: 'Penicillin, Seasonal Pollen',
    emergencyContact: 'Kenji Suzuki (Spouse) · +81 90-1234-5678',
  })
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const exportRecords = () => {
    const data = {
      patient: profile.name,
      email: user.email,
      bloodType: profile.bloodType,
      allergies: profile.allergies,
      vitals,
      exportTimestamp: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `DrumGate-HealthRecord-${profile.name.replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[800px] space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-shiro mb-1">Personal Health Profile</h1>
          <p className="text-stone text-sm">Confidential patient demographics and medical baseline.</p>
        </div>
        <button
          onClick={exportRecords}
          className="flex items-center gap-2 text-xs text-stone hover:text-washi border border-charcoal/40 hover:border-charcoal px-3.5 py-2 rounded-lg transition-colors"
        >
          <Download size={14} /> Export Summary
        </button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400 animate-fadeIn">
          <Check size={14} /> Health profile saved successfully.
        </div>
      )}

      {/* User Header */}
      <div className="flex items-center gap-5 p-5 rounded-2xl border border-charcoal/30 bg-sumi/20">
        <div className="w-16 h-16 rounded-full bg-sumi border border-charcoal flex items-center justify-center flex-shrink-0">
          <span className="text-washi text-2xl font-serif">{profile.name.charAt(0)}</span>
        </div>
        <div>
          <h2 className="text-xl text-washi font-medium">{profile.name}</h2>
          <p className="text-xs text-stone">{user.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[0.6rem] text-aka tracking-wider uppercase border border-aka/30 px-2 py-0.5 rounded">
              Verified Patient
            </span>
            <span className="text-[0.6rem] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Medical ID: DG-8924
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl border border-charcoal/20 bg-sumi/10">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Full Legal Name</label>
            {editing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-1.5 bg-kuro border border-charcoal/60 rounded text-sm text-washi"
              />
            ) : (
              <p className="text-sm text-washi">{profile.name}</p>
            )}
          </div>

          <div className="p-4 rounded-xl border border-charcoal/20 bg-sumi/10">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Email Address</label>
            <p className="text-sm text-washi">{user.email}</p>
          </div>

          <div className="p-4 rounded-xl border border-charcoal/20 bg-sumi/10">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Contact Phone</label>
            {editing ? (
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-1.5 bg-kuro border border-charcoal/60 rounded text-sm text-washi"
              />
            ) : (
              <p className="text-sm text-washi">{profile.phone}</p>
            )}
          </div>

          <div className="p-4 rounded-xl border border-charcoal/20 bg-sumi/10">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Blood Type</label>
            {editing ? (
              <input
                type="text"
                value={profile.bloodType}
                onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                className="w-full px-3 py-1.5 bg-kuro border border-charcoal/60 rounded text-sm text-washi"
              />
            ) : (
              <p className="text-sm text-washi">{profile.bloodType}</p>
            )}
          </div>

          <div className="p-4 rounded-xl border border-charcoal/20 bg-sumi/10 sm:col-span-2">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Known Allergies</label>
            {editing ? (
              <input
                type="text"
                value={profile.allergies}
                onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                className="w-full px-3 py-1.5 bg-kuro border border-charcoal/60 rounded text-sm text-washi"
              />
            ) : (
              <p className="text-sm text-washi">{profile.allergies}</p>
            )}
          </div>

          <div className="p-4 rounded-xl border border-charcoal/20 bg-sumi/10 sm:col-span-2">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Emergency Contact</label>
            {editing ? (
              <input
                type="text"
                value={profile.emergencyContact}
                onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                className="w-full px-3 py-1.5 bg-kuro border border-charcoal/60 rounded text-sm text-washi"
              />
            ) : (
              <p className="text-sm text-washi">{profile.emergencyContact}</p>
            )}
          </div>
        </div>

        <div className="pt-2">
          {editing ? (
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-5 py-2.5 rounded-lg transition-colors"
              >
                <Save size={14} /> Save Profile
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-xs text-stone hover:text-washi px-4 py-2.5 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 text-xs text-washi bg-sumi/40 hover:bg-sumi/70 border border-charcoal/40 px-4 py-2.5 rounded-lg transition-colors"
            >
              <Edit3 size={14} /> Edit Health Information
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

/* ─── Main Patient Dashboard ─── */
export default function PatientDashboard() {
  const { user } = useAuth()
  const [section, setSection] = useState('overview')
  const [appointments, setAppointments] = useState(initialAppointments)
  const [history, setHistory] = useState(initialHistory)
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions)
  const [vitals, setVitals] = useState(initialVitals)
  const [showBookModal, setShowBookModal] = useState(false)
  const [showVitalsModal, setShowVitalsModal] = useState(false)
  const [vitalsForm, setVitalsForm] = useState({
    bp: vitals.bloodPressure,
    hr: vitals.heartRate,
    glucose: vitals.bloodGlucose,
    weight: vitals.weight,
  })

  if (!user) return null

  useEffect(() => {
    // 1. Fetch live appointments from MySQL
    fetch('/api/appointments')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setAppointments(
            res.data.map((d: any) => ({
              id: d.id,
              doctor: d.doctor_name,
              specialty: d.doctor_name.includes('Shinobu')
                ? 'Insect Hashira • Chief Pharmacologist'
                : d.doctor_name.includes('Tamayo')
                ? 'Hematology & Regeneration'
                : d.doctor_name.includes('Aoi')
                ? 'Rehabilitation & Trauma Care'
                : d.doctor_name.includes('Rengoku')
                ? 'Flame Hashira • Cardiology'
                : 'Clinical Specialist',
              date: d.date,
              time: d.time,
              location: d.room || 'Butterfly Ward 1',
              mode: d.mode || 'In-Clinic',
              status: d.status || 'confirmed',
              note: d.notes || 'Clinical consultation',
            }))
          )
        }
      })
      .catch((err) => console.log('Appointment sync note:', err))

    // 2. Fetch live medical history
    fetch('/api/history')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setHistory(
            res.data.map((h: any) => ({
              id: h.id,
              date: h.date,
              type: h.type,
              doctor: h.doctor_name,
              note: h.note,
            }))
          )
        }
      })
      .catch((err) => console.log('History sync note:', err))

    // 3. Fetch live prescriptions
    fetch('/api/prescriptions')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setPrescriptions(
            res.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              dosage: p.dosage,
              frequency: p.frequency,
              doctor: p.doctor_name,
              refills: p.refills || 1,
              status: p.status || 'Active',
            }))
          )
        }
      })
      .catch((err) => console.log('Prescriptions sync note:', err))

    // 4. Fetch live vitals
    fetch('/api/vitals')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setVitals({
            bloodPressure: res.data.blood_pressure || '118/76',
            heartRate: res.data.heart_rate || '64',
            bloodGlucose: res.data.blood_glucose || '92',
            weight: res.data.weight || '61.0',
            oxygenLevel: res.data.oxygen_level || '99',
            lastUpdated: res.data.last_updated || 'Today, 8:45 AM',
          })
        }
      })
      .catch((err) => console.log('Vitals sync note:', err))
  }, [user])

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault()
    setVitals({
      ...vitals,
      bloodPressure: vitalsForm.bp,
      heartRate: vitalsForm.hr,
      bloodGlucose: vitalsForm.glucose,
      weight: vitalsForm.weight,
      lastUpdated: 'Just now',
    })

    // Persist to MySQL
    fetch('/api/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_name: user.full_name,
        blood_pressure: vitalsForm.bp,
        heart_rate: vitalsForm.hr,
        blood_glucose: vitalsForm.glucose,
        weight: vitalsForm.weight,
        oxygen_level: '99',
      }),
    }).catch((err) => console.log('Vitals persistence note:', err))

    // Also log to history
    setHistory((prev) => [
      {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        type: 'Vitals Log',
        doctor: 'Self Logged (DrumGate Portal)',
        note: `Updated health baseline: BP ${vitalsForm.bp} mmHg, HR ${vitalsForm.hr} bpm, Glucose ${vitalsForm.glucose} mg/dL, Weight ${vitalsForm.weight} kg.`,
      },
      ...prev,
    ])
    setShowVitalsModal(false)
  }

  return (
    <DashboardLayout
      navItems={navItems}
      activeSection={section}
      onNavigate={setSection}
      roleLabel="Patient Portal"
      coverImage="/images/patient-portal.jpg"
      coverQuote={{
        kanji: '癒',
        title: 'PATIENT SANCTUARY',
        subtitle: 'Where mindful care meets peace of mind.',
        badge: 'Patient Portal',
      }}
    >
      {section === 'overview' && (
        <OverviewSection
          userName={user.full_name}
          appointments={appointments}
          history={history}
          vitals={vitals}
          onNavigate={setSection}
          onOpenLogVitals={() => setShowVitalsModal(true)}
          onOpenBookAppointment={() => {
            setSection('appointments')
            setShowBookModal(true)
          }}
        />
      )}
      {section === 'appointments' && (
        <AppointmentsSection
          appointments={appointments}
          setAppointments={setAppointments}
          showForm={showBookModal}
          setShowForm={setShowBookModal}
        />
      )}
      {section === 'history' && (
        <HistorySection history={history} setHistory={setHistory} />
      )}
      {section === 'prescriptions' && (
        <PrescriptionsSection
          prescriptions={prescriptions}
          setPrescriptions={setPrescriptions}
        />
      )}
      {section === 'profile' && (
        <ProfileSection user={user} vitals={vitals} />
      )}

      {/* Log Vitals Modal */}
      {showVitalsModal && (
        <div className="fixed inset-0 z-50 bg-kuro/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-sumi border border-charcoal shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-charcoal/40 pb-3 mb-4">
              <h3 className="font-serif text-lg text-washi flex items-center gap-2">
                <Activity size={18} className="text-aka" /> Log Health Vitals
              </h3>
              <button onClick={() => setShowVitalsModal(false)} className="text-stone hover:text-washi">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveVitals} className="space-y-4">
              <div>
                <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  value={vitalsForm.bp}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, bp: e.target.value })}
                  placeholder="e.g. 120/80"
                  required
                  className="w-full px-3.5 py-2 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
                />
              </div>
              <div>
                <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={vitalsForm.hr}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, hr: e.target.value })}
                  placeholder="e.g. 72"
                  required
                  className="w-full px-3.5 py-2 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
                />
              </div>
              <div>
                <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Blood Glucose (mg/dL)</label>
                <input
                  type="number"
                  value={vitalsForm.glucose}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, glucose: e.target.value })}
                  placeholder="e.g. 95"
                  required
                  className="w-full px-3.5 py-2 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
                />
              </div>
              <div>
                <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vitalsForm.weight}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, weight: e.target.value })}
                  placeholder="e.g. 64.5"
                  required
                  className="w-full px-3.5 py-2 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-aka/90 hover:bg-aka text-kuro font-medium text-xs transition-colors"
                >
                  Save & Update Log
                </button>
                <button
                  type="button"
                  onClick={() => setShowVitalsModal(false)}
                  className="px-4 py-2.5 rounded-lg border border-charcoal/40 text-stone hover:text-washi text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
