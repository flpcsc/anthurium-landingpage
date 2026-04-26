'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'

gsap.registerPlugin(ScrollTrigger)

const FluidBackground = dynamic(() => import('@/components/canvas/FluidBackground'), { ssr: false })

const LINES = [
  { text: 'Trazemos a reinvenção.', accent: false },
  { text: 'Processos consomem tempo.', accent: false },
  { text: 'Otimizá-los é o nosso objetivo.', accent: true },
]

export default function Manifesto() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<(HTMLSpanElement | null)[]>([])
  const scrollVelRef = useRef(0)
  const brightnessRef = useRef(0.5)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const lines = linesRef.current.filter(Boolean) as HTMLSpanElement[]

    lines.forEach((line) => {
      gsap.set(line, {
        opacity: 0,
        y: 60,
        scale: 0.9,
        filter: 'blur(20px)',
        skewY: 3
      })
    })

    /* ── Line reveal via ScrollTrigger ────────────────────────── */
    gsap.to(lines, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      skewY: 0,
      duration: 2.2,
      ease: 'power3.out',
      stagger: 0.25,
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top 80%',
        once: true,
      }
    })

    /* ── Brightness arc via rAF ──────────────────────────────────────── */
    let rafId: number
    const tick = () => {
      const wrapper = wrapperRef.current
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect()
        const total = wrapper.offsetHeight - window.innerHeight
        const progress = Math.max(0, Math.min(1, -rect.top / total))
        brightnessRef.current = 0.65 + Math.sin(progress * Math.PI) * 0.55

        const vel = window.scrollY - lastScrollY.current
        scrollVelRef.current += (vel - scrollVelRef.current) * 0.1
        lastScrollY.current = window.scrollY

        // Kinetic Skew application
        const skew = Math.max(-20, Math.min(20, scrollVelRef.current * 0.8))
        lines.forEach((line) => {
          gsap.set(line, { skewX: skew * 0.3, force3D: true })
        })
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section
      ref={wrapperRef}
      id="manifesto"
      className="section--sticky-wrapper"
      style={{ height: '100vh', background: '#000' }}
    >
      <div className="section--sticky-inner">

        <div className="canvas-layer">
          <FluidBackground
            scrollVelocityRef={scrollVelRef}
            brightnessRef={brightnessRef}
          />
        </div>

        <div
          className="canvas-layer"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(2rem, 8vw, 10rem)',
            paddingTop: 'clamp(2rem, 8vw, 10rem)',
            transform: 'translateY(4vh)',
            gap: 'clamp(0.6rem, 1.8vh, 1.5rem)',
            zIndex: 1,
          }}
        >
          {LINES.map(({ text, accent }, i) => (
            <span
              key={i}
              ref={(el) => { linesRef.current[i] = el }}
              className="display-lg gpu"
              style={{
                display: 'block',
                fontSize: 'clamp(1.8rem, 5.2vw, 6.0rem)',
                color: accent ? '#2ECC71' : 'rgba(240,255,244,0.9)',
                willChange: 'transform, opacity, clip-path',
                overflowWrap: 'break-word',
                lineHeight: 1.1,
                maxWidth: '100%',
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
