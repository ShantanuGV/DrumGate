import { useState } from 'react'
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
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: Calendar, label: 'Appointments', id: 'appointments' },
  { icon: FileText, label: 'Medical History', id: 'history' },
  { icon: User, label: 'Profile', id: 'profile' },
]

/* ─── Mock Data ─── */
const initialAppointments = [
  { id: 1, doctor: 'Dr. Haruki Tanaka', specialty: 'General Physician', date: '2026-10-08', time: '10:30 AM', location: 'Room 204', status: 'confirmed' as const },
  { id: 2, doctor: 'Dr. Yuki Yamamoto', specialty: 'Dermatologist', date: '2026-10-22', time: '2:00 PM', location: 'Room 107', status: 'confirmed' as const },
  { id: 3, doctor: 'Dr. Ryo Sato', specialty: 'Cardiologist', date: '2026-11-05', time: '9:00 AM', location: 'Room 312', status: 'pending' as const },
]

const initialHistory = [
  { id: 1, date: '2026-09-28', type: 'Consultation', doctor: 'Dr. Tanaka', note: 'Routine check-up. All vitals normal. Blood pressure 120/80.' },
  { id: 2, date: '2026-09-12', type: 'Lab Results', doctor: 'Dr. Yamamoto', note: 'Blood panel complete. All values within normal range.' },
  { id: 3, date: '2026-08-30', type: 'Follow-up', doctor: 'Dr. Tanaka', note: 'Recovery progressing well. Medication adjusted.' },
  { id: 4, date: '2026-08-15', type: 'Prescription', doctor: 'Dr. Sato', note: 'Renewed prescription for maintenance medication.' },
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/* ─── Overview ─── */
function OverviewSection({
  userName,
  appointments,
  history,
  onNavigate,
}: {
  userName: string
  appointments: typeof initialAppointments
  history: typeof initialHistory
  onNavigate: (id: string) => void
}) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const next = appointments.find((a) => a.status === 'confirmed')

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1200px]">
      {/* Greeting with portrait image */}
      <div className="grid lg:grid-cols-[1fr_220px] gap-8 mb-12">
        <div>
          <p className="text-stone text-xs tracking-[0.2em] uppercase mb-2">{greeting}</p>
          <h1 className="font-serif text-shiro text-3xl md:text-4xl leading-tight mb-3">
            {userName}
          </h1>
          <p className="text-stone text-sm italic font-serif mb-8">
            Your health, gently organized.
          </p>

          {/* Next appointment card */}
          {next && (
            <div className="relative p-6 rounded-xl border border-charcoal/40 bg-gradient-to-br from-sumi/50 to-kuro overflow-hidden group hover:border-aka/20 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-washi" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-washi" />
                </svg>
              </div>

              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-aka animate-pulse" />
                <span className="text-aka text-[0.65rem] tracking-[0.15em] uppercase font-medium">
                  Next appointment
                </span>
              </div>

              <h3 className="font-serif text-xl text-shiro mb-1">{next.doctor}</h3>
              <p className="text-stone text-xs mb-5">{next.specialty}</p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-5">
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-stone" />
                  <span className="text-sm text-mist">{formatDate(next.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-stone" />
                  <span className="text-sm text-mist">{next.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-stone" />
                  <span className="text-sm text-mist">{next.location}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('appointments')}
                className="flex items-center gap-2 text-xs text-aka tracking-wider uppercase hover:gap-3 transition-all duration-300"
              >
                View all appointments <ArrowUpRight size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Portrait image — full height side element */}
        <div className="hidden lg:block relative h-full min-h-[320px]">
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <img
              src="/images/patient-portal.jpg"
              alt=""
              className="w-full h-full object-cover object-top opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kuro via-kuro/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-kuro/40 to-transparent" />
          </div>
          <div className="relative h-full flex flex-col justify-end p-5">
            <Heart size={16} className="text-aka mb-2" />
            <p className="text-[0.65rem] text-mist/70 italic font-serif leading-relaxed">
              Where care<br />finds its way.
            </p>
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upcoming */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs tracking-[0.15em] uppercase text-stone">Upcoming</h2>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-[0.65rem] text-aka tracking-wider uppercase flex items-center gap-1 hover:gap-2 transition-all"
            >
              See all <ChevronRight size={10} />
            </button>
          </div>
          <div className="space-y-3">
            {appointments.slice(0, 3).map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-4 rounded-lg border border-charcoal/30 bg-sumi/15 hover:border-charcoal/50 hover:bg-sumi/25 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 rounded-lg bg-kuro border border-charcoal/40 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[0.6rem] text-stone uppercase leading-none">{formatDate(apt.date).split(' ')[0]}</span>
                  <span className="text-sm text-washi font-medium">{formatDate(apt.date).split(' ')[1]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-washi truncate">{apt.doctor}</p>
                  <p className="text-xs text-stone">{apt.specialty} · {apt.time}</p>
                </div>
                <ChevronRight size={14} className="text-charcoal group-hover:text-stone transition-colors flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent history */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs tracking-[0.15em] uppercase text-stone">Recent History</h2>
            <button
              onClick={() => onNavigate('history')}
              className="text-[0.65rem] text-aka tracking-wider uppercase flex items-center gap-1 hover:gap-2 transition-all"
            >
              Full history <ChevronRight size={10} />
            </button>
          </div>
          <div className="space-y-3">
            {history.slice(0, 3).map((entry) => (
              <div key={entry.id} className="p-4 rounded-lg border border-charcoal/30 bg-sumi/15 hover:border-charcoal/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-aka/60" />
                    <span className="text-xs text-washi font-medium">{entry.type}</span>
                  </div>
                  <span className="text-[0.65rem] text-stone">{formatDate(entry.date)}</span>
                </div>
                <p className="text-xs text-stone leading-relaxed">{entry.note}</p>
                <p className="text-[0.6rem] text-stone/60 mt-2">{entry.doctor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Appointments ─── */
function AppointmentsSection({
  appointments,
  setAppointments,
}: {
  appointments: typeof initialAppointments
  setAppointments: React.Dispatch<React.SetStateAction<typeof initialAppointments>>
}) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ doctor: '', specialty: '', date: '', time: '', location: '' })

  const handleAdd = () => {
    if (!form.doctor || !form.date || !form.time) return
    const newApt = {
      id: Date.now(),
      doctor: form.doctor,
      specialty: form.specialty || 'General',
      date: form.date,
      time: form.time,
      location: form.location || 'TBD',
      status: 'pending' as const,
    }
    setAppointments((prev) => [...prev, newApt])
    setForm({ doctor: '', specialty: '', date: '', time: '', location: '' })
    setShowForm(false)
  }

  const handleCancel = (id: number) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1000px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-shiro mb-1">Appointments</h1>
          <p className="text-stone text-sm">Manage your upcoming and past visits.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-xs text-kuro bg-aka/80 hover:bg-aka px-4 py-2.5 rounded transition-colors"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancel' : 'Book New'}
        </button>
      </div>

      {/* Add appointment form */}
      {showForm && (
        <div className="mb-8 p-6 rounded-xl border border-aka/20 bg-sumi/20">
          <h3 className="text-sm text-washi font-medium mb-4">Book New Appointment</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Doctor Name *</label>
              <input
                type="text"
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                placeholder="Dr. Name"
                className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi placeholder:text-charcoal focus:outline-none focus:border-aka/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Specialty</label>
              <input
                type="text"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                placeholder="e.g. Cardiologist"
                className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi placeholder:text-charcoal focus:outline-none focus:border-aka/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi focus:outline-none focus:border-aka/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Time *</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi focus:outline-none focus:border-aka/40 transition-colors"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Room number or address"
              className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi placeholder:text-charcoal focus:outline-none focus:border-aka/40 transition-colors"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!form.doctor || !form.date || !form.time}
            className="flex items-center gap-2 text-xs text-kuro bg-aka/80 hover:bg-aka px-5 py-2.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={14} /> Confirm Booking
          </button>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {appointments.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-charcoal/30 rounded-xl">
            <Calendar size={28} className="text-charcoal mx-auto mb-3" />
            <p className="text-stone text-sm mb-2">No appointments yet.</p>
            <button onClick={() => setShowForm(true)} className="text-xs text-aka tracking-wider uppercase">
              Book your first appointment
            </button>
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="flex items-center gap-5 p-5 rounded-xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-kuro border border-charcoal/40 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-[0.6rem] text-stone uppercase">{formatDate(apt.date).split(' ')[0]}</span>
                <span className="text-lg text-washi font-serif">{formatDate(apt.date).split(' ')[1]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-washi font-medium">{apt.doctor}</p>
                <p className="text-xs text-stone">{apt.specialty} · {apt.time} · {apt.location}</p>
              </div>
              <span className={`text-[0.6rem] px-2.5 py-1 rounded-full uppercase tracking-wider flex-shrink-0 ${
                apt.status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
              }`}>
                {apt.status}
              </span>
              <button
                onClick={() => handleCancel(apt.id)}
                className="text-stone hover:text-aka transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                title="Cancel appointment"
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ─── Medical History ─── */
function HistorySection({
  history,
  setHistory,
}: {
  history: typeof initialHistory
  setHistory: React.Dispatch<React.SetStateAction<typeof initialHistory>>
}) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: '', doctor: '', note: '', date: '' })

  const handleAdd = () => {
    if (!form.type || !form.note) return
    setHistory((prev) => [
      { id: Date.now(), date: form.date || new Date().toISOString().split('T')[0], type: form.type, doctor: form.doctor || 'Self-reported', note: form.note },
      ...prev,
    ])
    setForm({ type: '', doctor: '', note: '', date: '' })
    setShowForm(false)
  }

  const handleDelete = (id: number) => {
    setHistory((prev) => prev.filter((h) => h.id !== id))
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1000px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-shiro mb-1">Medical History</h1>
          <p className="text-stone text-sm">Your complete health records, securely stored.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-xs text-kuro bg-aka/80 hover:bg-aka px-4 py-2.5 rounded transition-colors"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancel' : 'Add Record'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 rounded-xl border border-aka/20 bg-sumi/20">
          <h3 className="text-sm text-washi font-medium mb-4">Add Record</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Type *</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi focus:outline-none focus:border-aka/40 transition-colors"
              >
                <option value="">Select type</option>
                <option value="Consultation">Consultation</option>
                <option value="Lab Results">Lab Results</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Prescription">Prescription</option>
                <option value="Surgery">Surgery</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Doctor</label>
              <input
                type="text"
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                placeholder="Dr. Name"
                className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi placeholder:text-charcoal focus:outline-none focus:border-aka/40 transition-colors"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi focus:outline-none focus:border-aka/40 transition-colors"
            />
          </div>
          <div className="mb-4">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1.5">Notes *</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Describe the record..."
              rows={3}
              className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi placeholder:text-charcoal focus:outline-none focus:border-aka/40 transition-colors resize-none"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!form.type || !form.note}
            className="flex items-center gap-2 text-xs text-kuro bg-aka/80 hover:bg-aka px-5 py-2.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={14} /> Add Record
          </button>
        </div>
      )}

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-charcoal/30 rounded-xl">
            <FileText size={28} className="text-charcoal mx-auto mb-3" />
            <p className="text-stone text-sm">No records yet.</p>
          </div>
        ) : (
          history.map((entry) => (
            <div key={entry.id} className="p-5 rounded-xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/50 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm text-washi font-medium">{entry.type}</h3>
                  <p className="text-xs text-stone">{entry.doctor} · {formatDate(entry.date)}</p>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-charcoal hover:text-aka transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove record"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-sm text-mist leading-relaxed">{entry.note}</p>
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
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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
          <span className="inline-block mt-1 text-[0.6rem] text-aka tracking-wider uppercase border border-aka/30 px-2 py-0.5 rounded">
            {user.role}
          </span>
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
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 bg-kuro border border-charcoal/50 rounded text-sm text-washi focus:outline-none focus:border-aka/40 transition-colors"
            />
          ) : (
            <p className="text-sm text-washi">{name}</p>
          )}
        </div>
        <div className="border-b border-charcoal/20 pb-5">
          <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-2">Email</label>
          <p className="text-sm text-washi">{user.email}</p>
        </div>
        <div className="border-b border-charcoal/20 pb-5">
          <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-2">Role</label>
          <p className="text-sm text-washi capitalize">{user.role}</p>
          <p className="text-[0.6rem] text-stone/60 mt-1">Assigned automatically from your account data.</p>
        </div>
      </div>

      <div className="mt-8">
        {editing ? (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 text-xs text-kuro bg-aka/80 hover:bg-aka px-5 py-2.5 rounded transition-colors"
            >
              <Save size={14} /> Save Changes
            </button>
            <button
              onClick={() => { setEditing(false); setName(user.full_name) }}
              className="text-xs text-stone hover:text-washi px-4 py-2.5 rounded border border-charcoal/40 hover:border-charcoal transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 text-xs text-stone hover:text-washi px-4 py-2.5 rounded border border-charcoal/40 hover:border-charcoal transition-colors"
          >
            <Edit3 size={14} /> Edit Profile
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Main ─── */
export default function PatientDashboard() {
  const { user } = useAuth()
  const [section, setSection] = useState('overview')
  const [appointments, setAppointments] = useState(initialAppointments)
  const [history, setHistory] = useState(initialHistory)

  if (!user) return null

  return (
    <DashboardLayout
      navItems={navItems}
      activeSection={section}
      onNavigate={setSection}
      roleLabel="Patient Portal"
    >
      {section === 'overview' && <OverviewSection userName={user.full_name} appointments={appointments} history={history} onNavigate={setSection} />}
      {section === 'appointments' && <AppointmentsSection appointments={appointments} setAppointments={setAppointments} />}
      {section === 'history' && <HistorySection history={history} setHistory={setHistory} />}
      {section === 'profile' && <ProfileSection user={user} />}
    </DashboardLayout>
  )
}
