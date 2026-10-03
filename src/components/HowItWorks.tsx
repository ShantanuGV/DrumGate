import { Fingerprint, Link2, HeartPulse } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const steps = [
  {
    icon: Fingerprint,
    number: '01',
    title: 'Authenticate',
    subtitle: 'Step through the gate',
    desc: 'Secure sign-in with role-based access. Your identity is verified, your data stays yours.',
  },
  {
    icon: Link2,
    number: '02',
    title: 'Connect',
    subtitle: 'Find your people',
    desc: "Whether you're a patient finding a doctor, or a doctor reviewing your day — connections happen naturally.",
  },
  {
    icon: HeartPulse,
    number: '03',
    title: 'Care',
    subtitle: 'Let it flow',
    desc: 'Appointments, consultations, records — everything lands in a calm, organized space. Care, delivered.',
  },
]

export default function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation(0.15)

  return (
    <section className="relative bg-kuro text-washi py-section overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 seigaiha-pattern" />

      <div ref={ref} className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span
            className={`section-label text-aka block mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            The path through DrumGate
          </span>
          <h2
            className={`font-serif text-shiro leading-[1.1] transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}
          >
            Three steps.{' '}
            <em className="text-mist" style={{ fontStyle: 'italic' }}>
              One intention.
            </em>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`relative group transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${0.2 + i * 0.15}s` }}
            >
              {/* Connector line (between steps) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px">
                  <div className="w-full h-px bg-gradient-to-r from-charcoal to-transparent" />
                </div>
              )}

              {/* Step card */}
              <div className="relative p-8 rounded-lg border border-charcoal/50 bg-sumi/30 backdrop-blur-sm hover:border-aka/30 transition-all duration-500 group-hover:bg-sumi/50">
                {/* Icon + Number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-lg bg-kuro border border-charcoal flex items-center justify-center group-hover:border-aka/40 transition-colors">
                    <step.icon size={20} className="text-aka" />
                  </div>
                  <span className="text-charcoal text-3xl font-serif font-light group-hover:text-ash transition-colors">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-serif text-washi mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-aka mb-4 tracking-wider uppercase">
                  {step.subtitle}
                </p>
                <p className="text-stone text-sm leading-relaxed">
                  {step.desc}
                </p>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-aka/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Visual flow indicator */}
        <div className="flex items-center justify-center mt-14 gap-4 text-stone text-xs tracking-[0.3em] uppercase">
          <span>Authenticate</span>
          <span className="text-aka">→</span>
          <span>Connect</span>
          <span className="text-aka">→</span>
          <span>Care</span>
        </div>
      </div>
    </section>
  )
}
