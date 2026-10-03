import { useState, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LogOut,
  Menu,
  X,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'

interface NavItem {
  icon: LucideIcon
  label: string
  id: string
}

interface DashboardLayoutProps {
  children: ReactNode
  navItems: NavItem[]
  activeSection: string
  onNavigate: (id: string) => void
  accentColor?: string
  roleLabel: string
}

export default function DashboardLayout({
  children,
  navItems,
  activeSection,
  onNavigate,
  accentColor = 'aka',
  roleLabel,
}: DashboardLayoutProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) return null

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-kuro text-washi flex">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-[260px] flex-shrink-0 bg-kuro border-r border-charcoal/30 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 pb-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-8 h-8 border-2 border-aka rounded flex items-center justify-center flex-shrink-0"
              style={{ transform: 'rotate(3deg)' }}
            >
              <span className="text-aka font-serif text-[10px] font-bold">鼓</span>
            </div>
            <div>
              <span className="text-washi text-xs tracking-[0.2em] uppercase font-medium block">
                DrumGate
              </span>
              <span className="text-stone text-[0.6rem] tracking-wider uppercase">
                {roleLabel}
              </span>
            </div>
          </Link>
        </div>

        {/* Divider with pattern */}
        <div className="mx-6 h-px bg-gradient-to-r from-charcoal/50 via-charcoal/20 to-transparent" />

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 group ${
                    isActive
                      ? 'bg-aka/8 text-washi'
                      : 'text-stone hover:text-washi hover:bg-sumi/40'
                  }`}
                >
                  <item.icon
                    size={18}
                    className={`flex-shrink-0 transition-colors ${
                      isActive ? 'text-aka' : 'text-stone group-hover:text-mist'
                    }`}
                  />
                  <span className="text-sm">{item.label}</span>
                  {isActive && (
                    <ChevronRight size={14} className="ml-auto text-aka/50" />
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Bottom user section */}
        <div className="p-4 border-t border-charcoal/30">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-sumi border border-charcoal flex items-center justify-center flex-shrink-0">
              <span className="text-washi text-xs font-medium">
                {user.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-washi truncate">{user.full_name}</p>
              <p className="text-[0.65rem] text-stone truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 text-stone text-xs hover:text-aka transition-colors px-3 py-2.5 rounded-lg hover:bg-sumi/30"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-kuro/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-20 bg-kuro/95 backdrop-blur-md border-b border-charcoal/30 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-washi p-1"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border border-aka rounded flex items-center justify-center" style={{ transform: 'rotate(3deg)' }}>
              <span className="text-aka font-serif text-[8px] font-bold">鼓</span>
            </div>
            <span className="text-washi text-xs tracking-[0.15em] uppercase">DrumGate</span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-stone p-1"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
