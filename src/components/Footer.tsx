import { ArrowUpRight } from 'lucide-react'

const footerLinks = {
  Platform: ['Patient Portal', 'Doctor Portal', 'Admin Portal', 'Mobile App'],
  Company: ['About', 'Careers', 'Press', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
}

export default function Footer() {
  return (
    <footer className="bg-kuro border-t border-charcoal/40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Main footer */}
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 py-16">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="red-seal !w-8 !h-8">
                <span className="text-aka font-serif text-xs font-bold">鼓</span>
              </div>
              <span className="text-washi text-sm tracking-[0.25em] uppercase font-medium">
                DrumGate
              </span>
            </div>
            <p className="text-stone text-sm leading-relaxed mb-6 max-w-xs">
              A healthcare platform designed with care, built with purpose.
              Connecting patients, doctors, and administrators.
            </p>
            <p className="text-stone/60 text-xs italic font-serif">
              Where care finds its way.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-washi text-xs tracking-[0.2em] uppercase font-medium mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => {
                  const isContact = link === 'Contact'
                  const href = isContact
                    ? 'https://mail.google.com/mail/?view=cm&fs=1&to=rbhai4515%2B112%40gmail.com&su=Inquiry%20regarding%20DrumGate'
                    : '#'
                  return (
                    <li key={link}>
                      <a
                        href={href}
                        target={isContact ? '_blank' : undefined}
                        rel={isContact ? 'noopener noreferrer' : undefined}
                        className="text-stone text-sm hover:text-washi transition-colors duration-300 flex items-center gap-1 group"
                      >
                        {link}
                        <ArrowUpRight
                          size={10}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-charcoal/30 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-stone/50 text-xs">
            © {new Date().getFullYear()} DrumGate. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-stone/40 text-xs flex items-center gap-1">
              Crafted by{' '}
              <a
                href="https://www.shantanuvispute.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone/70 hover:text-aka transition-colors inline-flex items-center gap-0.5 underline underline-offset-2"
              >
                Shantanu Gopal Vispute
                <ArrowUpRight size={10} />
              </a>
            </span>
            <div className="w-1 h-1 rounded-full bg-aka/40" />
            <span className="text-stone/40 text-xs font-jp">鼓門</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
