import { useEffect } from 'react'
import { Footer } from '../components/Footer.tsx'
import { ChannelsSection } from '../components/landing/ChannelsSection.tsx'
import { HeroSection } from '../components/landing/HeroSection.tsx'
import { HowSection } from '../components/landing/HowSection.tsx'
import { ProblemSection } from '../components/landing/ProblemSection.tsx'
import { TrustSection } from '../components/landing/TrustSection.tsx'
import { Navbar } from '../components/Navbar.tsx'

export default function Landing() {
  useEffect(() => {
    document.title = 'Agrisure — Scan. Verify. Farm with confidence.'
  }, [])

  return (
    <div>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowSection />
        <ChannelsSection />
        <TrustSection />
      </main>
      <Footer />
    </div>
  )
}
