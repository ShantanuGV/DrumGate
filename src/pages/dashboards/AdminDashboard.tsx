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
  ArrowUpRight,
  TrendingUp,
  Shield,
  Activity,
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: Stethoscope, label: 'Doctors', id: 'doctors' },
  { icon: Users, label: 'Patients', id: 'patients' },
  { icon: Calendar, label: 'Appointments', id: 'appointments' },
  { icon: User, label: 'Profile', id: 'profile' },
]

// Mock data
const platformStats = [
  { value: '24', label: 'Doctors', trend: '+3 this month', icon: Stethoscope },
  { value: '186', label: 'Patients', trend: '+12 this month', icon: Users },
  { value: '47', label: 'Appointments', trend: 'This week', icon: Calendar },
  { value: '99.8%', label: 'Uptime', trend: 'Last 30 days', icon: Activity },
]

const recentDoctors = [
  { name: 'Dr. Haruki Tanaka', specialty: 'General Physician', patients: 32, status: 'active' },
  { name: 'Dr. Yuki Yamamoto', specialty: 'Dermatologist', patients: 18, status: 'active' },
  { name: 'Dr. Ryo Sato', specialty: 'Cardiologist', patients: 25, status: 'active' },
  { name: 'Dr. Mai Kimura', specialty: 'Pediatrician', patients: 41, status: 'on-leave' },
]

const recentPatients = [
  { name: 'Aiko Suzuki', doctor: 'Dr. Tanaka', registered: 'Oct 1', avatar: 'A' },
  { name: 'Kenji Mori', doctor: 'Dr. Yamamoto', registered: 'Sep 28', avatar: 'K' },
  { name: 'Hana Watanabe', doctor: 'Dr. Sato', registered: 'Sep 25', avatar: 'H' },
  { name: 'Ren Fujita', doctor: 'Dr. Tanaka', registered: 'Sep 22', avatar: 'R' },
]

const recentActivity = [
  { action: 'New patient registered', detail: 'Aiko Suzuki', time: '2 hours ago' },
  { action: 'Appointment completed', detail: 'Dr. Tanaka — Kenji Mori', time: '4 hours ago' },
  { action: 'Doctor profile updated', detail: 'Dr. Yamamoto', time: '6 hours ago' },
  { action: 'System maintenance', detail: 'Database optimization', time: '12 hours ago' },
]

function OverviewSection({ userName }: { userName: string }) {
  return (
    <div className="p-6 md:p-10 lg:p-12">
      {/* Greeting */}
      <div className="grid lg:grid-cols-[1fr_160px] gap-6 items-start mb-10">
        <div>
          <p className="text-stone text-xs tracking-[0.2em] uppercase mb-2">Administrator</p>
          <h1 className="font-serif text-shiro text-3xl md:text-4xl leading-tight mb-2">
            {userName}
          </h1>
          <p className="text-stone text-sm italic font-serif">
            Oversight with clarity.
          </p>
        </div>

        {/* Portrait image — small command-view composition */}
        <div className="hidden lg:block">
          <div className="w-[160px] h-[200px] rounded-2xl overflow-hidden relative">
            <img
              src="/images/admin-portal.jpg"
              alt=""
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kuro via-kuro/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Shield size={14} className="text-aka/70 mb-1" />
              <p className="text-[0.6rem] text-mist/60 italic font-serif">
                The full picture.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {platformStats.map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/50 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={16} className="text-stone group-hover:text-aka transition-colors" />
              <TrendingUp size={12} className="text-emerald-500/50" />
            </div>
            <span className="text-2xl font-serif text-washi block">{stat.value}</span>
            <span className="text-[0.65rem] text-stone tracking-wider uppercase block mt-1">{stat.label}</span>
            <span className="text-[0.55rem] text-stone/50 mt-0.5 block">{stat.trend}</span>
          </div>
        ))}
      </div>

      {/* Two columns: Doctors + Activity */}
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
        {/* Doctors overview */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs tracking-[0.15em] uppercase text-stone">Doctors</h2>
            <button className="text-[0.65rem] text-aka tracking-wider uppercase flex items-center gap-1 hover:gap-2 transition-all">
              Manage <ChevronRight size={10} />
            </button>
          </div>

          <div className="space-y-2">
            {recentDoctors.map((doc, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-sumi border border-charcoal/50 flex items-center justify-center flex-shrink-0">
                  <Stethoscope size={14} className="text-stone" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-washi truncate">{doc.name}</p>
                  <p className="text-[0.65rem] text-stone">{doc.specialty} · {doc.patients} patients</p>
                </div>
                <span className={`text-[0.55rem] px-2 py-0.5 rounded-full tracking-wider uppercase flex-shrink-0 ${
                  doc.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity log */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs tracking-[0.15em] uppercase text-stone">Recent Activity</h2>
          </div>

          <div className="space-y-1">
            {recentActivity.map((entry, i) => (
              <div
                key={i}
                className="p-4 rounded-xl hover:bg-sumi/20 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-aka/50 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-washi">{entry.action}</p>
                    <p className="text-[0.65rem] text-stone">{entry.detail}</p>
                    <p className="text-[0.6rem] text-stone/50 mt-1">{entry.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DoctorsSection() {
  return (
    <div className="p-6 md:p-10 lg:p-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-shiro mb-1">Doctors</h1>
          <p className="text-stone text-sm">Manage doctor accounts and access.</p>
        </div>
        <button className="text-xs text-kuro bg-aka/80 hover:bg-aka px-4 py-2.5 rounded flex items-center gap-2 transition-colors">
          Add Doctor <ArrowUpRight size={12} />
        </button>
      </div>

      <div className="space-y-3">
        {recentDoctors.map((doc, i) => (
          <div key={i} className="flex items-center gap-5 p-5 rounded-xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/50 transition-all duration-300 cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-sumi border border-charcoal/50 flex items-center justify-center flex-shrink-0">
              <Stethoscope size={16} className="text-stone" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-washi font-medium">{doc.name}</p>
              <p className="text-xs text-stone">{doc.specialty}</p>
            </div>
            <div className="text-right hidden sm:block flex-shrink-0">
              <p className="text-sm text-mist">{doc.patients}</p>
              <p className="text-[0.6rem] text-stone">patients</p>
            </div>
            <span className={`text-[0.6rem] px-2.5 py-1 rounded-full tracking-wider uppercase flex-shrink-0 ${
              doc.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
            }`}>
              {doc.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PatientsSection() {
  return (
    <div className="p-6 md:p-10 lg:p-12">
      <h1 className="font-serif text-2xl text-shiro mb-2">Patients</h1>
      <p className="text-stone text-sm mb-8">All registered patients across the platform.</p>

      <div className="space-y-3">
        {recentPatients.map((patient, i) => (
          <div key={i} className="flex items-center gap-5 p-5 rounded-xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/50 transition-all duration-300 cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-sumi border border-charcoal/50 flex items-center justify-center flex-shrink-0">
              <span className="text-washi text-lg font-serif">{patient.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-washi font-medium">{patient.name}</p>
              <p className="text-xs text-stone">Assigned to {patient.doctor}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[0.65rem] text-stone">Registered</p>
              <p className="text-xs text-mist">{patient.registered}</p>
            </div>
            <ChevronRight size={14} className="text-charcoal group-hover:text-stone transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}

function AppointmentsSection() {
  const allAppointments = [
    { patient: 'Aiko Suzuki', doctor: 'Dr. Tanaka', date: 'Oct 8', time: '10:30 AM', status: 'confirmed' },
    { patient: 'Kenji Mori', doctor: 'Dr. Yamamoto', date: 'Oct 8', time: '2:00 PM', status: 'confirmed' },
    { patient: 'Yumi Oda', doctor: 'Dr. Sato', date: 'Oct 10', time: '9:00 AM', status: 'pending' },
    { patient: 'Ren Fujita', doctor: 'Dr. Tanaka', date: 'Oct 12', time: '11:00 AM', status: 'confirmed' },
  ]

  return (
    <div className="p-6 md:p-10 lg:p-12">
      <h1 className="font-serif text-2xl text-shiro mb-2">Appointments</h1>
      <p className="text-stone text-sm mb-8">All scheduled appointments across the platform.</p>

      <div className="space-y-2">
        {allAppointments.map((apt, i) => (
          <div key={i} className="flex items-center gap-5 p-5 rounded-xl border border-charcoal/30 bg-sumi/15 hover:border-charcoal/50 transition-all duration-300 group cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-kuro border border-charcoal/40 flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-[0.6rem] text-stone uppercase">{apt.date.split(' ')[0]}</span>
              <span className="text-lg text-washi font-serif">{apt.date.split(' ')[1]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-washi font-medium">{apt.patient}</p>
              <p className="text-xs text-stone">{apt.doctor} · {apt.time}</p>
            </div>
            <span className={`text-[0.6rem] px-2.5 py-1 rounded-full tracking-wider uppercase flex-shrink-0 ${
              apt.status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
            }`}>
              {apt.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfileSection({ user }: { user: { full_name: string; email: string; role: string } }) {
  return (
    <div className="p-6 md:p-10 lg:p-12">
      <h1 className="font-serif text-2xl text-shiro mb-8">Profile</h1>
      <div className="max-w-lg">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-sumi border border-charcoal flex items-center justify-center">
            <span className="text-washi text-xl font-serif">{user.full_name.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-lg text-washi font-medium">{user.full_name}</h2>
            <p className="text-xs text-stone">{user.email}</p>
            <span className="inline-block mt-1 text-[0.6rem] text-aka tracking-wider uppercase border border-aka/30 px-2 py-0.5 rounded">
              {user.role}
            </span>
          </div>
        </div>
        {[
          { label: 'Full Name', value: user.full_name },
          { label: 'Email', value: user.email },
          { label: 'Role', value: 'Administrator' },
          { label: 'Access Level', value: 'Full Platform Access' },
        ].map((field) => (
          <div key={field.label} className="border-b border-charcoal/20 pb-4 mb-4">
            <label className="text-[0.65rem] text-stone tracking-wider uppercase block mb-1">{field.label}</label>
            <p className="text-sm text-washi">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [section, setSection] = useState('overview')

  if (!user) return null

  return (
    <DashboardLayout
      navItems={navItems}
      activeSection={section}
      onNavigate={setSection}
      accentColor="aka"
      roleLabel="Admin Portal"
    >
      {section === 'overview' && <OverviewSection userName={user.full_name} />}
      {section === 'doctors' && <DoctorsSection />}
      {section === 'patients' && <PatientsSection />}
      {section === 'appointments' && <AppointmentsSection />}
      {section === 'profile' && <ProfileSection user={user} />}
    </DashboardLayout>
  )
}
