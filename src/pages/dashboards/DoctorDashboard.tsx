import { useState } from 'react'
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
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: Calendar, label: 'Appointments', id: 'appointments' },
  { icon: Users, label: 'My Patients', id: 'patients' },
  { icon: FileText, label: 'Consultations', id: 'consultations' },
  { icon: User, label: 'Profile', id: 'profile' },
]

/* ─── Mock Data ─── */
const initialSchedule = [
  { id: 1, time: '9:00 AM', patient: 'Aiko Suzuki', type: 'Follow-up', status: 'completed' as const, notes: '' },
  { id: 2, time: '10:30 AM', patient: 'Kenji Mori', type: 'Consultation', status: 'in-progress' as const, notes: '' },
  { id: 3, time: '1:00 PM', patient: 'Yumi Oda', type: 'Check-up', status: 'upcoming' as const, notes: '' },
  { id: 4, time: '3:30 PM', patient: 'Ren Fujita', type: 'New Patient', status: 'upcoming' as const, notes: '' },
]

const initialPatients = [
  { id: 1, name: 'Aiko Suzuki', lastVisit: 'Today', condition: 'Routine follow-up', age: 34 },
  { id: 2, name: 'Kenji Mori', lastVisit: 'Today', condition: 'Chronic management', age: 52 },
  { id: 3, name: 'Hana Watanabe', lastVisit: 'Sep 30', condition: 'Post-operative care', age: 28 },
  { id: 4, name: 'Takeshi Ito', lastVisit: 'Sep 28', condition: 'Initial assessment', age: 45 },
  { id: 5, name: 'Yumi Oda', lastVisit: 'Sep 20', condition: 'Preventive care', age: 31 },
]

const initialConsultations = [
  { id: 1, patient: 'Aiko Suzuki', date: '2026-10-03', summary: 'Recovery progressing well. Adjusted medication dosage. Follow-up in 2 weeks.' },
  { id: 2, patient: 'Hana Watanabe', date: '2026-09-30', summary: 'Post-operative review. Wound healing normally. Cleared for light activity.' },
  { id: 3, patient: 'Takeshi Ito', date: '2026-09-28', summary: 'Initial assessment complete. Referred for lab work. Scheduled follow-up.' },
]

type ScheduleItem = typeof initialSchedule[number]

const statusColors: Record<string, string> = {
  completed: 'bg-emerald-500/15 text-emerald-400',
  'in-progress': 'bg-amber-500/15 text-amber-400',
  upcoming: 'bg-stone/15 text-stone',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/* ─── Overview ─── */
function OverviewSection({
  userName,
  schedule,
  patients,
  onNavigate,
  onUpdateStatus,
}: {
  userName: string
  schedule: ScheduleItem[]
  patients: typeof initialPatients
  onNavigate: (id: string) => void
  onUpdateStatus: (id: number, status: ScheduleItem['status']) => void
}) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1200px]">
      {/* Greeting */}
      <div className="grid lg:grid-cols-[1fr_180px] gap-6 items-start mb-10">
        <div>
          <p className="text-stone text-xs tracking-[0.2em] uppercase mb-2">{greeting}, Doctor</p>
          <h1 className="font-serif text-shiro text-3xl md:text-4xl leading-tight mb-2">{userName}</h1>
          <p className="text-stone text-sm italic font-serif mb-6">Your practice, connected.</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md">
            {[
              { value: String(schedule.length), label: 'Today', sub: 'appointments' },
              { value: String(patients.length), label: 'Total', sub: 'patients' },
              { value: String(schedule.filter((s) => s.status === 'upcoming').length), label: 'Remaining', sub: 'today' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-xl border border-charcoal/30 bg-sumi/15">
                <span className="text-2xl font-serif text-washi block">{stat.value}</span>
                <span className="text-[0.6rem] text-stone tracking-wider uppercase block mt-1">{stat.label}</span>
                <span className="text-[0.55rem] text-stone/50">{stat.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Portrait image */}
        <div className="hidden lg:block">
          <div className="w-[180px] h-[260px] rounded-2xl overflow-hidden relative">
            <img src="/images/doctor-portal.jpg" alt="" className="w-full h-full object-cover object-top opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-t from-kuro via-kuro/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Stethoscope size={14} className="text-aka/70 mb-1" />
              <p className="text-[0.6rem] text-mist/60 italic font-serif">Dedicated to care.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's schedule */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-xs tracking-[0.15em] uppercase text-stone">Today's Schedule</h2>
            <span className="text-[0.6rem] text-kuro bg-aka/70 px-2 py-0.5 rounded-full">{schedule.length}</span>
          </div>
          <button onClick={() => onNavigate('appointments')} className="text-[0.65rem] text-aka tracking-wider uppercase flex items-center gap-1 hover:gap-2 transition-all">
            Full schedule <ChevronRight size={10} />
          </button>
        </div>

        <div className="relative">
          <div className="absolute left-[23px] top-4 bottom-4 w-px bg-gradient-to-b from-charcoal/50 via-charcoal/30 to-transparent" />
          <div className="space-y-1">
            {schedule.map((slot) => (
              <div key={slot.id} className="relative flex items-center gap-5 p-4 rounded-xl hover:bg-sumi/20 transition-all duration-300 group">
                <div className={`w-[10px] h-[10px] rounded-full border-2 flex-shrink-0 z-10 ${
                  slot.status === 'completed' ? 'border-emerald-500 bg-emerald-500/30' :
                  slot.status === 'in-progress' ? 'border-amber-400 bg-amber-400/30' :
                  'border-charcoal bg-kuro'
                }`} />
                <span className="text-xs text-stone w-16 flex-shrink-0 font-mono">{slot.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-washi">{slot.patient}</p>
                  <p className="text-xs text-stone">{slot.type}</p>
                </div>
                <span className={`text-[0.6rem] px-2.5 py-1 rounded-full tracking-wider uppercase flex-shrink-0 ${statusColors[slot.status]}`}>
                  {slot.status.replace('-', ' ')}
                </span>
                {slot.status === 'upcoming' && (
                  <button
                    onClick={() => onUpdateStatus(slot.id, 'in-progress')}
                    className="text-[0.6rem] text-aka border border-aka/30 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  >
                    Start
                  </button>
                )}
                {slot.status === 'in-progress' && (
                  <button
                    onClick={() => onUpdateStatus(slot.id, 'completed')}
                    className="text-[0.6rem] text-emerald-400 border border-emerald-400/30 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  >
                    Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent patients */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs tracking-[0.15em] uppercase text-stone">Recent Patients</h2>
          <button onClick={() => onNavigate('patients')} className="text-[0.65rem] text-aka tracking-wider uppercase flex items-center gap-1 hover:gap-2 transition-all">
            All patients <ChevronRight size={10} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {patients.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/50 transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-sumi border border-charcoal/50 flex items-center justify-center flex-shrink-0">
                <span className="text-washi text-sm font-medium">{p.name.charAt(0)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-washi truncate">{p.name}</p>
                <p className="text-[0.65rem] text-stone">{p.condition}</p>
              </div>
              <span className="text-[0.6rem] text-stone/60">{p.lastVisit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Appointments ─── */
function AppointmentsSection({
  schedule,
  setSchedule,
  onUpdateStatus,
}: {
  schedule: ScheduleItem[]
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>
  onUpdateStatus: (id: number, status: ScheduleItem['status']) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ patient: '', type: '', time: '' })

  const handleAdd = () => {
    if (!form.patient || !form.time) return
    setSchedule((prev) => [...prev, {
      id: Date.now(),
      time: form.time,
      patient: form.patient,
      type: form.type || 'Consultation',
      status: 'upcoming' as const,
      notes: '',
    }])
    setForm({ patient: '', type: '', time: '' })
    setShowForm(false)
  }

  const handleRemove = (id: number) => setSchedule((prev) => prev.filter((s) => s.id !== id))

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1000px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-shiro mb-1">Appointments</h1>
          <p className="text-stone text-sm">Your complete schedule and patient visits.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 text-xs text-kuro bg-aka/80 hover:bg-aka px-4 py-2.5 rounded transition-colors">
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancel' : 'Add Slot'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 rounded-xl border border-aka/20 bg-sumi/20">
          <h3 className="text-sm text-washi font-medium mb-4">Add Appointment Slot</h3>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Patient *</label>
              <input type="text" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} placeholder="Patient name"
                className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi placeholder:text-charcoal focus:outline-none focus:border-aka/40 transition-colors" />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi focus:outline-none focus:border-aka/40 transition-colors">
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Check-up">Check-up</option>
                <option value="New Patient">New Patient</option>
              </select>
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Time *</label>
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi focus:outline-none focus:border-aka/40 transition-colors" />
            </div>
          </div>
          <button onClick={handleAdd} disabled={!form.patient || !form.time}
            className="flex items-center gap-2 text-xs text-kuro bg-aka/80 hover:bg-aka px-5 py-2.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Check size={14} /> Add Slot
          </button>
        </div>
      )}

      <div className="space-y-2">
        {schedule.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-charcoal/30 rounded-xl">
            <Calendar size={28} className="text-charcoal mx-auto mb-3" />
            <p className="text-stone text-sm">No appointments scheduled.</p>
          </div>
        ) : (
          schedule.map((slot) => (
            <div key={slot.id} className="flex items-center gap-5 p-5 rounded-xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-kuro border border-charcoal/40 flex flex-col items-center justify-center flex-shrink-0">
                <Clock size={14} className="text-stone mb-0.5" />
                <span className="text-xs text-washi font-mono">{slot.time.split(' ')[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-washi font-medium">{slot.patient}</p>
                <p className="text-xs text-stone">{slot.type}</p>
              </div>
              <span className={`text-[0.6rem] px-2.5 py-1 rounded-full tracking-wider uppercase ${statusColors[slot.status]}`}>
                {slot.status.replace('-', ' ')}
              </span>
              {slot.status === 'upcoming' && (
                <button onClick={() => onUpdateStatus(slot.id, 'in-progress')} className="text-[0.6rem] text-aka border border-aka/30 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Start</button>
              )}
              {slot.status === 'in-progress' && (
                <button onClick={() => onUpdateStatus(slot.id, 'completed')} className="text-[0.6rem] text-emerald-400 border border-emerald-400/30 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Complete</button>
              )}
              <button onClick={() => handleRemove(slot.id)} className="text-stone hover:text-aka transition-colors opacity-0 group-hover:opacity-100" title="Remove">
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ─── Patients ─── */
function PatientsSection({
  patients,
  setPatients,
}: {
  patients: typeof initialPatients
  setPatients: React.Dispatch<React.SetStateAction<typeof initialPatients>>
}) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', condition: '', age: '' })
  const [search, setSearch] = useState('')

  const handleAdd = () => {
    if (!form.name) return
    setPatients((prev) => [...prev, { id: Date.now(), name: form.name, lastVisit: 'New', condition: form.condition || 'Pending assessment', age: parseInt(form.age) || 0 }])
    setForm({ name: '', condition: '', age: '' })
    setShowForm(false)
  }

  const handleRemove = (id: number) => setPatients((prev) => prev.filter((p) => p.id !== id))

  const filtered = patients.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1000px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-shiro mb-1">My Patients</h1>
          <p className="text-stone text-sm">{patients.length} patients in your care.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 text-xs text-kuro bg-aka/80 hover:bg-aka px-4 py-2.5 rounded transition-colors">
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancel' : 'Add Patient'}
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients..."
          className="w-full px-4 py-3 bg-sumi/20 border border-charcoal/30 rounded-lg text-sm text-washi placeholder:text-charcoal focus:outline-none focus:border-aka/30 transition-colors"
        />
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-xl border border-aka/20 bg-sumi/20">
          <h3 className="text-sm text-washi font-medium mb-4">Add New Patient</h3>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name"
                className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi placeholder:text-charcoal focus:outline-none focus:border-aka/40 transition-colors" />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Condition</label>
              <input type="text" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} placeholder="Primary condition"
                className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi placeholder:text-charcoal focus:outline-none focus:border-aka/40 transition-colors" />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Age</label>
              <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age"
                className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi placeholder:text-charcoal focus:outline-none focus:border-aka/40 transition-colors" />
            </div>
          </div>
          <button onClick={handleAdd} disabled={!form.name}
            className="flex items-center gap-2 text-xs text-kuro bg-aka/80 hover:bg-aka px-5 py-2.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Check size={14} /> Add Patient
          </button>
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-charcoal/30 rounded-xl">
            <Users size={28} className="text-charcoal mx-auto mb-3" />
            <p className="text-stone text-sm">{search ? 'No patients found.' : 'No patients yet.'}</p>
          </div>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className="flex items-center gap-5 p-5 rounded-xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-sumi border border-charcoal/50 flex items-center justify-center flex-shrink-0">
                <span className="text-washi text-lg font-serif">{p.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-washi font-medium">{p.name}</p>
                <p className="text-xs text-stone">{p.condition}{p.age ? ` · Age ${p.age}` : ''}</p>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                <p className="text-xs text-stone">Last visit</p>
                <p className="text-xs text-mist">{p.lastVisit}</p>
              </div>
              <button onClick={() => handleRemove(p.id)} className="text-stone hover:text-aka transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0" title="Remove">
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ─── Consultations ─── */
function ConsultationsSection({
  consultations,
  setConsultations,
}: {
  consultations: typeof initialConsultations
  setConsultations: React.Dispatch<React.SetStateAction<typeof initialConsultations>>
}) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ patient: '', summary: '' })

  const handleAdd = () => {
    if (!form.patient || !form.summary) return
    setConsultations((prev) => [
      { id: Date.now(), patient: form.patient, date: new Date().toISOString().split('T')[0], summary: form.summary },
      ...prev,
    ])
    setForm({ patient: '', summary: '' })
    setShowForm(false)
  }

  const handleRemove = (id: number) => setConsultations((prev) => prev.filter((c) => c.id !== id))

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1000px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-shiro mb-1">Consultations</h1>
          <p className="text-stone text-sm">Notes, follow-ups, and clinical records.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 text-xs text-kuro bg-aka/80 hover:bg-aka px-4 py-2.5 rounded transition-colors">
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancel' : 'Add Note'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 rounded-xl border border-aka/20 bg-sumi/20">
          <h3 className="text-sm text-washi font-medium mb-4">New Consultation Note</h3>
          <div className="mb-4">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Patient *</label>
            <input type="text" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} placeholder="Patient name"
              className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi placeholder:text-charcoal focus:outline-none focus:border-aka/40 transition-colors" />
          </div>
          <div className="mb-4">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Summary *</label>
            <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Consultation summary..." rows={4}
              className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi placeholder:text-charcoal focus:outline-none focus:border-aka/40 transition-colors resize-none" />
          </div>
          <button onClick={handleAdd} disabled={!form.patient || !form.summary}
            className="flex items-center gap-2 text-xs text-kuro bg-aka/80 hover:bg-aka px-5 py-2.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Check size={14} /> Save Note
          </button>
        </div>
      )}

      <div className="space-y-4">
        {consultations.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-charcoal/30 rounded-xl">
            <FileText size={28} className="text-charcoal mx-auto mb-3" />
            <p className="text-stone text-sm">No consultation notes yet.</p>
          </div>
        ) : (
          consultations.map((note) => (
            <div key={note.id} className="p-5 rounded-xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/50 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sumi border border-charcoal/50 flex items-center justify-center">
                    <span className="text-washi text-xs">{note.patient.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm text-washi">{note.patient}</p>
                    <p className="text-[0.6rem] text-stone">{formatDate(note.date)}</p>
                  </div>
                </div>
                <button onClick={() => handleRemove(note.id)} className="text-charcoal hover:text-aka transition-colors opacity-0 group-hover:opacity-100" title="Remove">
                  <X size={14} />
                </button>
              </div>
              <p className="text-sm text-mist leading-relaxed">{note.summary}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ─── Profile ─── */
function ProfileSection({ user }: { user: { full_name: string; email: string; role: string } }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.full_name)
  const [specialty, setSpecialty] = useState('General Physician')
  const [saved, setSaved] = useState(false)

  const handleSave = () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[600px]">
      <h1 className="font-serif text-2xl text-shiro mb-8">Profile</h1>
      <div className="flex items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-full bg-sumi border border-charcoal flex items-center justify-center">
          <span className="text-washi text-xl font-serif">{name.charAt(0)}</span>
        </div>
        <div>
          <h2 className="text-lg text-washi font-medium">{name}</h2>
          <p className="text-xs text-stone">{user.email}</p>
          <span className="inline-block mt-1 text-[0.6rem] text-aka tracking-wider uppercase border border-aka/30 px-2 py-0.5 rounded">{user.role}</span>
        </div>
      </div>

      {saved && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
          <Check size={14} className="text-emerald-400" />
          <span className="text-sm text-emerald-400">Profile saved successfully.</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="border-b border-charcoal/20 pb-5">
          <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-2">Full Name</label>
          {editing ? (
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi focus:outline-none focus:border-aka/40 transition-colors" />
          ) : (
            <p className="text-sm text-washi">{name}</p>
          )}
        </div>
        <div className="border-b border-charcoal/20 pb-5">
          <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-2">Specialty</label>
          {editing ? (
            <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi focus:outline-none focus:border-aka/40 transition-colors" />
          ) : (
            <p className="text-sm text-washi">{specialty}</p>
          )}
        </div>
        <div className="border-b border-charcoal/20 pb-5">
          <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-2">Email</label>
          <p className="text-sm text-washi">{user.email}</p>
        </div>
        <div className="border-b border-charcoal/20 pb-5">
          <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-2">Role</label>
          <p className="text-sm text-washi capitalize">{user.role}</p>
        </div>
      </div>

      <div className="mt-8">
        {editing ? (
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex items-center gap-2 text-xs text-kuro bg-aka/80 hover:bg-aka px-5 py-2.5 rounded transition-colors">
              <Save size={14} /> Save Changes
            </button>
            <button onClick={() => { setEditing(false); setName(user.full_name) }} className="text-xs text-stone hover:text-washi px-4 py-2.5 rounded border border-charcoal/40 hover:border-charcoal transition-colors">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-xs text-stone hover:text-washi px-4 py-2.5 rounded border border-charcoal/40 hover:border-charcoal transition-colors">
            <Edit3 size={14} /> Edit Profile
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Main ─── */
export default function DoctorDashboard() {
  const { user } = useAuth()
  const [section, setSection] = useState('overview')
  const [schedule, setSchedule] = useState(initialSchedule)
  const [patients, setPatients] = useState(initialPatients)
  const [consultations, setConsultations] = useState(initialConsultations)

  const handleUpdateStatus = (id: number, status: ScheduleItem['status']) => {
    setSchedule((prev) => prev.map((s) => s.id === id ? { ...s, status } : s))
  }

  if (!user) return null

  return (
    <DashboardLayout navItems={navItems} activeSection={section} onNavigate={setSection} roleLabel="Doctor Portal">
      {section === 'overview' && <OverviewSection userName={user.full_name} schedule={schedule} patients={patients} onNavigate={setSection} onUpdateStatus={handleUpdateStatus} />}
      {section === 'appointments' && <AppointmentsSection schedule={schedule} setSchedule={setSchedule} onUpdateStatus={handleUpdateStatus} />}
      {section === 'patients' && <PatientsSection patients={patients} setPatients={setPatients} />}
      {section === 'consultations' && <ConsultationsSection consultations={consultations} setConsultations={setConsultations} />}
      {section === 'profile' && <ProfileSection user={user} />}
    </DashboardLayout>
  )
}
