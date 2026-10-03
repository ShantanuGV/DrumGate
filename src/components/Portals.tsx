import { useState } from 'react'
import { ArrowUpRight, Heart, Stethoscope, Settings } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const portals = [
  {
    id: 'patient',
    label: 'Patient',
    icon: Heart,
    tagline: 'Your health, gently organized',
    description:
      'A warm, clear space to view appointments, connect with your doctors, and access personal medical records — all in one place.',
    image: '/images/patient-portal.jpg',
    imageAlt: 'Serene Japanese garden path — warmth and care',
    cta: 'Enter as Patient',
  },
  {
    id: 'doctor',
    label: 'Doctor',
    icon: Stethoscope,
    tagline: 'Your practice, connected',
    description:
      'A calmer way to see your day, your patients and the moments that need you. Manage appointments, consultations and follow-ups.',
    image: '/images/doctor-portal.jpg',
    imageAlt: 'Healer on a mountain path — dedication and purpose',
    cta: 'Enter as Doctor',
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: Settings,
    tagline: 'Oversight with clarity',
    description:
      'See the full picture. Manage users, monitor platform health, and keep everything running smoothly behind the scenes.',
    image: '/images/admin-portal.jpg',
    imageAlt: 'View from a Japanese watchtower — leadership and vision',
    cta: 'Enter as Admin',
  },
]

export default function Portals() {
  const [activeIndex, setActiveIndex] = useState(1)
  const { ref, isVisible } = useScrollAnimation(0.1)
  const active = portals[activeIndex]

  return (
    <section id="portals" className="relative bg-pure py-section overflow-hidden">
      <div ref={ref} className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section header */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <span className="section-label text-aka block mb-4">
              A portal for every perspective
            </span>
            <h2
              className="font-serif text-kuro leading-[1.08]"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)' }}
            >
              Find your{' '}
              <em className="text-aka" style={{ fontStyle: 'italic' }}>
                rhythm.
              </em>
            </h2>
          </div>
          <p className="text-stone text-sm max-w-xs leading-relaxed">
            Three ways in. One shared intention to make care feel more
            connected.
          </p>
        </div>

        {/* Tab navigation */}
        <div
          className={`flex items-center border-b border-mist/30 mb-0 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {portals.map((portal, i) => (
            <button
              key={portal.id}
              onClick={() => setActiveIndex(i)}
              className={`flex-1 py-4 text-center transition-all duration-400 relative ${
                activeIndex === i
                  ? 'text-kuro font-medium'
                  : 'text-stone hover:text-ash'
              }`}
            >
              <span className="text-xs tracking-wider text-stone mr-2">
                0{i + 1}
              </span>
              <span className="text-sm md:text-base">{portal.label}</span>

              {/* Active indicator */}
              {activeIndex === i && (
                <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-aka" />
              )}

              {/* Arrow for active */}
              {activeIndex === i && (
                <ArrowUpRight
                  size={14}
                  className="inline-block ml-2 text-aka"
                />
              )}
            </button>
          ))}
        </div>

        {/* Portal content */}
        <div
          key={active.id}
          className="relative rounded-b-lg overflow-hidden"
          style={{ animation: 'scaleIn 0.5s ease-out' }}
        >
          {/* Image */}
          <div className="relative h-[50vh] md:h-[65vh] overflow-hidden">
            <img
              src={active.image}
              alt={active.imageAlt}
              className="w-full h-full object-cover transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kuro/80 via-kuro/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-kuro/50 to-transparent" />

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-washi/10 backdrop-blur-sm flex items-center justify-center">
                  <active.icon size={20} className="text-washi" />
                </div>
              </div>

              <span className="section-label text-aka block mb-3">
                {active.tagline}
              </span>

              <h3
                className="font-serif text-shiro mb-4"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}
              >
                {active.label}
              </h3>

              <p className="text-mist text-sm md:text-base max-w-md leading-relaxed mb-6">
                {active.description}
              </p>

              <button className="btn-primary !py-3 !px-6">
                {active.cta} <ArrowUpRight size={14} />
              </button>
            </div>

            {/* Counter */}
            <div className="absolute bottom-8 right-8 text-right">
              <span className="text-stone text-xs tracking-wider">
                0{activeIndex + 1} / 0{portals.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
