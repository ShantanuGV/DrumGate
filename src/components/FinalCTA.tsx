import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function FinalCTA() {
  const { ref, isVisible } = useScrollAnimation(0.2)

  return (
    <section
      id="cta"
      className="relative bg-kuro text-washi py-section overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-kuro via-sumi/30 to-kuro" />
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(168, 50, 50, 0.06) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Pattern */}
      <div className="absolute inset-0 asanoha-pattern opacity-20" />

      <div
        ref={ref}
        className="relative z-10 max-w-[900px] mx-auto px-6 md:px-10 text-center"
      >
        {/* Seal */}
        <div
          className={`flex justify-center mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <div className="red-seal !w-16 !h-16">
            <span className="text-aka font-jp text-2xl">鼓</span>
          </div>
        </div>

        {/* Headline */}
        <h2
          className={`font-serif text-shiro leading-[1.1] mb-6 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
        >
          Your care.
          <br />
          Your connection.
          <br />
          <em className="text-aka" style={{ fontStyle: 'italic' }}>
            Your DrumGate.
          </em>
        </h2>

        {/* Subtitle */}
        <p
          className={`text-mist text-base md:text-lg leading-relaxed max-w-md mx-auto mb-10 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Step through the gate. Healthcare that feels different
          starts here.
        </p>

        {/* CTA */}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <Link to="/signup" className="btn-primary !py-4 !px-10">
            Enter DrumGate <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Tagline */}
        <p
          className={`mt-14 text-stone text-xs tracking-[0.3em] uppercase transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Where care finds its way
        </p>
      </div>
    </section>
  )
}
