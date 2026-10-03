import { ArrowUpRight, Mail } from 'lucide-react'
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
          Have questions or wish to connect? Step through the gate or reach out directly to our team.
        </p>

        {/* CTA - Opens Gmail compose in new window with prefilled email */}
        <div
          className={`flex flex-col items-center justify-center gap-3 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=rbhai4515%2B112%40gmail.com&su=Inquiry%20regarding%20DrumGate"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !py-4 !px-10 flex items-center gap-2.5 text-sm md:text-base group shadow-xl shadow-aka/20 hover:shadow-aka/40"
          >
            <Mail size={18} className="text-shiro" />
            <span>Email Us</span>
            <ArrowUpRight
              size={16}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>

          <a
            href="mailto:rbhai4515+112@gmail.com"
            className="text-stone hover:text-washi text-xs font-mono tracking-wider transition-colors pt-1"
          >
            rbhai4515+112@gmail.com
          </a>
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
