import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LogOut,
  Heart,
  Stethoscope,
  Settings,
  Calendar,
  Users,
  FileText,
  Activity,
  Shield,
  BarChart3,
} from 'lucide-react'

const roleConfig = {
  patient: {
    icon: Heart,
    color: 'text-pink-400',
    bgAccent: 'from-pink-900/20 to-kuro',
    greeting: 'Your health, gently organized.',
    features: [
      { icon: Calendar, label: 'My Appointments', desc: 'View and manage your upcoming visits' },
      { icon: Users, label: 'My Doctors', desc: 'Connect with your care team' },
      { icon: FileText, label: 'Medical Records', desc: 'Access your health history securely' },
      { icon: Activity, label: 'Health Overview', desc: 'Track your wellness journey' },
    ],
  },
  doctor: {
    icon: Stethoscope,
    color: 'text-blue-400',
    bgAccent: 'from-blue-900/20 to-kuro',
    greeting: 'Your practice, connected.',
    features: [
      { icon: Calendar, label: 'Schedule', desc: 'Manage your appointments and availability' },
      { icon: Users, label: 'Patients', desc: 'View and manage your patient list' },
      { icon: FileText, label: 'Consultations', desc: 'Review notes and follow-ups' },
      { icon: Activity, label: 'Analytics', desc: 'Practice insights and metrics' },
    ],
  },
  admin: {
    icon: Settings,
    color: 'text-amber-400',
    bgAccent: 'from-amber-900/20 to-kuro',
    greeting: 'Oversight with clarity.',
    features: [
      { icon: Users, label: 'User Management', desc: 'Manage doctors, patients, and staff' },
      { icon: Shield, label: 'Security', desc: 'Access controls and audit logs' },
      { icon: BarChart3, label: 'Platform Analytics', desc: 'System health and usage data' },
      { icon: Settings, label: 'Configuration', desc: 'Platform settings and preferences' },
    ],
  },
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const config = roleConfig[user.role]
  const RoleIcon = config.icon

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-kuro text-washi">
      {/* Top nav */}
      <nav className="border-b border-charcoal/40 px-6 md:px-10 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border-2 border-aka rounded flex items-center justify-center" style={{ transform: 'rotate(3deg)' }}>
              <span className="text-aka text-[10px] font-serif font-bold">鼓</span>
            </div>
            <span className="text-washi text-xs tracking-[0.2em] uppercase font-medium">
              DrumGate
            </span>
            <span className="text-charcoal mx-2">|</span>
            <span className="text-stone text-xs tracking-wider uppercase">
              {user.role} Portal
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-washi">{user.full_name}</p>
              <p className="text-xs text-stone">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-stone text-sm hover:text-aka transition-colors px-3 py-2 rounded border border-charcoal/40 hover:border-aka/30"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero greeting */}
      <div className={`bg-gradient-to-b ${config.bgAccent} py-16 px-6 md:px-10`}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-lg bg-sumi/80 border border-charcoal flex items-center justify-center ${config.color}`}>
              <RoleIcon size={24} />
            </div>
            <div>
              <p className="text-mist text-sm">
                Welcome back,
              </p>
              <h1 className="font-serif text-2xl md:text-3xl text-shiro">
                {user.full_name}
              </h1>
            </div>
          </div>
          <p className="text-stone text-sm italic font-serif">
            {config.greeting}
          </p>
        </div>
      </div>

      {/* Feature cards */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
        <h2 className="text-xs tracking-[0.2em] uppercase text-stone mb-8">
          Your dashboard
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {config.features.map((feature) => (
            <div
              key={feature.label}
              className="group p-6 rounded-lg border border-charcoal/50 bg-sumi/20 hover:border-aka/30 hover:bg-sumi/40 transition-all duration-300 cursor-pointer"
            >
              <feature.icon
                size={24}
                className="text-stone group-hover:text-aka transition-colors mb-4"
              />
              <h3 className="text-sm font-medium text-washi mb-1">
                {feature.label}
              </h3>
              <p className="text-xs text-stone leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Info card */}
        <div className="mt-12 p-6 rounded-lg border border-charcoal/30 bg-sumi/10">
          <div className="flex items-start gap-3">
            <Shield size={16} className="text-aka mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-washi mb-1">
                Role-based access active
              </h3>
              <p className="text-xs text-stone leading-relaxed">
                You are signed in as <span className="text-washi font-medium">{user.role}</span>.
                Your access level was determined automatically from your account data.
                Dashboard features and permissions are tailored to your role.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
