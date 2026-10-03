import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronDown } from 'lucide-react'

function SakuraPetals() {
  const petals = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    driftX: `${(Math.random() - 0.5) * 200}px`,
    driftY: `${600 + Math.random() * 400}px`,
    driftR: `${Math.random() * 720}deg`,
    duration: `${10 + Math.random() * 8}s`,
    delay: `${Math.random() * 12}s`,
    size: `${6 + Math.random() * 8}px`,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((p) => (
        <div
          key={p.id}
          className="sakura-petal"
          style={{
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            ['--drift-x' as string]: p.driftX,
            ['--drift-y' as string]: p.driftY,
            ['--drift-r' as string]: p.driftR,
            ['--duration' as string]: p.duration,
            ['--delay' as string]: p.delay,
          }}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Mystical torii gate in misty mountains"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-kuro/80 via-kuro/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-kuro/70 via-transparent to-kuro/30" />
      </div>

      {/* Sakura petals */}
      <SakuraPetals />

      {/* Japanese pattern overlay */}
      <div className="absolute inset-0 asanoha-pattern opacity-30" />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 w-full pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Section label */}
          <div
            className="flex items-center gap-4 mb-8"
            style={{
              animation: loaded ? 'fadeInUp 0.8s 0.2s both' : 'none',
            }}
          >
            <div className="ornament-line" />
            <span className="section-label text-aka">
              A gentler way to care
            </span>
            <span className="text-sakura text-lg">✦</span>
          </div>

          {/* Main headline */}
          <h1
            className="font-serif text-shiro leading-[1.05] mb-8"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              animation: loaded ? 'fadeInUp 1s 0.4s both' : 'none',
            }}
          >
            Healthcare,{' '}
            <em className="text-aka not-italic" style={{ fontStyle: 'italic' }}>
              connected
            </em>{' '}
            with purpose.
          </h1>

          {/* Subtitle */}
          <p
            className="text-mist text-base md:text-lg leading-relaxed max-w-lg mb-10"
            style={{
              animation: loaded ? 'fadeInUp 1s 0.6s both' : 'none',
            }}
          >
            DrumGate brings patients, doctors and the people behind care
            into one quietly powerful place.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4"
            style={{
              animation: loaded ? 'fadeInUp 1s 0.8s both' : 'none',
            }}
          >
            <Link to="/signup" className="btn-primary">
              Enter DrumGate <ArrowUpRight size={16} />
            </Link>
            <button className="btn-secondary">
              Explore the way <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Bottom info strip */}
        <div
          className="absolute bottom-8 left-6 md:left-10 right-6 md:right-10 flex items-center justify-between"
          style={{
            animation: loaded ? 'fadeIn 1s 1.2s both' : 'none',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-aka animate-pulse" />
            <span className="text-mist text-xs tracking-wider">
              Designed around real human moments
            </span>
          </div>
          <span className="text-stone text-xs tracking-widest hide-mobile">
            01 / 04
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 hide-mobile"
        style={{
          animation: loaded ? 'fadeIn 1s 1.4s both' : 'none',
        }}
      >
        <div className="vertical-text text-stone">scroll to discover</div>
      </div>
    </section>
  )
}
