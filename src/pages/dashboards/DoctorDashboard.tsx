import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  User,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Stethoscope,
  Plus,
  X,
  Check,
  Save,
  Edit3,
  Search,
  Filter,
  AlertCircle,
  Video,
  MapPin,
  Pill,
  Activity,
  Phone,
  CalendarCheck,
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: Calendar, label: 'Schedule & Visits', id: 'appointments' },
  { icon: Users, label: 'My Patients', id: 'patients' },
  { icon: FileText, label: 'Clinical Notes', id: 'consultations' },
  { icon: User, label: 'Physician Profile', id: 'profile' },
]

/* ─── Demon Slayer Clinical Schedule (MySQL Synced) ─── */
const initialSchedule = [
  { id: 1, time: '09:00 AM', patient: 'Tanjiro Kamado', type: 'Total Concentration Review', status: 'completed' as const, room: 'Butterfly Ward 1', mode: 'In-Clinic', notes: 'Thoracic expansion verified. Respiratory cadence peaceful at 14 breaths/min.' },
  { id: 2, time: '10:30 AM', patient: 'Zenitsu Agatsuma', type: 'Clinical Consultation', status: 'in-progress' as const, room: 'Recovery Wing A', mode: 'In-Clinic', notes: 'Evaluating nervous system recovery and limb reflexes under soothing herbal infusion.' },
  { id: 3, time: '01:30 PM', patient: 'Inosuke Hashibira', type: 'Rib Bone Healing Ultrasound', status: 'upcoming' as const, room: 'Recovery Wing A', mode: 'In-Clinic', notes: 'Biometric thoracic imaging to confirm solid bone union before combat drills.' },
  { id: 4, time: '03:15 PM', patient: 'Nezuko Kamado', type: 'Cellular Biomarker Review', status: 'upcoming' as const, room: 'Asakusa Research Suite', mode: 'Video Call', notes: 'Reviewing daytime sleep metabolic stability via secure stream.' },
]

const initialPatients = [
  { id: 1, name: 'Tanjiro Kamado', lastVisit: 'Today', condition: 'Sun Breathing Strain & Thoracic Recovery', age: 16, gender: 'Male', phone: '+81 90-7771-0001', bloodType: 'A+', allergies: 'None' },
  { id: 2, name: 'Zenitsu Agatsuma', lastVisit: 'Today', condition: 'Lightning Strain & Nervous System Stress', age: 16, gender: 'Male', phone: '+81 90-7771-0002', bloodType: 'O+', allergies: 'Spider Venom (Desensitized)' },
  { id: 3, name: 'Inosuke Hashibira', lastVisit: 'Yesterday', condition: 'Acute Rib Fracture & Joint Realignment', age: 15, gender: 'Male', phone: '+81 90-7771-0003', bloodType: 'B+', allergies: 'None (Dislikes Bitter Tonics)' },
  { id: 4, name: 'Nezuko Kamado', lastVisit: 'Sep 28', condition: 'Regenerative Homeostasis & Sleep Therapy', age: 14, gender: 'Female', phone: '+81 90-7771-0004', bloodType: 'AB+', allergies: 'Sunlight Sensitivity' },
  { id: 5, name: 'Kanao Tsuyuri', lastVisit: 'Sep 25', condition: 'Vermilion Eye Strain & Physical Stamina', age: 16, gender: 'Female', phone: '+81 90-7771-0005', bloodType: 'A-', allergies: 'None' },
]

const initialConsultations = [
  {
    id: 1,
    patient: 'Tanjiro Kamado',
    date: '2026-09-28',
    diagnosis: 'Thoracic Recovery Progressing',
    summary: 'Thoracic ribs fully aligned. Lung capacity expanded to 5.2L via Total Concentration breathing. Cleared for light gourd training exercises.',
    prescription: 'Wisteria Restorative Tonic — 20ml twice daily',
    followUp: '2 weeks',
  },
  {
    id: 2,
    patient: 'Zenitsu Agatsuma',
    date: '2026-09-30',
    diagnosis: 'Neural Pathway Stabilization',
    summary: 'Acupuncture and soothing herbal compresses applied to limbs. Reflexes sharp and tremors subsided completely.',
    prescription: 'Bitter Relaxation Tea (Strictly 3x daily)',
    followUp: '1 week',
  },
  {
    id: 3,
    patient: 'Inosuke Hashibira',
    date: '2026-09-25',
    diagnosis: 'Rib Fracture Healing Stage 4',
    summary: 'Bone union solid on bilateral 5th and 6th ribs. Callus formation healthy. Prescribed mandatory 5 days of rest.',
    prescription: 'Wild Root Calcium Paste (Topical)',
    followUp: '2 weeks',
  },
]

type ScheduleItem = typeof initialSchedule[number]
type PatientItem = typeof initialPatients[number]

const statusColors: Record<string, string> = {
  completed: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  'in-progress': 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  upcoming: 'bg-stone/15 text-stone border border-charcoal/40',
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return d
  }
}

/* ─── Overview Section ─── */
function OverviewSection({
  userName,
  schedule,
  patients,
  onNavigate,
  onUpdateStatus,
  onOpenPatientFile,
}: {
  userName: string
  schedule: ScheduleItem[]
  patients: PatientItem[]
  onNavigate: (id: string) => void
  onUpdateStatus: (id: number, status: ScheduleItem['status']) => void
  onOpenPatientFile: (patient: PatientItem) => void
}) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const completedCount = schedule.filter((s) => s.status === 'completed').length
  const inProgressCount = schedule.filter((s) => s.status === 'in-progress').length
  const upcomingCount = schedule.filter((s) => s.status === 'upcoming').length

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1100px] space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-charcoal/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aka/10 border border-aka/30 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-aka animate-pulse" />
            <span className="text-[0.65rem] tracking-[0.2em] uppercase text-aka font-mono">
              Clinical Sanctuary · Room 204
            </span>
          </div>
          <p className="text-stone text-xs tracking-[0.2em] uppercase mb-1">{greeting}</p>
          <h1 className="font-serif text-shiro text-3xl md:text-4xl leading-tight">
            {userName}
          </h1>
          <p className="text-stone text-sm italic font-serif mt-1">
            "To cure sometimes, to relieve often, to comfort always."
          </p>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('appointments')}
            className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-4 py-2.5 rounded-lg transition-all"
          >
            <CalendarCheck size={14} /> View Day Schedule
          </button>
          <button
            onClick={() => onNavigate('consultations')}
            className="flex items-center gap-2 text-xs font-medium text-washi bg-sumi/40 hover:bg-sumi/70 border border-charcoal/50 px-4 py-2.5 rounded-lg transition-all"
          >
            <Plus size={14} className="text-aka" /> Write Clinical Note
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/20">
          <span className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Today's Visits</span>
          <span className="text-2xl md:text-3xl font-serif text-washi font-medium">{schedule.length}</span>
          <span className="text-[0.6rem] text-stone/70 block mt-1">4 scheduled slots</span>
        </div>
        <div className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/20">
          <span className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">In Progress</span>
          <span className="text-2xl md:text-3xl font-serif text-amber-400 font-medium">{inProgressCount}</span>
          <span className="text-[0.6rem] text-amber-400/80 block mt-1">Consultation active</span>
        </div>
        <div className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/20">
          <span className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Completed Today</span>
          <span className="text-2xl md:text-3xl font-serif text-emerald-400 font-medium">{completedCount}</span>
          <span className="text-[0.6rem] text-emerald-400/80 block mt-1">{upcomingCount} upcoming</span>
        </div>
        <div className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/20">
          <span className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Total Assigned Patients</span>
          <span className="text-2xl md:text-3xl font-serif text-washi font-medium">{patients.length}</span>
          <span className="text-[0.6rem] text-mist/70 block mt-1">Primary care panel</span>
        </div>
      </div>

      {/* Today's Schedule Timeline */}
      <div className="p-6 rounded-2xl border border-charcoal/30 bg-sumi/15 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal/30">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-aka" />
            <h2 className="text-xs tracking-[0.18em] uppercase text-stone font-mono">
              Live Clinical Flow · Today
            </h2>
          </div>
          <button
            onClick={() => onNavigate('appointments')}
            className="text-[0.65rem] text-aka tracking-wider uppercase flex items-center gap-1 hover:gap-2 transition-all font-medium"
          >
            Manage Schedule <ChevronRight size={12} />
          </button>
        </div>

        <div className="space-y-3 pt-1">
          {schedule.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-charcoal/20 bg-kuro/50 hover:border-charcoal/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 rounded-lg bg-sumi border border-charcoal/40 flex items-center justify-center flex-shrink-0 font-mono text-xs text-washi">
                  {item.time}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-washi">{item.patient}</h3>
                    <span className={`text-[0.6rem] px-2 py-0.5 rounded uppercase tracking-wider font-mono ${statusColors[item.status]}`}>
                      {item.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-stone">{item.type} · {item.room}</p>
                  {item.notes && <p className="text-xs text-mist/70 mt-1 italic">"{item.notes}"</p>}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {item.status === 'upcoming' && (
                  <button
                    onClick={() => onUpdateStatus(item.id, 'in-progress')}
                    className="text-xs text-kuro bg-amber-400 hover:bg-amber-300 font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Start Visit
                  </button>
                )}
                {item.status === 'in-progress' && (
                  <button
                    onClick={() => onUpdateStatus(item.id, 'completed')}
                    className="text-xs text-kuro bg-emerald-400 hover:bg-emerald-300 font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Complete Visit
                  </button>
                )}
                {item.status === 'completed' && (
                  <span className="text-xs text-emerald-400/70 flex items-center gap-1 font-mono">
                    <Check size={13} /> Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Panel Preview */}
      <div className="p-6 rounded-2xl border border-charcoal/30 bg-sumi/15 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal/30">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-aka" />
            <h2 className="text-xs tracking-[0.18em] uppercase text-stone font-mono">
              Patient Roster (Recent Visits)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('patients')}
            className="text-[0.65rem] text-aka tracking-wider uppercase flex items-center gap-1 hover:gap-2 transition-all font-medium"
          >
            All Patients ({patients.length}) <ChevronRight size={12} />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          {patients.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => onOpenPatientFile(p)}
              className="p-4 rounded-xl border border-charcoal/20 bg-kuro/40 hover:border-aka/40 transition-all cursor-pointer flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-full bg-sumi border border-charcoal/50 flex items-center justify-center flex-shrink-0 text-washi font-medium">
                {p.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-washi font-medium truncate group-hover:text-aka transition-colors">
                  {p.name}
                </p>
                <p className="text-xs text-stone truncate">{p.condition}</p>
                <p className="text-[0.65rem] text-mist/60">Age {p.age} · Blood: {p.bloodType}</p>
              </div>
              <ChevronRight size={14} className="text-charcoal group-hover:text-aka transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Schedule & Appointments Section ─── */
function AppointmentsSection({
  schedule,
  setSchedule,
  onUpdateStatus,
}: {
  schedule: ScheduleItem[]
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>
  onUpdateStatus: (id: number, status: ScheduleItem['status']) => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'in-progress' | 'completed'>('all')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    patient: '',
    time: '02:00 PM',
    type: 'Clinical Consultation',
    room: 'Room 204 (In-Clinic)',
    mode: 'In-Clinic',
    notes: '',
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.patient) return
    const newSlot: ScheduleItem = {
      id: Date.now(),
      patient: form.patient,
      time: form.time,
      type: form.type,
      room: form.room,
      mode: form.mode,
      status: 'upcoming',
      notes: form.notes || 'Scheduled appointment',
    }
    setSchedule((prev) => [...prev, newSlot])
    setForm({
      patient: '',
      time: '02:00 PM',
      type: 'Clinical Consultation',
      room: 'Room 204 (In-Clinic)',
      mode: 'In-Clinic',
      notes: '',
    })
    setShowAdd(false)
  }

  const handleRemove = (id: number) => {
    setSchedule((prev) => prev.filter((s) => s.id !== id))
  }

  const filtered = schedule.filter((s) => {
    const matchesFilter = filter === 'all' || s.status === filter
    const matchesSearch =
      s.patient.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1000px] space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-shiro mb-1">Clinical Schedule</h1>
          <p className="text-stone text-sm">Real-time consultation queue and patient visit management.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-4 py-2.5 rounded-lg transition-colors w-fit"
        >
          {showAdd ? <X size={14} /> : <Plus size={14} />}
          {showAdd ? 'Close' : 'Add Consultation Slot'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="p-6 rounded-2xl border border-aka/30 bg-sumi/30 space-y-4 shadow-xl animate-fadeIn">
          <h3 className="font-serif text-lg text-washi">Add Patient to Schedule</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Patient Name *</label>
              <input
                type="text"
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
                placeholder="Full legal name"
                required
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi focus:outline-none focus:border-aka/60"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Appointment Time</label>
              <input
                type="text"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="e.g. 02:30 PM"
                required
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi focus:outline-none focus:border-aka/60"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Visit Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi focus:outline-none focus:border-aka/60"
              >
                <option value="Clinical Consultation">Clinical Consultation</option>
                <option value="Routine Follow-up">Routine Follow-up</option>
                <option value="General Check-up">General Check-up</option>
                <option value="New Patient Assessment">New Patient Assessment</option>
                <option value="Telehealth Review">Telehealth Review</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Initial Clinical Concern</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Primary symptoms or referral reason..."
              className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi focus:outline-none focus:border-aka/60"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-5 py-2.5 rounded-lg transition-colors"
          >
            <Check size={14} /> Add to Timeline
          </button>
        </form>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-sumi/30 p-1 rounded-lg border border-charcoal/30 w-fit">
          {(['all', 'upcoming', 'in-progress', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded text-xs capitalize transition-colors ${
                filter === tab ? 'bg-aka/20 text-washi font-medium border border-aka/30' : 'text-stone hover:text-washi'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient or visit type..."
            className="w-full pl-9 pr-3 py-2 bg-sumi/20 border border-charcoal/40 rounded-lg text-xs text-washi placeholder:text-stone/50 focus:outline-none focus:border-aka/40"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/20 hover:border-charcoal/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-14 rounded-xl bg-kuro border border-charcoal/50 flex flex-col items-center justify-center font-mono text-xs text-washi flex-shrink-0">
                <Clock size={12} className="text-aka mb-0.5" />
                {item.time.split(' ')[0]}
                <span className="text-[0.55rem] text-stone">{item.time.split(' ')[1]}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base text-washi font-medium">{item.patient}</h3>
                  <span className={`text-[0.6rem] px-2 py-0.5 rounded uppercase tracking-wider font-mono ${statusColors[item.status]}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-xs text-stone">{item.type} · {item.room}</p>
                {item.notes && <p className="text-xs text-mist/80 mt-1 italic">"{item.notes}"</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {item.status === 'upcoming' && (
                <button
                  onClick={() => onUpdateStatus(item.id, 'in-progress')}
                  className="text-xs text-kuro bg-amber-400 hover:bg-amber-300 font-medium px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  Start Visit
                </button>
              )}
              {item.status === 'in-progress' && (
                <button
                  onClick={() => onUpdateStatus(item.id, 'completed')}
                  className="text-xs text-kuro bg-emerald-400 hover:bg-emerald-300 font-medium px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  Complete Visit
                </button>
              )}
              <button
                onClick={() => handleRemove(item.id)}
                className="text-stone hover:text-aka border border-charcoal/30 hover:border-aka/40 p-1.5 rounded-lg transition-colors"
                title="Cancel slot"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Patients Section ─── */
function PatientsSection({
  patients,
  setPatients,
  onOpenPatientFile,
}: {
  patients: PatientItem[]
  setPatients: React.Dispatch<React.SetStateAction<PatientItem[]>>
  onOpenPatientFile: (patient: PatientItem) => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Female',
    condition: '',
    phone: '',
    bloodType: 'A+',
    allergies: 'None',
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) return
    const newP: PatientItem = {
      id: Date.now(),
      name: form.name,
      age: parseInt(form.age) || 30,
      gender: form.gender,
      condition: form.condition || 'General Assessment',
      phone: form.phone || '+81 90-0000-0000',
      bloodType: form.bloodType,
      allergies: form.allergies,
      lastVisit: 'New Intake',
    }
    setPatients((prev) => [newP, ...prev])
    setForm({
      name: '',
      age: '',
      gender: 'Female',
      condition: '',
      phone: '',
      bloodType: 'A+',
      allergies: 'None',
    })
    setShowAdd(false)
  }

  const handleRemove = (id: number) => {
    setPatients((prev) => prev.filter((p) => p.id !== id))
  }

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1000px] space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-shiro mb-1">Assigned Patient Panel</h1>
          <p className="text-stone text-sm">Comprehensive medical records, history, and patient contact data.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-4 py-2.5 rounded-lg transition-colors w-fit"
        >
          {showAdd ? <X size={14} /> : <Plus size={14} />}
          {showAdd ? 'Close' : 'Register New Patient'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="p-6 rounded-2xl border border-aka/30 bg-sumi/30 space-y-4 shadow-xl animate-fadeIn">
          <h3 className="font-serif text-lg text-washi">New Patient Intake</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Patient legal name"
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="Years"
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Primary Condition</label>
              <input
                type="text"
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                placeholder="e.g. Hypertension, Diabetes"
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Phone Contact</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+81 90-..."
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Blood Type</label>
              <select
                value={form.bloodType}
                onChange={(e) => setForm({ ...form, bloodType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-5 py-2.5 rounded-lg transition-colors"
          >
            <Check size={14} /> Save Patient Chart
          </button>
        </form>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients by name or condition..."
          className="w-full pl-9 pr-3 py-2.5 bg-sumi/20 border border-charcoal/40 rounded-lg text-xs text-washi placeholder:text-stone/50 focus:outline-none focus:border-aka/40"
        />
      </div>

      {/* Patients Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/20 hover:border-charcoal/60 transition-all flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-sumi border border-charcoal/50 flex items-center justify-center font-serif text-lg text-washi">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base text-washi font-medium group-hover:text-aka transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-stone">{p.condition}</p>
                  <p className="text-[0.65rem] text-mist/60 mt-0.5">
                    Age {p.age} · {p.gender} · {p.bloodType}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(p.id)}
                className="text-stone hover:text-aka transition-colors opacity-0 group-hover:opacity-100 p-1"
                title="Archive Patient"
              >
                <X size={14} />
              </button>
            </div>

            <div className="pt-3 border-t border-charcoal/20 flex items-center justify-between">
              <span className="text-[0.65rem] text-stone">Last: {p.lastVisit}</span>
              <button
                onClick={() => onOpenPatientFile(p)}
                className="text-xs text-aka hover:text-washi flex items-center gap-1 font-medium transition-colors"
              >
                Open Chart <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Consultations Section ─── */
function ConsultationsSection({
  consultations,
  setConsultations,
  patients,
}: {
  consultations: typeof initialConsultations
  setConsultations: React.Dispatch<React.SetStateAction<typeof initialConsultations>>
  patients: PatientItem[]
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    patient: patients[0]?.name || 'Aiko Suzuki',
    diagnosis: '',
    summary: '',
    prescription: '',
    followUp: '2 weeks',
    date: new Date().toISOString().split('T')[0],
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.summary || !form.diagnosis) return
    const newNote = {
      id: Date.now(),
      patient: form.patient,
      date: form.date,
      diagnosis: form.diagnosis,
      summary: form.summary,
      prescription: form.prescription || 'None',
      followUp: form.followUp,
    }
    setConsultations((prev) => [newNote, ...prev])
    setForm({
      patient: patients[0]?.name || 'Aiko Suzuki',
      diagnosis: '',
      summary: '',
      prescription: '',
      followUp: '2 weeks',
      date: new Date().toISOString().split('T')[0],
    })
    setShowAdd(false)
  }

  const handleRemove = (id: number) => {
    setConsultations((prev) => prev.filter((c) => c.id !== id))
  }

  const filtered = consultations.filter(
    (c) =>
      c.patient.toLowerCase().includes(search.toLowerCase()) ||
      c.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1000px] space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-shiro mb-1">Clinical Notes & Observations</h1>
          <p className="text-stone text-sm">Document diagnostic conclusions, prescriptions, and follow-up directives.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-4 py-2.5 rounded-lg transition-colors w-fit"
        >
          {showAdd ? <X size={14} /> : <Plus size={14} />}
          {showAdd ? 'Close' : 'Write Clinical Note'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="p-6 rounded-2xl border border-aka/30 bg-sumi/30 space-y-4 shadow-xl animate-fadeIn">
          <h3 className="font-serif text-lg text-washi">File New Clinical Encounter Note</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Patient *</label>
              <select
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Primary Diagnosis *</label>
              <input
                type="text"
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                placeholder="e.g. Mild Hypertension, Bronchitis"
                required
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Recommended Follow-up</label>
              <input
                type="text"
                value={form.followUp}
                onChange={(e) => setForm({ ...form, followUp: e.target.value })}
                placeholder="e.g. 2 weeks, 1 month"
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
          </div>
          <div>
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Clinical Findings & Treatment Plan *</label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Detailed physical exam observations, lab analysis, and patient counseling..."
              rows={4}
              required
              className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi resize-none"
            />
          </div>
          <div>
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Prescribed Medication & Dosage</label>
            <input
              type="text"
              value={form.prescription}
              onChange={(e) => setForm({ ...form, prescription: e.target.value })}
              placeholder="e.g. Amoxicillin 500mg TID for 7 days"
              className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-5 py-2.5 rounded-lg transition-colors"
          >
            <Check size={14} /> Commit to Electronic Health Record
          </button>
        </form>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient, diagnosis, or keyword..."
          className="w-full pl-9 pr-3 py-2.5 bg-sumi/20 border border-charcoal/40 rounded-lg text-xs text-washi placeholder:text-stone/50 focus:outline-none focus:border-aka/40"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/60 transition-all group"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h3 className="text-base text-washi font-medium">{item.patient}</h3>
                  <span className="text-stone/50">·</span>
                  <span className="text-xs text-stone">{formatDate(item.date)}</span>
                </div>
                <p className="text-xs text-aka font-mono uppercase tracking-wider">{item.diagnosis}</p>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-stone hover:text-aka transition-colors opacity-0 group-hover:opacity-100 p-1"
                title="Remove Note"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-sm text-mist/90 leading-relaxed mb-4">{item.summary}</p>

            <div className="pt-3 border-t border-charcoal/20 flex flex-wrap items-center justify-between gap-3 text-xs text-stone font-mono">
              <span className="flex items-center gap-1.5 text-washi">
                <Pill size={13} className="text-aka" /> Rx: {item.prescription}
              </span>
              <span>Next Review: {item.followUp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Physician Profile Section ─── */
function ProfileSection({ user }: { user: { full_name: string; email: string; role: string } }) {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    name: user.full_name,
    specialty: 'Internal Medicine & Cardiovascular Wellness',
    license: 'MD-JPN-820491',
    clinicRoom: 'Sanctuary Suite 204',
    hours: 'Mon - Fri (09:00 - 17:00)',
    bio: 'Dedicated to holistic, patient-centered internal medicine integrating modern evidence-based therapy with serene, attentive clinical presence.',
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[800px] space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-shiro mb-1">Physician Credential & Profile</h1>
        <p className="text-stone text-sm">Public directory representation and clinical licensing metadata.</p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400 animate-fadeIn">
          <Check size={14} /> Profile and clinical credentials updated.
        </div>
      )}

      <div className="flex items-center gap-5 p-5 rounded-2xl border border-charcoal/30 bg-sumi/20">
        <div className="w-16 h-16 rounded-full bg-sumi border border-charcoal flex items-center justify-center flex-shrink-0">
          <Stethoscope size={24} className="text-aka" />
        </div>
        <div>
          <h2 className="text-xl text-washi font-medium">{profile.name}</h2>
          <p className="text-xs text-stone">{profile.specialty}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[0.6rem] text-aka tracking-wider uppercase border border-aka/30 px-2 py-0.5 rounded font-mono">
              License: {profile.license}
            </span>
            <span className="text-[0.6rem] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Active Medical Staff
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl border border-charcoal/20 bg-sumi/10">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Doctor Name</label>
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
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Clinical Department</label>
            {editing ? (
              <input
                type="text"
                value={profile.specialty}
                onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                className="w-full px-3 py-1.5 bg-kuro border border-charcoal/60 rounded text-sm text-washi"
              />
            ) : (
              <p className="text-sm text-washi">{profile.specialty}</p>
            )}
          </div>

          <div className="p-4 rounded-xl border border-charcoal/20 bg-sumi/10">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Assigned Clinic Suite</label>
            {editing ? (
              <input
                type="text"
                value={profile.clinicRoom}
                onChange={(e) => setProfile({ ...profile, clinicRoom: e.target.value })}
                className="w-full px-3 py-1.5 bg-kuro border border-charcoal/60 rounded text-sm text-washi"
              />
            ) : (
              <p className="text-sm text-washi">{profile.clinicRoom}</p>
            )}
          </div>

          <div className="p-4 rounded-xl border border-charcoal/20 bg-sumi/10">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Clinical Hours</label>
            {editing ? (
              <input
                type="text"
                value={profile.hours}
                onChange={(e) => setProfile({ ...profile, hours: e.target.value })}
                className="w-full px-3 py-1.5 bg-kuro border border-charcoal/60 rounded text-sm text-washi"
              />
            ) : (
              <p className="text-sm text-washi">{profile.hours}</p>
            )}
          </div>

          <div className="p-4 rounded-xl border border-charcoal/20 bg-sumi/10 sm:col-span-2">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Clinical Philosophy & Bio</label>
            {editing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full px-3 py-1.5 bg-kuro border border-charcoal/60 rounded text-sm text-washi resize-none"
              />
            ) : (
              <p className="text-sm text-washi leading-relaxed">{profile.bio}</p>
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
                <Save size={14} /> Save Credentials
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
              <Edit3 size={14} /> Update Credentials
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

/* ─── Main Doctor Dashboard ─── */
export default function DoctorDashboard() {
  const { user } = useAuth()
  const [section, setSection] = useState('overview')
  const [schedule, setSchedule] = useState(initialSchedule)
  const [patients, setPatients] = useState(initialPatients)
  const [consultations, setConsultations] = useState(initialConsultations)
  const [selectedPatientFile, setSelectedPatientFile] = useState<PatientItem | null>(null)

  useEffect(() => {
    // 1. Fetch live schedule from MySQL
    fetch('/api/appointments')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setSchedule(
            res.data.map((d: any) => ({
              id: d.id,
              time: d.time || '10:00 AM',
              patient: d.patient_name,
              type: d.type || 'Clinical Consultation',
              status: (d.status === 'confirmed' ? 'upcoming' : d.status) as any,
              room: d.room || 'Butterfly Ward 1',
              mode: d.mode || 'In-Clinic',
              notes: d.notes || 'Routine follow-up consultation',
            }))
          )
        }
      })
      .catch((err) => console.log('Doctor schedule sync note:', err))

    // 2. Fetch live patients from MySQL
    fetch('/api/patients')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setPatients(
            res.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              lastVisit: p.last_visit || 'Today',
              condition: p.condition_name || 'Recovery & Wellness',
              age: p.age || 16,
              gender: p.gender || 'Male',
              phone: p.phone || '+81 90-7771-0001',
              bloodType: p.blood_type || 'A+',
              allergies: p.allergies || 'None',
            }))
          )
        }
      })
      .catch((err) => console.log('Doctor patients sync note:', err))

    // 3. Fetch live consultations from MySQL
    fetch('/api/history')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setConsultations(
            res.data.map((c: any) => ({
              id: c.id,
              patient: c.patient_name,
              date: c.date,
              diagnosis: c.diagnosis || c.type,
              summary: c.note,
              prescription: c.prescription || 'N/A',
              followUp: c.follow_up || '2 weeks',
            }))
          )
        }
      })
      .catch((err) => console.log('Doctor consultations sync note:', err))
  }, [user])

  const handleUpdateStatus = (id: number, status: ScheduleItem['status']) => {
    setSchedule((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
    fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((err) => console.log('Status update note:', err))
  }

  if (!user) return null

  return (
    <DashboardLayout
      navItems={navItems}
      activeSection={section}
      onNavigate={setSection}
      roleLabel="Doctor Portal"
      coverImage="/images/doctor-portal.jpg"
      coverQuote={{
        kanji: '仁',
        title: 'CLINICAL SANCTUARY',
        subtitle: 'Dedication to precision, empathy to healing.',
        badge: 'Physician Console',
      }}
    >
      {section === 'overview' && (
        <OverviewSection
          userName={user.full_name}
          schedule={schedule}
          patients={patients}
          onNavigate={setSection}
          onUpdateStatus={handleUpdateStatus}
          onOpenPatientFile={setSelectedPatientFile}
        />
      )}
      {section === 'appointments' && (
        <AppointmentsSection
          schedule={schedule}
          setSchedule={setSchedule}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
      {section === 'patients' && (
        <PatientsSection
          patients={patients}
          setPatients={setPatients}
          onOpenPatientFile={setSelectedPatientFile}
        />
      )}
      {section === 'consultations' && (
        <ConsultationsSection
          consultations={consultations}
          setConsultations={setConsultations}
          patients={patients}
        />
      )}
      {section === 'profile' && <ProfileSection user={user} />}

      {/* Patient Medical Chart Drawer Modal */}
      {selectedPatientFile && (
        <div className="fixed inset-0 z-50 bg-kuro/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl p-6 sm:p-7 rounded-2xl bg-sumi border border-charcoal shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-start justify-between border-b border-charcoal/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-kuro border border-charcoal flex items-center justify-center text-xl font-serif text-washi">
                  {selectedPatientFile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-washi font-medium">
                    {selectedPatientFile.name}
                  </h3>
                  <p className="text-xs text-stone">
                    Age {selectedPatientFile.age} · {selectedPatientFile.gender} · Blood: {selectedPatientFile.bloodType}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatientFile(null)}
                className="text-stone hover:text-washi p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-kuro/60 border border-charcoal/30 flex items-center justify-between">
                <div>
                  <span className="text-[0.65rem] text-stone tracking-wider uppercase block">Primary Condition</span>
                  <span className="text-sm text-washi font-medium">{selectedPatientFile.condition}</span>
                </div>
                <div className="text-right">
                  <span className="text-[0.65rem] text-stone tracking-wider uppercase block">Contact Phone</span>
                  <span className="text-xs text-mist font-mono">{selectedPatientFile.phone}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-kuro/60 border border-charcoal/30">
                <span className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Allergies & Contraindications</span>
                <span className="text-xs text-aka font-medium">{selectedPatientFile.allergies}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-kuro/60 border border-charcoal/30">
                <span className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Consultation Notes on File</span>
                {consultations.filter((c) => c.patient === selectedPatientFile.name).length > 0 ? (
                  consultations
                    .filter((c) => c.patient === selectedPatientFile.name)
                    .map((c) => (
                      <div key={c.id} className="pt-2 border-t border-charcoal/20 first:pt-0 first:border-0 text-xs">
                        <span className="text-stone font-mono">{formatDate(c.date)}: </span>
                        <span className="text-mist">{c.summary}</span>
                      </div>
                    ))
                ) : (
                  <p className="text-xs text-stone italic">No prior archived consultation notes on this device.</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedPatientFile(null)
                  setSection('appointments')
                }}
                className="flex-1 py-2.5 rounded-lg bg-aka/90 hover:bg-aka text-kuro font-medium text-xs transition-colors"
              >
                Schedule Appointment for {selectedPatientFile.name}
              </button>
              <button
                onClick={() => setSelectedPatientFile(null)}
                className="px-4 py-2.5 rounded-lg border border-charcoal/40 text-stone hover:text-washi text-xs"
              >
                Close Chart
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
