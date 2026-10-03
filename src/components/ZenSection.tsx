import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function ZenSection() {
  const { ref, isVisible } = useScrollAnimation(0.15)

  return (
    <section className="relative bg-pure overflow-hidden">
      <div ref={ref} className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image */}
          <div
            className={`relative h-[50vh] lg:h-[80vh] overflow-hidden transition-all duration-1000 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
            }`}
          >
            <img
              src="/images/zen-garden.jpg"
              alt="A serene Japanese zen garden — the calm at the heart of DrumGate"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-pure/20 lg:to-pure/60" />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center py-16 lg:py-0 px-6 md:px-10 lg:px-16 xl:px-24">
            <div
              className={`transition-all duration-700 delay-300 ${
                isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-8'
              }`}
            >
              <span className="section-label text-aka block mb-6">
                A quieter kind of technology
              </span>

              <h2
                className="font-serif text-kuro leading-[1.1] mb-6"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}
              >
                Every detail,{' '}
                <em className="text-stone" style={{ fontStyle: 'italic' }}>
                  considered.
                </em>
              </h2>

              <p className="text-ash text-base leading-relaxed mb-8 max-w-md">
                From the spacing between elements to the flow between pages —
                DrumGate was designed with the kind of attention usually
                reserved for things people truly love.
              </p>

              <div className="space-y-4">
                {[
                  'Thoughtful information hierarchy',
                  'Calm, distraction-free interfaces',
                  'Responsive across every device',
                  'Built for accessibility',
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      isVisible
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-4'
                    }`}
                    style={{ transitionDelay: `${0.5 + i * 0.1}s` }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-aka flex-shrink-0" />
                    <span className="text-sm text-ash">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
