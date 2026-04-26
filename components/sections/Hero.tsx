'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HERO_COPY = {
  eyebrow: 'Est. 2026',
  headline: ['Pensado', 'Para empresas'],
  sub: 'De pessoas para pessoas — onde a IA entrega o seu resultado.',
}

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLDivElement>(null)
  const line1Ref   = useRef<HTMLSpanElement>(null)
  const line2Ref   = useRef<HTMLSpanElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const scrollLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Entrance ────────────────────────────────────────────────────── */
      const entranceTl = gsap.timeline({ delay: 0.3 })

      entranceTl
        .fromTo([line1Ref.current, line2Ref.current],
          { opacity: 0, y: 60, skewY: 4 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12 }
        )
        .fromTo(subRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
          '-=0.6'
        )

      /* ── Scroll indicator animation ────────────────────────────────── */
      const scrollTl = gsap.timeline({ repeat: -1 })
      scrollTl
        .fromTo(scrollLineRef.current, 
          { scaleY: 0, transformOrigin: 'top', opacity: 0 }, 
          { scaleY: 1, opacity: 1, duration: 1, ease: 'power2.inOut' }
        )
        .to(scrollLineRef.current, 
          { scaleY: 0, transformOrigin: 'bottom', opacity: 0, duration: 1, ease: 'power2.inOut' }
        )

      /* ── Video scale + fade out ──────────────────────────────────────── */
      gsap.to(canvasRef.current, {
        scale: 0.88,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: '80% top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={wrapperRef}
      className="section--sticky-wrapper"
      style={{ height: '100vh' }}
      id="hero"
    >
      <div ref={stickyRef} className="section--sticky-inner">

        {/* Video layer — replaces Three.js canvas */}
        <div
          ref={canvasRef}
          className="canvas-layer gpu"
          style={{ willChange: 'transform, opacity' }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          >
            <source src="/0420.webm" type="video/webm" />
          </video>
        </div>

        {/* Radial vignette */}
        <div
          className="canvas-layer gradient-radial-dark"
          style={{ pointerEvents: 'none' }}
        />

        {/* Bottom fade — funde o hero com a seção seguinte sem expor body preto */}
        <div
          className="canvas-layer"
          style={{
            background: 'linear-gradient(to bottom, transparent 55%, #000000 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Text content */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 'clamp(2rem, 5vw, 5rem)',
            paddingBottom: 'clamp(3rem, 8vh, 7rem)',
            pointerEvents: 'none',
          }}
        >
          <h1 className="display-xl" style={{ transform: 'translateY(-5%)' }}>
            <span
              ref={line1Ref}
              style={{ 
                display: 'block', 
                willChange: 'transform, opacity',
                background: 'linear-gradient(to bottom, #666 0%, #000 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {HERO_COPY.headline[0]}
            </span>
            <span
              ref={line2Ref}
              style={{
                display: 'block',
                WebkitTextStroke: '1px rgba(255,255,255,0.25)',
                color: 'transparent',
                willChange: 'transform, opacity',
              }}
            >
              {HERO_COPY.headline[1]}
            </span>
          </h1>
          <p 
            ref={subRef}
            className="body-lg" 
            style={{ 
              marginTop: '1.5rem', 
              color: 'rgba(255,255,255,0.4)', 
              maxWidth: '35ch',
              opacity: 0,
            }}
          >
            {HERO_COPY.sub}
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            right: 'clamp(2rem, 5vw, 5rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: 1,
          }}
        >
          <span className="label" style={{ writingMode: 'vertical-rl', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)' }}>
            scroll
          </span>
          <div 
            ref={scrollLineRef}
            style={{
              width: 1,
              height: 48,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
            }} 
          />
        </div>
      </div>
    </section>
  )
}
