import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useAuth } from '../context/AuthContext'

interface CareAction {
  id: string
  number: string
  kanji: string
  title: string
  description: string
  image: string
  imageAlt: string
  imageFilter?: string
  actionLabel: string
  preview: {
    title: string
    meta: string
    badge: string
  }
}

const careActions: CareAction[] = [
  {
    id: 'book',
    number: '01',
    kanji: '予約',
    title: 'Book an Appointment',
    description: 'Find a suitable doctor and choose an available appointment time.',
    image: '/images/patient-portal.jpg',
    imageAlt: 'Serene stone pathway',
    actionLabel: 'Book Visit',
    preview: {
      title: 'Dr. Shinobu Kocho',
      meta: 'Insect Hashira • Butterfly Ward 1',
      badge: 'Available',
    },
  },
  {
    id: 'doctors',
    number: '02',
    kanji: '医師',
    title: 'Find Your Doctor',
    description: 'Explore doctors through their profile, specialty, and availability.',
    image: '/images/doctor-portal.jpg',
    imageAlt: 'Physician on mountain path',
    actionLabel: 'Explore Doctors',
    preview: {
      title: 'Dr. Tamayo',
      meta: 'Chief Medical Officer • Hematology',
      badge: 'Verified',
    },
  },
  {
    id: 'journey',
    number: '03',
    kanji: '軌跡',
    title: 'Your Care Journey',
    description: 'Appointments, consultations, and medical history in one place.',
    image: '/images/patient-portal.jpg',
    imageAlt: 'Tranquil garden pathway',
    imageFilter: 'brightness-90 contrast-105 saturate-90 hue-rotate-[340deg]',
    actionLabel: 'View Records',
    preview: {
      title: 'Tanjiro Kamado • Health Vault',
      meta: 'Total Concentration Vitals • Synced',
      badge: 'Synced',
    },
  },
  {
    id: 'practice',
    number: '04',
    kanji: '統括',
    title: 'Manage Your Practice',
    description: 'A concise entry point for doctors and administrators.',
    image: '/images/admin-portal.jpg',
    imageAlt: 'Watchtower perspective',
    actionLabel: 'Practice Hub',
    preview: {
      title: 'Kagaya Ubuyashiki • Command Hub',
      meta: 'Butterfly Mansion & Clinic Console',
      badge: 'Active',
    },
  },
]

export default function Portals() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { ref, isVisible } = useScrollAnimation(0.1)
  const { user } = useAuth()
  const navigate = useNavigate()

  const currentAction = careActions[activeIndex]

  const handleAction = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/signin')
    }
  }

  return (
    <section
      id="portals"
      className="relative bg-[#141210] text-washi py-20 md:py-28 overflow-hidden selection:bg-aka selection:text-shiro border-t border-washi/5"
    >
      {/* Background texture & lighting */}
      <div className="absolute inset-0 asanoha-pattern opacity-[0.07] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-aka/5 rounded-full blur-[100px] pointer-events-none" />

      <div ref={ref} className="max-w-[1300px] mx-auto px-6 md:px-10 relative z-10">
        {/* Section Header: Minimal & clean */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <span className="section-label text-aka block mb-3">
              Explore DrumGate
            </span>
            <h2
              className="font-serif text-shiro leading-[1.08] tracking-tight"
              style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.6rem)' }}
            >
              Care, at your{' '}
              <em className="text-aka not-italic font-serif" style={{ fontStyle: 'italic' }}>
                pace.
              </em>
            </h2>
          </div>

          <p className="text-mist/80 text-base md:text-lg font-light max-w-sm">
            Explore what DrumGate can help you do.
          </p>
        </div>

        {/* Mobile quick tabs */}
        <div className="flex lg:hidden overflow-x-auto gap-2 pb-3 mb-6 scrollbar-none">
          {careActions.map((action, i) => (
            <button
              key={action.id}
              onClick={() => setActiveIndex(i)}
              className={`px-3.5 py-2 rounded-sm text-xs font-medium whitespace-nowrap transition-all ${
                activeIndex === i
                  ? 'bg-aka text-shiro'
                  : 'bg-sumi/60 text-stone hover:text-washi border border-washi/10'
              }`}
            >
              {action.number} {action.title}
            </button>
          ))}
        </div>

        {/* Dual-Column Stage */}
        <div className="grid lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          {/* Left Column: 4 Minimal Action Rows */}
          <div
            className={`lg:col-span-7 flex flex-col gap-2.5 transition-all duration-700 delay-150 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {careActions.map((action, index) => {
              const isActive = activeIndex === index

              return (
                <div
                  key={action.id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`group relative rounded-sm cursor-pointer transition-all duration-400 border overflow-hidden ${
                    isActive
                      ? 'bg-sumi/80 border-washi/20 shadow-lg'
                      : 'bg-sumi/20 hover:bg-sumi/40 border-washi/5'
                  }`}
                >
                  {/* Subtle red indicator rail */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300 ${
                      isActive ? 'bg-aka' : 'bg-transparent'
                    }`}
                  />

                  <div className="p-4 md:p-5 pl-5 md:pl-6">
                    {/* Header line: Number + Kanji + Title */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-xs md:text-sm transition-colors ${
                            isActive ? 'text-aka font-semibold' : 'text-stone/50'
                          }`}
                        >
                          {action.number}
                        </span>
                        <span className="text-stone/30 text-xs font-serif">
                          {action.kanji}
                        </span>
                        <h3
                          className={`font-serif text-lg md:text-xl transition-colors ${
                            isActive ? 'text-shiro' : 'text-mist/70 group-hover:text-shiro'
                          }`}
                        >
                          {action.title}
                        </h3>
                      </div>

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-aka text-shiro rotate-0'
                            : 'bg-washi/5 text-stone/50 group-hover:text-washi -rotate-45'
                        }`}
                      >
                        <ArrowUpRight size={13} />
                      </div>
                    </div>

                    {/* Short description & button (only revealed when active or hovered) */}
                    <div
                      className={`grid transition-all duration-400 ease-out overflow-hidden ${
                        isActive
                          ? 'grid-rows-[1fr] opacity-100 mt-2 pt-2 border-t border-washi/10'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="min-h-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-stone text-xs md:text-sm leading-relaxed max-w-md">
                          {action.description}
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAction()
                          }}
                          className="btn-primary !py-2 !px-4 text-xs tracking-wider flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                        >
                          <span>{action.actionLabel}</span>
                          <ArrowUpRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Clean 3:4 Portrait Artwork (Strict aspect ratio, zero stretch) */}
          <div
            className={`lg:col-span-5 flex justify-center transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="relative w-full max-w-[360px] lg:max-w-[380px] xl:max-w-[400px] aspect-[3/4] rounded-sm overflow-hidden bg-sumi/80 border border-washi/15 shadow-2xl">
              {/* Subtle Corner Brackets */}
              <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t border-l border-aka/60 z-20 pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-aka/60 z-20 pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-aka/60 z-20 pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r border-aka/60 z-20 pointer-events-none" />

              {/* Artwork Layers */}
              {careActions.map((action, idx) => {
                const isSelected = activeIndex === idx
                return (
                  <div
                    key={action.id}
                    className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                      isSelected ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={action.image}
                      alt={action.imageAlt}
                      className={`w-full h-full object-cover object-center ${
                        action.imageFilter || ''
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent" />
                  </div>
                )
              })}

              {/* Minimal floating card at bottom */}
              <div className="absolute bottom-4 inset-x-4 z-20">
                <div className="bg-[#1a1714]/90 backdrop-blur-md border border-washi/15 rounded-sm p-3.5 shadow-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] uppercase tracking-wider text-aka font-mono">
                        {currentAction.preview.badge}
                      </span>
                    </div>
                    <h4 className="font-serif text-shiro text-sm md:text-base leading-tight">
                      {currentAction.preview.title}
                    </h4>
                    <p className="text-stone text-xs">
                      {currentAction.preview.meta}
                    </p>
                  </div>

                  <button
                    onClick={handleAction}
                    className="p-2 rounded-full bg-washi/10 hover:bg-aka text-washi hover:text-shiro transition-colors"
                    aria-label="Open"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
