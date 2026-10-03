import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  User,
  ChevronRight,
  TrendingUp,
  Shield,
  Activity,
  Plus,
  X,
  Check,
  Search,
  Filter,
  Save,
  Edit3,
  Server,
  Lock,
  Download,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: Stethoscope, label: 'Doctors', id: 'doctors' },
  { icon: Users, label: 'Patients', id: 'patients' },
  { icon: Calendar, label: 'Appointments', id: 'appointments' },
  { icon: Shield, label: 'Governance & Security', id: 'governance' },
  { icon: User, label: 'Admin Profile', id: 'profile' },
]

/* ─── Initial Mock Data ─── */
const initialDoctors = [
  { id: 1, name: 'Dr. Haruki Tanaka', specialty: 'General Physician', email: 'haruki.tanaka@drumgate.internal', phone: '+81 90-1122-3344', patients: 32, room: 'Room 204', status: 'active' as const },
  { id: 2, name: 'Dr. Yuki Yamamoto', specialty: 'Dermatologist', email: 'yuki.yamamoto@drumgate.internal', phone: '+81 90-2233-4455', patients: 18, room: 'Room 107', status: 'active' as const },
  { id: 3, name: 'Dr. Ryo Sato', specialty: 'Cardiologist', email: 'ryo.sato@drumgate.internal', phone: '+81 90-3344-5566', patients: 25, room: 'Room 312', status: 'active' as const },
  { id: 4, name: 'Dr. Mai Kimura', specialty: 'Pediatrician', email: 'mai.kimura@drumgate.internal', phone: '+81 90-4455-6677', patients: 41, room: 'Room 118', status: 'on-leave' as const },
  { id: 5, name: 'Dr. Kenji Ito', specialty: 'Neurologist', email: 'kenji.ito@drumgate.internal', phone: '+81 90-5566-7788', patients: 14, room: 'Room 401', status: 'inactive' as const },
]

const initialPatients = [
  { id: 1, name: 'Aiko Suzuki', email: 'aiko.suzuki@patient.drumgate.com', doctor: 'Dr. Haruki Tanaka', registered: '2026-10-01', age: 34, phone: '+81 90-1234-5678', avatar: 'A' },
  { id: 2, name: 'Kenji Mori', email: 'kenji.mori@patient.drumgate.com', doctor: 'Dr. Yuki Yamamoto', registered: '2026-09-28', age: 52, phone: '+81 90-8765-4321', avatar: 'K' },
  { id: 3, name: 'Hana Watanabe', email: 'hana.watanabe@patient.drumgate.com', doctor: 'Dr. Ryo Sato', registered: '2026-09-25', age: 28, phone: '+81 90-4567-8901', avatar: 'H' },
  { id: 4, name: 'Ren Fujita', email: 'ren.fujita@patient.drumgate.com', doctor: 'Dr. Haruki Tanaka', registered: '2026-09-22', age: 41, phone: '+81 90-5678-9012', avatar: 'R' },
  { id: 5, name: 'Yumi Oda', email: 'yumi.oda@patient.drumgate.com', doctor: 'Dr. Mai Kimura', registered: '2026-09-18', age: 31, phone: '+81 90-6789-0123', avatar: 'Y' },
]

const initialAppointments = [
  { id: 1, patient: 'Aiko Suzuki', doctor: 'Dr. Haruki Tanaka', date: '2026-10-08', time: '10:30 AM', room: 'Room 204', status: 'confirmed' as const },
  { id: 2, patient: 'Kenji Mori', doctor: 'Dr. Yuki Yamamoto', date: '2026-10-08', time: '02:00 PM', room: 'Room 107', status: 'confirmed' as const },
  { id: 3, patient: 'Yumi Oda', doctor: 'Dr. Ryo Sato', date: '2026-10-10', time: '09:00 AM', room: 'Room 312', status: 'pending' as const },
  { id: 4, patient: 'Ren Fujita', doctor: 'Dr. Haruki Tanaka', date: '2026-10-12', time: '11:00 AM', room: 'Room 204', status: 'confirmed' as const },
  { id: 5, patient: 'Hana Watanabe', doctor: 'Dr. Mai Kimura', date: '2026-10-15', time: '03:30 PM', room: 'Room 118', status: 'pending' as const },
]

const initialLogs = [
  { id: 1, action: 'Role authorization verified', detail: 'Dynamic MySQL role resolution executed for user session', time: 'Just now', severity: 'info' },
  { id: 2, action: 'Clinical encounter logged', detail: 'Dr. Haruki Tanaka filed consultation for Aiko Suzuki', time: '14 mins ago', severity: 'info' },
  { id: 3, action: 'Automated backup completed', detail: 'Database snapshot encrypted & replicated to secondary vault', time: '1 hour ago', severity: 'info' },
  { id: 4, action: 'Doctor status update', detail: 'Dr. Mai Kimura placed on scheduled medical leave', time: '3 hours ago', severity: 'warning' },
]

type DoctorItem = typeof initialDoctors[number]
type PatientItem = typeof initialPatients[number]
type AppointmentItem = typeof initialAppointments[number]

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

/* ─── Overview Section ─── */
function OverviewSection({
  userName,
  doctors,
  patients,
  appointments,
  logs,
  onNavigate,
}: {
  userName: string
  doctors: DoctorItem[]
  patients: PatientItem[]
  appointments: AppointmentItem[]
  logs: typeof initialLogs
  onNavigate: (id: string) => void
}) {
  const activeDoctorsCount = doctors.filter((d) => d.status === 'active').length
  const confirmedAptsCount = appointments.filter((a) => a.status === 'confirmed').length

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1100px] space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-charcoal/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aka/10 border border-aka/30 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-aka animate-pulse" />
            <span className="text-[0.65rem] tracking-[0.2em] uppercase text-aka font-mono">
              Administrative Command Center
            </span>
          </div>
          <p className="text-stone text-xs tracking-[0.2em] uppercase mb-1">Super Administrator</p>
          <h1 className="font-serif text-shiro text-3xl md:text-4xl leading-tight">
            {userName}
          </h1>
          <p className="text-stone text-sm italic font-serif mt-1">
            "Governance with clarity. Harmony across every corridor of care."
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('doctors')}
            className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-4 py-2.5 rounded-lg transition-all"
          >
            <Stethoscope size={14} /> Manage Doctors
          </button>
          <button
            onClick={() => onNavigate('appointments')}
            className="flex items-center gap-2 text-xs font-medium text-washi bg-sumi/40 hover:bg-sumi/70 border border-charcoal/50 px-4 py-2.5 rounded-lg transition-all"
          >
            <Calendar size={14} className="text-aka" /> All Appointments
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('doctors')}
          className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/20 hover:border-aka/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <Stethoscope size={16} className="text-stone" />
            <span className="text-[0.6rem] text-emerald-400 font-mono">{activeDoctorsCount} active</span>
          </div>
          <span className="text-2xl md:text-3xl font-serif text-washi font-medium">{doctors.length}</span>
          <span className="text-[0.65rem] text-stone tracking-wider uppercase block mt-1">Licensed Doctors</span>
        </div>

        <div
          onClick={() => onNavigate('patients')}
          className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/20 hover:border-aka/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <Users size={16} className="text-stone" />
            <TrendingUp size={14} className="text-emerald-400" />
          </div>
          <span className="text-2xl md:text-3xl font-serif text-washi font-medium">{patients.length}</span>
          <span className="text-[0.65rem] text-stone tracking-wider uppercase block mt-1">Enrolled Patients</span>
        </div>

        <div
          onClick={() => onNavigate('appointments')}
          className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/20 hover:border-aka/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar size={16} className="text-stone" />
            <span className="text-[0.6rem] text-aka font-mono">{confirmedAptsCount} confirmed</span>
          </div>
          <span className="text-2xl md:text-3xl font-serif text-washi font-medium">{appointments.length}</span>
          <span className="text-[0.65rem] text-stone tracking-wider uppercase block mt-1">Active Bookings</span>
        </div>

        <div className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/20">
          <div className="flex items-center justify-between mb-2">
            <Activity size={16} className="text-emerald-400" />
            <span className="text-[0.6rem] text-emerald-400 font-mono">14ms ping</span>
          </div>
          <span className="text-2xl md:text-3xl font-serif text-emerald-400 font-medium">99.98%</span>
          <span className="text-[0.65rem] text-stone tracking-wider uppercase block mt-1">Platform Uptime</span>
        </div>
      </div>

      {/* Two columns: Doctors overview + Live Audit Feed */}
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
        {/* Doctors Quick Roster */}
        <div className="p-6 rounded-2xl border border-charcoal/30 bg-sumi/15 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal/30">
            <div className="flex items-center gap-2">
              <Stethoscope size={16} className="text-aka" />
              <h2 className="text-xs tracking-[0.18em] uppercase text-stone font-mono">
                Medical Staff Overview
              </h2>
            </div>
            <button
              onClick={() => onNavigate('doctors')}
              className="text-[0.65rem] text-aka tracking-wider uppercase flex items-center gap-1 hover:gap-2 transition-all font-medium"
            >
              Manage ({doctors.length}) <ChevronRight size={12} />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {doctors.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-xl border border-charcoal/20 bg-kuro/40 hover:border-charcoal/60 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-sumi border border-charcoal/50 flex items-center justify-center flex-shrink-0 text-washi font-medium">
                    {doc.name.charAt(4)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-washi font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-stone truncate">{doc.specialty} · {doc.room}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-stone hidden sm:inline font-mono">{doc.patients} pts</span>
                  <span className={`text-[0.6rem] px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                    doc.status === 'active'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : doc.status === 'on-leave'
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-stone/15 text-stone'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Audit Feed */}
        <div className="p-6 rounded-2xl border border-charcoal/30 bg-sumi/15 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal/30">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-aka" />
              <h2 className="text-xs tracking-[0.18em] uppercase text-stone font-mono">
                System Audit Events
              </h2>
            </div>
            <span className="text-[0.65rem] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Live Stream
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-charcoal/20 bg-kuro/40 flex items-start gap-3"
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  log.severity === 'warning' ? 'bg-amber-400' : 'bg-aka'
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-washi font-medium truncate">{log.action}</p>
                    <span className="text-[0.6rem] text-stone font-mono flex-shrink-0">{log.time}</span>
                  </div>
                  <p className="text-[0.65rem] text-stone mt-0.5 leading-relaxed">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Doctors Management Section ─── */
function DoctorsSection({
  doctors,
  setDoctors,
}: {
  doctors: DoctorItem[]
  setDoctors: React.Dispatch<React.SetStateAction<DoctorItem[]>>
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'on-leave' | 'inactive'>('all')
  const [form, setForm] = useState({
    name: '',
    specialty: 'Cardiologist',
    email: '',
    phone: '',
    room: 'Room 205',
    status: 'active' as const,
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    const newDoc: DoctorItem = {
      id: Date.now(),
      name: form.name.startsWith('Dr.') ? form.name : `Dr. ${form.name}`,
      specialty: form.specialty,
      email: form.email,
      phone: form.phone || '+81 90-0000-0000',
      room: form.room,
      status: form.status,
      patients: 0,
    }
    setDoctors((prev) => [newDoc, ...prev])
    setForm({
      name: '',
      specialty: 'Cardiologist',
      email: '',
      phone: '',
      room: 'Room 205',
      status: 'active',
    })
    setShowAdd(false)
  }

  const toggleStatus = (id: number) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextStatus = d.status === 'active' ? 'on-leave' : d.status === 'on-leave' ? 'inactive' : 'active'
          return { ...d, status: nextStatus }
        }
        return d
      })
    )
  }

  const handleDelete = (id: number) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id))
  }

  const filtered = doctors.filter((doc) => {
    const matchesFilter = statusFilter === 'all' || doc.status === statusFilter
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
      doc.email.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1000px] space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-shiro mb-1">Doctors & Medical Faculty</h1>
          <p className="text-stone text-sm">Provision medical credentials, manage room assignments, and monitor active caseloads.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-4 py-2.5 rounded-lg transition-colors w-fit"
        >
          {showAdd ? <X size={14} /> : <Plus size={14} />}
          {showAdd ? 'Close' : 'Add Medical Doctor'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="p-6 rounded-2xl border border-aka/30 bg-sumi/30 space-y-4 shadow-xl animate-fadeIn">
          <h3 className="font-serif text-lg text-washi">Credential New Physician</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Doctor Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="e.g. Dr. Kenzo Tange"
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Department / Specialty</label>
              <select
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              >
                <option value="General Physician">General Physician</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
              </select>
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Clinic Suite / Room</label>
              <input
                type="text"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                placeholder="e.g. Room 208"
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Official Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="name@drumgate.internal"
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Direct Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+81 90-..."
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Initial Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              >
                <option value="active">Active Medical Staff</option>
                <option value="on-leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-5 py-2.5 rounded-lg transition-colors"
          >
            <Check size={14} /> Provision Physician Credentials
          </button>
        </form>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-sumi/30 p-1 rounded-lg border border-charcoal/30 w-fit">
          {(['all', 'active', 'on-leave', 'inactive'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded text-xs capitalize transition-colors ${
                statusFilter === tab ? 'bg-aka/20 text-washi font-medium border border-aka/30' : 'text-stone hover:text-washi'
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
            placeholder="Search doctor or specialty..."
            className="w-full pl-9 pr-3 py-2 bg-sumi/20 border border-charcoal/40 rounded-lg text-xs text-washi placeholder:text-stone/50 focus:outline-none focus:border-aka/40"
          />
        </div>
      </div>

      {/* Doctors Table / Cards */}
      <div className="space-y-3">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-sumi border border-charcoal/50 flex items-center justify-center flex-shrink-0 text-washi font-medium">
                <Stethoscope size={18} className="text-aka" />
              </div>
              <div>
                <h3 className="text-base text-washi font-medium">{doc.name}</h3>
                <p className="text-xs text-stone">{doc.specialty} · {doc.room}</p>
                <p className="text-[0.65rem] text-mist/60 font-mono mt-0.5">{doc.email} · {doc.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <div className="text-right mr-2 hidden md:block">
                <span className="text-sm font-serif text-washi font-medium">{doc.patients}</span>
                <span className="text-[0.65rem] text-stone block">Patients</span>
              </div>

              <button
                onClick={() => toggleStatus(doc.id)}
                className={`text-[0.65rem] px-3 py-1.5 rounded-lg uppercase tracking-wider font-mono border transition-all ${
                  doc.status === 'active'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-amber-500/15 hover:text-amber-400'
                    : doc.status === 'on-leave'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-stone/20 hover:text-stone'
                    : 'bg-stone/15 text-stone border-charcoal/40 hover:bg-emerald-500/15 hover:text-emerald-400'
                }`}
                title="Click to cycle status: Active -> On-Leave -> Inactive"
              >
                {doc.status}
              </button>

              <button
                onClick={() => handleDelete(doc.id)}
                className="text-stone hover:text-aka border border-charcoal/30 hover:border-aka/40 p-1.5 rounded-lg transition-colors"
                title="Remove Doctor"
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

/* ─── Patients Management Section ─── */
function PatientsSection({
  patients,
  setPatients,
  doctors,
}: {
  patients: PatientItem[]
  setPatients: React.Dispatch<React.SetStateAction<PatientItem[]>>
  doctors: DoctorItem[]
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    doctor: doctors[0]?.name || 'Dr. Haruki Tanaka',
    age: '',
    phone: '',
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    const newP: PatientItem = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      doctor: form.doctor,
      registered: new Date().toISOString().split('T')[0],
      age: parseInt(form.age) || 30,
      phone: form.phone || '+81 90-0000-0000',
      avatar: form.name.charAt(0).toUpperCase(),
    }
    setPatients((prev) => [newP, ...prev])
    setForm({
      name: '',
      email: '',
      doctor: doctors[0]?.name || 'Dr. Haruki Tanaka',
      age: '',
      phone: '',
    })
    setShowAdd(false)
  }

  const handleDelete = (id: number) => {
    setPatients((prev) => prev.filter((p) => p.id !== id))
  }

  const handleReassign = (patientId: number, newDoc: string) => {
    setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, doctor: newDoc } : p)))
  }

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.doctor.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1000px] space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-shiro mb-1">Registered Patient Directory</h1>
          <p className="text-stone text-sm">Review all registered patients, assign primary physicians, and oversee clinical intake.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-4 py-2.5 rounded-lg transition-colors w-fit"
        >
          {showAdd ? <X size={14} /> : <Plus size={14} />}
          {showAdd ? 'Close' : 'Enroll New Patient'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="p-6 rounded-2xl border border-aka/30 bg-sumi/30 space-y-4 shadow-xl animate-fadeIn">
          <h3 className="font-serif text-lg text-washi">Enroll Patient Account</h3>
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
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="patient@drumgate.com"
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Primary Physician</label>
              <select
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
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
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+81 90-..."
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-5 py-2.5 rounded-lg transition-colors"
          >
            <Check size={14} /> Commit Patient Registration
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
          placeholder="Search patients by name, email, or doctor..."
          className="w-full pl-9 pr-3 py-2.5 bg-sumi/20 border border-charcoal/40 rounded-lg text-xs text-washi placeholder:text-stone/50 focus:outline-none focus:border-aka/40"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-sumi border border-charcoal/50 flex items-center justify-center font-serif text-lg text-washi flex-shrink-0">
                {p.avatar}
              </div>
              <div>
                <h3 className="text-base text-washi font-medium">{p.name}</h3>
                <p className="text-xs text-stone">{p.email} · {p.phone}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[0.65rem] text-stone">Physician:</span>
                  <select
                    value={p.doctor}
                    onChange={(e) => handleReassign(p.id, e.target.value)}
                    className="bg-kuro/70 border border-charcoal/40 rounded text-xs text-aka px-2 py-0.5"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="text-right">
                <span className="text-[0.65rem] text-stone block">Enrolled</span>
                <span className="text-xs text-mist font-mono">{formatDate(p.registered)}</span>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-stone hover:text-aka border border-charcoal/30 hover:border-aka/40 p-1.5 rounded-lg transition-colors"
                title="Remove Patient"
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

/* ─── Appointments Oversight Section ─── */
function AppointmentsSection({
  appointments,
  setAppointments,
  doctors,
  patients,
}: {
  appointments: AppointmentItem[]
  setAppointments: React.Dispatch<React.SetStateAction<AppointmentItem[]>>
  doctors: DoctorItem[]
  patients: PatientItem[]
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending'>('all')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    patient: patients[0]?.name || 'Aiko Suzuki',
    doctor: doctors[0]?.name || 'Dr. Haruki Tanaka',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '11:00 AM',
    room: 'Room 204',
    status: 'confirmed' as const,
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const newApt: AppointmentItem = {
      id: Date.now(),
      patient: form.patient,
      doctor: form.doctor,
      date: form.date,
      time: form.time,
      room: form.room,
      status: form.status,
    }
    setAppointments((prev) => [newApt, ...prev])
    setShowAdd(false)
  }

  const toggleStatus = (id: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === 'confirmed' ? 'pending' : 'confirmed' } : a))
    )
  }

  const handleDelete = (id: number) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id))
  }

  const filtered = appointments.filter((a) => {
    const matchesFilter = statusFilter === 'all' || a.status === statusFilter
    const matchesSearch =
      a.patient.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1000px] space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-shiro mb-1">Appointments Master Schedule</h1>
          <p className="text-stone text-sm">Full clinic oversight across all medical specialties and outpatient schedules.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-4 py-2.5 rounded-lg transition-colors w-fit"
        >
          {showAdd ? <X size={14} /> : <Plus size={14} />}
          {showAdd ? 'Close' : 'Schedule New Booking'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="p-6 rounded-2xl border border-aka/30 bg-sumi/30 space-y-4 shadow-xl animate-fadeIn">
          <h3 className="font-serif text-lg text-washi">Dispatch Administrative Booking</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Patient</label>
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
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Attending Physician</label>
              <select
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Consultation Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Time</label>
              <input
                type="text"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="11:00 AM"
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Suite / Room</label>
              <input
                type="text"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-kuro border border-charcoal/50 rounded-lg text-sm text-washi"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending Review</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-5 py-2.5 rounded-lg transition-colors"
          >
            <Check size={14} /> Schedule Appointment
          </button>
        </form>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-sumi/30 p-1 rounded-lg border border-charcoal/30 w-fit">
          {(['all', 'confirmed', 'pending'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded text-xs capitalize transition-colors ${
                statusFilter === tab ? 'bg-aka/20 text-washi font-medium border border-aka/30' : 'text-stone hover:text-washi'
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
            placeholder="Search patient or doctor..."
            className="w-full pl-9 pr-3 py-2 bg-sumi/20 border border-charcoal/40 rounded-lg text-xs text-washi placeholder:text-stone/50 focus:outline-none focus:border-aka/40"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((apt) => (
          <div
            key={apt.id}
            className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-kuro border border-charcoal/50 flex flex-col items-center justify-center font-mono text-xs text-washi flex-shrink-0">
                <span className="text-[0.6rem] text-stone uppercase">{formatDate(apt.date).split(' ')[0]}</span>
                <span className="text-xl font-serif text-washi font-medium">{formatDate(apt.date).split(' ')[1]}</span>
              </div>
              <div>
                <h3 className="text-base text-washi font-medium">{apt.patient}</h3>
                <p className="text-xs text-stone">{apt.doctor} · {apt.room}</p>
                <p className="text-[0.65rem] text-mist/60 font-mono mt-0.5">{apt.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <button
                onClick={() => toggleStatus(apt.id)}
                className={`text-[0.65rem] px-3 py-1.5 rounded-lg uppercase tracking-wider font-mono border transition-all ${
                  apt.status === 'confirmed'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}
                title="Click to toggle status"
              >
                {apt.status}
              </button>
              <button
                onClick={() => handleDelete(apt.id)}
                className="text-stone hover:text-aka border border-charcoal/30 hover:border-aka/40 p-1.5 rounded-lg transition-colors"
                title="Cancel Appointment"
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

/* ─── Governance & Security Section ─── */
function GovernanceSection({
  logs,
  setLogs,
}: {
  logs: typeof initialLogs
  setLogs: React.Dispatch<React.SetStateAction<typeof initialLogs>>
}) {
  const [settings, setSettings] = useState({
    enforce2FA: true,
    hipaaAudit: true,
    sessionTimeout: true,
    maintenanceMode: false,
  })
  const [feedback, setFeedback] = useState('')

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      setFeedback(`Security policy '${key}' updated.`)
      setTimeout(() => setFeedback(''), 2500)
      return updated
    })
  }

  const exportAuditTrail = () => {
    const data = {
      platform: 'DrumGate Medical Portal',
      environment: 'Production Secured',
      settings,
      logs,
      exportTimestamp: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `DrumGate-SecurityAudit-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[900px] space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-shiro mb-1">Platform Governance & Security</h1>
          <p className="text-stone text-sm">Regulatory HIPAA compliance, encryption directives, and audit trails.</p>
        </div>
        <button
          onClick={exportAuditTrail}
          className="flex items-center gap-2 text-xs text-stone hover:text-washi border border-charcoal/40 hover:border-charcoal px-3.5 py-2 rounded-lg transition-colors"
        >
          <Download size={14} /> Export Audit Log
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400 animate-fadeIn">
          <Check size={14} /> {feedback}
        </div>
      )}

      {/* Security Policies Grid */}
      <div className="space-y-3">
        {[
          {
            key: 'enforce2FA' as const,
            title: 'Enforce Multi-Factor Authentication (MFA)',
            desc: 'Requires TOTP or biometric hardware security key for all clinical doctor and administrative logins.',
            icon: Lock,
          },
          {
            key: 'hipaaAudit' as const,
            title: 'Continuous HIPAA & GDPR Access Auditing',
            desc: 'Cryptographically records every patient chart access, prescription issue, and diagnostic export.',
            icon: Shield,
          },
          {
            key: 'sessionTimeout' as const,
            title: 'Automatic Inactivity Session Expiry (15 Mins)',
            desc: 'Terminates active browser sessions after 15 minutes of idle workstation behavior.',
            icon: Activity,
          },
          {
            key: 'maintenanceMode' as const,
            title: 'Emergency Maintenance Lockdown',
            desc: 'Temporarily restricts non-administrative patient login for immediate database or infrastructure hotfixes.',
            icon: AlertTriangle,
          },
        ].map((item) => (
          <div
            key={item.key}
            className="p-5 rounded-2xl border border-charcoal/30 bg-sumi/20 flex items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-kuro border border-charcoal/50 flex items-center justify-center flex-shrink-0 text-aka mt-0.5">
                <item.icon size={18} />
              </div>
              <div>
                <h3 className="text-sm text-washi font-medium">{item.title}</h3>
                <p className="text-xs text-stone leading-relaxed">{item.desc}</p>
              </div>
            </div>

            <button
              onClick={() => toggleSetting(item.key)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                settings[item.key] ? 'bg-aka' : 'bg-charcoal/60'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-washi transition-transform absolute top-1 ${
                  settings[item.key] ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Admin Profile Section ─── */
function ProfileSection({ user }: { user: { full_name: string; email: string; role: string } }) {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    name: user.full_name,
    email: user.email,
    securityKey: 'FIDO2-DG-ADMIN-9901',
    accessRole: 'Super Administrator (Full System Scope)',
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
        <h1 className="font-serif text-3xl text-shiro mb-1">Administrator Profile</h1>
        <p className="text-stone text-sm">Elevated system permissions and security clearance credentials.</p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400 animate-fadeIn">
          <Check size={14} /> Administrator profile saved.
        </div>
      )}

      <div className="flex items-center gap-5 p-5 rounded-2xl border border-charcoal/30 bg-sumi/20">
        <div className="w-16 h-16 rounded-full bg-sumi border border-charcoal flex items-center justify-center flex-shrink-0">
          <Shield size={24} className="text-aka" />
        </div>
        <div>
          <h2 className="text-xl text-washi font-medium">{profile.name}</h2>
          <p className="text-xs text-stone">{profile.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[0.6rem] text-aka tracking-wider uppercase border border-aka/30 px-2 py-0.5 rounded font-mono">
              Root Clearance
            </span>
            <span className="text-[0.6rem] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
              FIDO2 Verified
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl border border-charcoal/20 bg-sumi/10">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Admin Full Name</label>
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
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Administrative Email</label>
            <p className="text-sm text-washi">{profile.email}</p>
          </div>

          <div className="p-4 rounded-xl border border-charcoal/20 bg-sumi/10">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Security Token / Hardware Key</label>
            <p className="text-xs text-mist font-mono">{profile.securityKey}</p>
          </div>

          <div className="p-4 rounded-xl border border-charcoal/20 bg-sumi/10">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">Role Authority Level</label>
            <p className="text-sm text-washi">{profile.accessRole}</p>
          </div>
        </div>

        <div className="pt-2">
          {editing ? (
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 text-xs font-medium text-kuro bg-aka/90 hover:bg-aka px-5 py-2.5 rounded-lg transition-colors"
              >
                <Save size={14} /> Save Changes
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
              <Edit3 size={14} /> Edit Admin Credentials
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

/* ─── Main Admin Dashboard ─── */
export default function AdminDashboard() {
  const { user } = useAuth()
  const [section, setSection] = useState('overview')
  const [doctors, setDoctors] = useState(initialDoctors)
  const [patients, setPatients] = useState(initialPatients)
  const [appointments, setAppointments] = useState(initialAppointments)
  const [logs, setLogs] = useState(initialLogs)

  if (!user) return null

  return (
    <DashboardLayout
      navItems={navItems}
      activeSection={section}
      onNavigate={setSection}
      roleLabel="Admin Portal"
      coverImage="/images/admin-portal.jpg"
      coverQuote={{
        kanji: '統',
        title: 'ADMINISTRATIVE COMMAND',
        subtitle: 'Flawless orchestration across the entire healthcare ecosystem.',
        badge: 'Platform Governance',
      }}
    >
      {section === 'overview' && (
        <OverviewSection
          userName={user.full_name}
          doctors={doctors}
          patients={patients}
          appointments={appointments}
          logs={logs}
          onNavigate={setSection}
        />
      )}
      {section === 'doctors' && (
        <DoctorsSection doctors={doctors} setDoctors={setDoctors} />
      )}
      {section === 'patients' && (
        <PatientsSection
          patients={patients}
          setPatients={setPatients}
          doctors={doctors}
        />
      )}
      {section === 'appointments' && (
        <AppointmentsSection
          appointments={appointments}
          setAppointments={setAppointments}
          doctors={doctors}
          patients={patients}
        />
      )}
      {section === 'governance' && (
        <GovernanceSection logs={logs} setLogs={setLogs} />
      )}
      {section === 'profile' && <ProfileSection user={user} />}
    </DashboardLayout>
  )
}
