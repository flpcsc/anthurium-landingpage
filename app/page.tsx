'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { initLenis } from '@/hooks/useLenis'
import ScrollProgress from '@/components/ui/ScrollProgress'
import Nav from '@/components/ui/Nav'
import Preloader from '@/components/sections/Preloader'

const Hero               = dynamic(() => import('@/components/sections/Hero'),               { ssr: false })
const MarqueeStrip       = dynamic(() => import('@/components/sections/MarqueeStrip'),       { ssr: false })
const Manifesto          = dynamic(() => import('@/components/sections/Manifesto'),          { ssr: false })
const HorizontalServices = dynamic(() => import('@/components/sections/HorizontalServices'), { ssr: false })
const IridescentFeature  = dynamic(() => import('@/components/sections/IridescentFeature'),  { ssr: false })
const AboutSilk          = dynamic(() => import('@/components/sections/AboutSilk'),          { ssr: false })
const CTALight           = dynamic(() => import('@/components/sections/CTALight'),           { ssr: false })
const Footer             = dynamic(() => import('@/components/sections/Footer'),             { ssr: false })

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const lenisRef = useRef<ReturnType<typeof initLenis> | null>(null)

  useEffect(() => {
    if (!loaded) return

    lenisRef.current = initLenis()

    // Three refresh passes — dynamic imports (especially shader/canvas sections)
    // mount at different times. A single timeout isn't enough.
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 300)
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1000)
    const t3 = setTimeout(() => ScrollTrigger.refresh(), 2500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      lenisRef.current?.destroy()
    }
  }, [loaded])

  return (
    <>
      <Preloader onComplete={() => setLoaded(true)} />

      {loaded && (
        <>
          <ScrollProgress />
          <Nav />

          <main>
            <Hero />
            <MarqueeStrip />
            <Manifesto />
            <HorizontalServices />
            <IridescentFeature />
            <AboutSilk />
            <CTALight />
            <Footer />
          </main>
        </>
      )}
    </>
  )
}
