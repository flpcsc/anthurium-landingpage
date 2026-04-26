'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'

gsap.registerPlugin(ScrollTrigger)

export default function CTALight() {
  const sectionRef   = useRef<HTMLDivElement>(null)
  const bgRef        = useRef<HTMLDivElement>(null)
  const sculptureRef = useRef<HTMLDivElement>(null)
  const headRef      = useRef<HTMLHeadingElement>(null)
  const subRef       = useRef<HTMLParagraphElement>(null)
  const btnRef       = useRef<HTMLButtonElement>(null)
  const mouseRef     = useRef({ x: 0, y: 0 })
  // Refs instead of dataset reads — avoids layout thrashing
  const cxRef        = useRef(0)
  const cyRef        = useRef(0)

  useMagneticCursor(btnRef, { strength: 0.4, ease: 0.1 })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo([subRef.current, btnRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(sculptureRef.current,
        { y: 60, rotate: 0 },
        {
          y: -60,
          rotate: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        }
      )

      gsap.fromTo(bgRef.current,
        { scale: 1.08, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1.5,
          },
        }
      )
    }, sectionRef)

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth  - 0.5) * 30
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 20
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let rafId: number
    const tick = () => {
      // Use refs instead of dataset to avoid DOM reads on every frame
      cxRef.current += (mouseRef.current.x - cxRef.current) * 0.05
      cyRef.current += (mouseRef.current.y - cyRef.current) * 0.05
      gsap.set(sculptureRef.current, { x: cxRef.current, y: cyRef.current })
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      ctx.revert()
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
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
        justifyContent: 'flex-start',
        background: '#C8EDD6',
      }}
    >
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(ellipse at 70% 30%, rgba(168,230,192,0.8) 0%, transparent 60%),
            radial-gradient(ellipse at 30% 70%, rgba(201,168,76,0.3) 0%, transparent 50%)
          `,
        }}
      />

      <div
        ref={sculptureRef}
        style={{
          position: 'absolute',
          right: '-5%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 'clamp(300px, 50vw, 700px)',
          height: 'clamp(300px, 50vw, 700px)',
          borderRadius: '50%',
          background: `
            radial-gradient(ellipse at 35% 35%,
              rgba(255,255,255,0.9) 0%,
              rgba(168,230,192,0.7) 25%,
              rgba(26,138,74,0.5) 55%,
              rgba(5,10,5,0.3) 100%
            )
          `,
          boxShadow: `
            inset -20px -20px 60px rgba(0,0,0,0.3),
            inset 10px 10px 40px rgba(255,255,255,0.4),
            0 30px 80px rgba(0,0,0,0.15)
          `,
          willChange: 'transform',
        }}
      >
        <div style={{
          position: 'absolute',
          inset: '15%',
          borderRadius: '50%',
          background: `
            radial-gradient(ellipse at 40% 40%,
              rgba(255,255,255,0.6) 0%,
              rgba(168,230,192,0.3) 40%,
              transparent 70%
            )
          `,
        }} />
      </div>

      <div
        className="relative z-10 text-left px-8 md:px-16 lg:px-[clamp(2rem,8vw,8rem)] max-w-[100%] md:max-w-[90%] lg:max-w-[80%]"
      >
        <span className="label" style={{ color: 'rgba(5,10,5,0.4)', display: 'block', marginBottom: '1.5rem' }}>
          Comece a sua evolução
        </span>

        <h2
          ref={headRef}
          className="display-lg"
          style={{ 
            color: '#050A05', 
            marginBottom: '1.2rem',
            lineHeight: 1.1 
          }}
        >
          Grandes mudanças<br />
          precisam de uma<br />
          pequena decisão<br />
          <span 
            style={{ 
              color: '#1A8A4A', 
              position: 'relative',
              display: 'inline-block',
              fontWeight: 400,
              filter: 'drop-shadow(0 0 8px rgba(26,138,74,0.2))'
            }}
          >
            inicial.
          </span>
        </h2>

        <p
          ref={subRef}
          className="body-lg"
          style={{ color: 'rgba(5,10,5,0.5)', maxWidth: '40ch', margin: '0 0 3rem' }}
        >
          Fale conosco e entenda nossos serviços - Pode ser um passo para seu crescimento.
        </p>

        <button
          ref={btnRef}
          data-magnetic
          className="magnetic-btn"
          onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
          style={{
            color: '#050A05',
            borderColor: 'rgba(5,10,5,0.25)',
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>Entre em contato</span>
        </button>
      </div>
    </section>
  )
}
