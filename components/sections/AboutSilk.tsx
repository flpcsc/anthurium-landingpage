'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const PANELS = [
  {
    label: '01. ORIGEM',
    heading: 'Core de Inovação',
    body: 'Somos movidos pela simplificação de processos. Nossa base é o aprendizado constante aplicado à produtividade real.',
  },
  {
    label: '02. PRÁTICA',
    heading: 'Inteligência Nativa',
    body: 'Onde o time se encontra, a IA potencializa. Criamos um ambiente unificado onde formações distintas convergem em soluções únicas.',
  },
  {
    label: '03. VISÃO',
    heading: 'O Próximo Padrão',
    body: 'Atingir o nível máximo exige as ferramentas corretas. Dominar a tecnologia não é mais um diferencial, é a rota obrigatória.',
  },
]

export default function AboutSilk() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const panelRefs  = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    panelRefs.current.forEach((panel) => {
      if (!panel) return
      panel.style.opacity   = '0'
      panel.style.transform = 'translateY(28px)'
    })

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      panelRefs.current.forEach((panel, i) => {
        if (!panel) return
        gsap.to(panel, {
          opacity:  1,
          y:        0,
          duration: 0.75,
          ease:     'power3.out',
          delay:    i * 0.18,
        })
      })
    }, { threshold: 0.2 })

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        background:     '#ccdacc',
        minHeight:      '100vh',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'center',
        padding:        'clamp(5rem, 10vh, 8rem) clamp(2rem, 6vw, 6rem)',
        position:       'relative',
        overflow:       'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position:      'absolute',
        inset:         0,
        background:    'radial-gradient(ellipse at 20% 50%, rgba(46,204,113,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Label */}
      <h2
        className="display-lg"
        style={{ color: '#06682f', marginBottom: '4rem', position: 'relative', zIndex: 1, lineHeight: 1 }}
      >
        Sobre nós
      </h2>

      {/* Panels grid */}
      <div style={{
        display:               'grid',
        gridTemplateColumns:   'repeat(auto-fit, minmax(260px, 1fr))',
        gap:                   '3rem',
        position:              'relative',
        zIndex:                1,
      }}>
        {PANELS.map(({ label, heading, body }, i) => (
          <div
            key={i}
            ref={(el) => { panelRefs.current[i] = el }}
            style={{ borderTop: '1px solid rgba(26,138,74,0.3)', paddingTop: '2rem' }}
          >
            <span className="label" style={{ color: 'rgba(26,138,74,0.7)', display: 'block', marginBottom: '1.2rem' }}>
              {label}
            </span>

            <h3 
              className="display-md" 
              style={{ 
                color: '#0A1A0F', 
                marginBottom: '1.2rem', 
                lineHeight: 1.05,
                fontSize: 'clamp(1.5rem, 3.5vw, 3.2rem)',
                minHeight: '6.5rem',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              {heading}
            </h3>

            <p className="body-lg" style={{ color: 'rgba(10,26,15,0.5)', lineHeight: 1.5 }}>
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
