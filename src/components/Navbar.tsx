import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { useScrollPosition } from '../hooks/useScrollAnimation'

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Doctors', href: '#portals' },
  { label: 'Our Approach', href: '#trust' },
  { label: 'Contact', href: '#cta' },
]

export default function Navbar() {
  const scrollY = useScrollPosition()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isScrolled = scrollY > 50

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('mobile-menu-open')
    } else {
      document.body.classList.remove('mobile-menu-open')
    }
    return () => document.body.classList.remove('mobile-menu-open')
  }, [mobileOpen])

  return (
    <>
      <nav
        id="main-nav"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'nav-scrolled py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="red-seal !w-8 !h-8">
              <span className="text-aka font-serif text-xs font-bold">鼓</span>
            </div>
            <span className="text-washi text-sm tracking-[0.25em] uppercase font-medium">
              DrumGate
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/signin" className="nav-link flex items-center gap-1.5">
              Sign In <ArrowUpRight size={14} />
            </Link>
            <Link to="/signup" className="btn-primary !py-2.5 !px-6 !text-xs">
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-washi p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-kuro/98 backdrop-blur-xl transition-all duration-500 md:hidden ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-washi text-2xl font-serif tracking-wide hover:text-aka transition-colors"
              style={{
                animation: mobileOpen
                  ? `fadeInUp 0.5s ${i * 0.1}s both`
                  : 'none',
              }}
            >
              {link.label}
            </a>
          ))}
          <div
            className="flex flex-col gap-4 mt-6"
            style={{
              animation: mobileOpen ? 'fadeInUp 0.5s 0.4s both' : 'none',
            }}
          >
            <Link
              to="/signin"
              onClick={() => setMobileOpen(false)}
              className="text-mist text-sm uppercase tracking-widest flex items-center gap-2"
            >
              Sign In <ArrowUpRight size={14} />
            </Link>
            <Link to="/signup" className="btn-primary" onClick={() => setMobileOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
