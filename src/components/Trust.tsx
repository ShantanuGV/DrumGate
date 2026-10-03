import { Shield, Eye, Lock, Users } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const trustFeatures = [
  {
    icon: Lock,
    title: 'Secure Authentication',
    desc: 'Multi-factor login with session management built into every access point.',
  },
  {
    icon: Users,
    title: 'Role-based Access',
    desc: 'Everyone sees what they need. Patients, doctors, and admins each get their own view.',
  },
  {
    icon: Eye,
    title: 'Care in Context',
    desc: 'A clearer view for better conversations. Information flows where it matters.',
  },
  {
    icon: Shield,
    title: 'Protected Information',
    desc: 'Sensitive data stays close, handled with the care and control it deserves.',
  },
]

export default function Trust() {
  const { ref, isVisible } = useScrollAnimation(0.15)

  return (
    <section id="trust" className="relative bg-kuro text-washi overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[80vh]">
        {/* Left content */}
        <div
          ref={ref}
          className="flex flex-col justify-center py-section px-6 md:px-10 lg:px-16 xl:px-24"
        >
          {/* Label */}
          <div
            className={`flex items-center gap-3 mb-8 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="section-label text-aka">
              A private place to land
            </span>
          </div>

          {/* Headline */}
          <h2
            className={`font-serif leading-[1.08] mb-8 transition-all duration-700 delay-100 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)' }}
          >
            Built for trust.
            <br />
            <em className="text-aka" style={{ fontStyle: 'italic' }}>
              Made for humans.
            </em>
          </h2>

          {/* Body */}
          <p
            className={`text-mist text-base leading-relaxed max-w-md mb-10 transition-all duration-700 delay-200 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
          >
            Important moments deserve a thoughtful home. DrumGate keeps the
            essentials close while giving sensitive information the care and
            control it deserves.
          </p>

          {/* Trust features */}
          <div className="grid sm:grid-cols-2 gap-6">
            {trustFeatures.map((feature, i) => (
              <div
                key={feature.title}
                className={`flex gap-4 transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <feature.icon size={18} className="text-aka" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-washi mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-stone leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right image */}
        <div className="relative overflow-hidden min-h-[400px] lg:min-h-0">
          <img
            src="/images/moonlit-temple.jpg"
            alt="Moonlit Japanese temple — evoking trust and timelessness"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-kuro/30 lg:to-kuro/50" />

          {/* Floating label */}
          <div className="absolute bottom-8 right-8 text-right">
            <span className="text-stone text-xs tracking-wider block">02</span>
            <span className="text-mist text-xs italic font-serif">
              Protected information.
              <br />
              Considered experience.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
