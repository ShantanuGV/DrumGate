import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Philosophy() {
  const { ref, isVisible } = useScrollAnimation(0.2)

  return (
    <section className="relative bg-pure py-section overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, var(--color-sakura) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, var(--color-kin) 0%, transparent 40%)`,
          }}
        />
      </div>

      <div
        ref={ref}
        className="max-w-[1400px] mx-auto px-6 md:px-10 relative"
      >
        <div className="grid md:grid-cols-[80px_1fr_auto] gap-8 md:gap-16 items-start">
          {/* Left vertical label */}
          <div className="hidden md:flex flex-col items-center gap-4 pt-4">
            <div className="w-px h-16 bg-aka" />
            <span className="vertical-text text-stone whitespace-nowrap">
              The DrumGate Difference
            </span>
          </div>

          {/* Main content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Label */}
            <div className="flex items-center gap-3 mb-8">
              <span className="section-label text-aka">
                Care is a conversation
              </span>
            </div>

            {/* Big headline */}
            <h2
              className="font-serif text-kuro leading-[1.08] mb-8"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)' }}
            >
              Less noise.
              <br />
              <em className="text-stone" style={{ fontStyle: 'italic' }}>
                More presence.
              </em>
            </h2>

            {/* Body text */}
            <p className="text-ash text-base md:text-lg leading-relaxed max-w-lg mb-8">
              Healthcare can feel like a maze of tabs, waiting rooms and
              half-finished thoughts. DrumGate gives every part of the journey
              a little more room to breathe.
            </p>

            {/* CTA link */}
            <a
              href="#portals"
              className="inline-flex items-center gap-2 text-kuro text-sm font-medium border-b border-kuro pb-1 hover:border-aka hover:text-aka transition-colors duration-300"
            >
              Find your place
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M1 13L13 1M13 1H4M13 1V10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </a>
          </div>

          {/* Right decorative element */}
          <div
            className={`hidden lg:flex flex-col items-center justify-center transition-all duration-1000 delay-300 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="w-32 h-32 rounded-full border border-mist/30 flex flex-col items-center justify-center gap-1 relative">
              <span className="text-[0.6rem] tracking-[0.15em] uppercase text-stone">
                Care
              </span>
              <span className="font-jp text-aka text-xl">つながり</span>
              <span className="text-[0.6rem] tracking-[0.15em] uppercase text-stone">
                Connection
              </span>
              {/* Subtle rotation animation */}
              <div
                className="absolute inset-0 rounded-full border border-dashed border-mist/15"
                style={{ animation: 'spin 30s linear infinite' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
