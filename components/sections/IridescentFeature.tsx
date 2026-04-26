'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: '72%', label: 'Das empresas, vem integrando IA no dia a dia' },
  { value: '35%',   label: 'Média de crescimento operacional com IA'   },
  { value: '90%',  label: 'Dos gigantes de mercado investem em IA como diferêncial'        },
]

export default function IridescentFeature() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const bgRef       = useRef<HTMLDivElement>(null)
  const maskRef     = useRef<HTMLDivElement>(null)
  const headRef     = useRef<HTMLHeadingElement>(null)
  const statsRef    = useRef<(HTMLDivElement | null)[]>([])
  const warmRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Circle reveal ─────────────────────────────────────────────── */
      gsap.fromTo(maskRef.current,
        { clipPath: 'circle(0% at 50% 50%)' },
        {
          clipPath: 'circle(150% at 50% 50%)',
          duration: 2.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 35%',
            toggleActions: 'play none none none',
          },
        }
      )

      gsap.fromTo(bgRef.current,
        { scale: 1.05 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
          },
        }
      )

      /* ── Background parallax pan ───────────────────────────────────── */
      gsap.fromTo(bgRef.current,
        { backgroundPosition: '60% 40%' },
        {
          backgroundPosition: '40% 60%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 3,
          },
        }
      )

      /* ── Warm gold overlay on scroll ───────────────────────────────── */
      gsap.fromTo(warmRef.current,
        { opacity: 0 },
        {
          opacity: 0.35,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom top',
            scrub: 2,
          },
        }
      )

      /* ── Heading reveal ────────────────────────────────────────────── */
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      /* ── Stats stagger ─────────────────────────────────────────────── */
      const statEls = statsRef.current.filter(Boolean)
      gsap.fromTo(statEls,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: '#050A05',
      }}
    >
      <div
        ref={maskRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 1,
          clipPath: 'circle(0% at 50% 50%)',
        }}
      >
        <div
          ref={bgRef}
          style={{
            position: 'absolute',
            inset: '-10%',
            backgroundImage: `
              radial-gradient(ellipse at 30% 20%, #1A8A4A 0%, transparent 60%),
              radial-gradient(ellipse at 70% 80%, #C9A84C 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, #4A7FC1 0%, transparent 40%),
              linear-gradient(135deg, #050A05 0%, #0D2B14 40%, #1A3A08 100%)
            `,
            backgroundSize: '200% 200%',
            backgroundPosition: '60% 40%',
          }}
        />

        <div
          ref={warmRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at bottom right, #C9A84C55 0%, transparent 60%)',
            opacity: 0,
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.65) 100%)',
          }}
        />
      </div>

      <div
        className="relative z-10 w-[90%] md:w-[85%] mx-auto py-12 md:py-32 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-24 items-center"
      >
        <div>
          <span className="label" style={{ color: 'rgba(168,230,192,0.5)', display: 'block', marginBottom: '1.5rem' }}>
            Anthurium Intelligence
          </span>
          <h2
            ref={headRef}
            className="display-lg"
            style={{ color: '#fff', maxWidth: '15ch' }}
          >
            Agentes de IA já fazem grande parte do trabalho.
          </h2>
        </div>

        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '3rem', 
            paddingLeft: 'clamp(0rem, 5vw, 6rem)',
            transform: 'translateX(2vw)'
          }}
        >
          {STATS.map(({ value, label }, i) => (
            <div
              key={i}
              ref={(el) => { statsRef.current[i] = el }}
              style={{ 
                borderLeft: '1px solid rgba(46,204,113,0.3)', 
                paddingLeft: '2rem',
                transform: `translateX(${i * 15}px)` 
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(2.3rem, 5vw, 4.5rem)',
                  fontWeight: 200,
                  letterSpacing: '-0.04em',
                  color: '#2ECC71',
                  lineHeight: 1,
                }}
              >
                {value}
              </div>
              <div className="body-lg" style={{ color: 'rgba(240,255,244,0.45)', marginTop: '0.4rem', maxWidth: '28ch' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
