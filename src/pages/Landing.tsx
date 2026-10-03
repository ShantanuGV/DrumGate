import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Philosophy from '../components/Philosophy'
import Trust from '../components/Trust'
import Portals from '../components/Portals'
import HowItWorks from '../components/HowItWorks'
import ZenSection from '../components/ZenSection'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <Trust />
        <Portals />
        <ZenSection />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
