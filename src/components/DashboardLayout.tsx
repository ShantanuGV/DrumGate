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
  coverImage?: string
  coverQuote?: {
    kanji: string
    title: string
    subtitle: string
    badge?: string
  }
}

export default function DashboardLayout({
  children,
  navItems,
  activeSection,
  onNavigate,
  accentColor = 'aka',
  roleLabel,
  coverImage,
  coverQuote,
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

      {/* ── Full-Height Screen Portrait Showcase Column (Desktop) ── */}
      {coverImage && (
        <aside
          className="hidden lg:flex w-[280px] xl:w-[350px] 2xl:w-[410px] h-screen sticky top-0 flex-col flex-shrink-0 border-l border-charcoal/30 overflow-hidden relative select-none"
          aria-label="Portal Visual Art"
        >
          {/* Portrait Image Covering Full Screen Height */}
          <img
            src={coverImage}
            alt={`${roleLabel} Visual`}
            className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.72] contrast-[1.08] hover:scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Cinematic Vignette & Japanese Zen Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-kuro via-kuro/40 to-kuro/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-kuro/80 via-transparent to-kuro/40 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-kuro/30 to-kuro/80 pointer-events-none" />

          {/* Top Overlay: Ambient Badge & Role Seal */}
          <div className="relative z-10 p-6 flex items-start justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-kuro/75 backdrop-blur-md border border-charcoal/60">
              <span className="w-1.5 h-1.5 rounded-full bg-aka animate-pulse" />
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-mist font-mono">
                {coverQuote?.badge || roleLabel}
              </span>
            </div>
            {coverQuote?.kanji && (
              <div
                className="w-9 h-9 rounded-lg bg-kuro/75 backdrop-blur-md border border-aka/40 flex items-center justify-center shadow-lg"
                style={{ transform: 'rotate(2deg)' }}
              >
                <span className="text-aka font-serif text-sm font-bold">
                  {coverQuote.kanji}
                </span>
              </div>
            )}
          </div>

          {/* Center: Atmospheric Kanji Watermark */}
          {coverQuote?.kanji && (
            <div className="relative z-10 flex-1 flex flex-col justify-center items-center pointer-events-none opacity-20">
              <span className="font-serif text-8xl text-washi tracking-widest">
                {coverQuote.kanji}
              </span>
            </div>
          )}

          {/* Bottom Card: Philosophical Zen Quote & System Status */}
          <div className="relative z-10 p-6">
            <div className="p-5 rounded-2xl bg-sumi/75 backdrop-blur-md border border-charcoal/50 shadow-2xl">
              {coverQuote?.title && (
                <p className="text-aka text-[0.65rem] tracking-[0.2em] uppercase font-semibold mb-1">
                  {coverQuote.title}
                </p>
              )}
              {coverQuote?.subtitle && (
                <p className="text-xs text-washi/90 italic font-serif leading-relaxed mb-4">
                  "{coverQuote.subtitle}"
                </p>
              )}
              <div className="pt-3 border-t border-charcoal/40 flex items-center justify-between text-[0.65rem] text-stone font-mono">
                <span className="tracking-wider uppercase">DrumGate 鼓門</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Encrypted TLS 1.3
                </span>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
