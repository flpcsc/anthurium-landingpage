'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    number: '00',
    title: 'O Processo:',
    desc: 'Veja como fazemos e automatizamos tudo para você',
    tag: 'Inicio',
    accent: '#A8E6C0',
    image: '/images/services/service-5.jpg'
  },
  {
    number: '01',
    title: 'Avaliação',
    desc: 'Seus processo são mapeados pelo nosso time, e um relatório é criado a partir desse mapeamento',
    tag: 'Mapeamento',
    accent: '#2ECC71',
    image: '/images/services/service-1.jpg'
  },
  {
    number: '02',
    title: 'Produto',
    desc: 'O melhor produto é sugerido para cada caso, buscando eficiência entre custo e complexidade',
    tag: 'Escolha',
    accent: '#C9A84C',
    image: '/images/services/service-2.jpg'
  },
  {
    number: '03',
    title: 'Desenvolvimento',
    desc: 'Após selecionar o seu produto, as suas automações são desenvolvidas e implementadas com agilidade',
    tag: 'Implementação',
    accent: '#4A7FC1',
    image: '/images/services/service-3.jpg'
  },
  {
    number: '04',
    title: 'Resultado',
    desc: 'Entregamos suas automações, monitoramos a eficiência das implementações e geramos o seu feedback de produtividade',
    tag: 'Consolidação',
    accent: '#7B5EA7',
    image: '/images/services/service-4.jpg'
  },
]

export default function HorizontalServices() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track   = trackRef.current
      const wrapper = wrapperRef.current
      if (!track || !wrapper) return

      const cards = Array.from(track.querySelectorAll('.h-scroll-card'))

      // Make all card content visible immediately — content-in animation
      // is driven by the horizontal scroll tween's onUpdate below
      cards.forEach((card) => {
        const els = card.querySelectorAll('.card-line, .card-number, .card-title, .card-desc, .card-tag')
        gsap.set(els, { opacity: 0, y: 30 })
        const line = card.querySelector('.card-line')
        if (line) gsap.set(line, { scaleX: 0, y: 0 })
      })

      /* ── Main horizontal scroll ──────────────────────────────────────── */
      const hScrollTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${(track.scrollWidth - window.innerWidth) * 1.6}`,
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Animate each card's content in as it scrolls into view
            const totalCards = cards.length
            cards.forEach((card, i) => {
              // Each card occupies 1/totalCards of the total progress
              const cardStart    = i / totalCards
              const cardProgress = Math.max(0, Math.min(1, (self.progress - cardStart) * totalCards))

              if (cardProgress > 0.05) {
                const els = card.querySelectorAll('.card-number, .card-title, .card-desc, .card-tag')
                const line = card.querySelector('.card-line')
                gsap.to(els,  { opacity: 1, y: 0,       duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
                gsap.to(line, { scaleX: 1, duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
              }
            })
          },
        },
      })

      return () => hScrollTween.kill()
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={wrapperRef}
      id="services"
      style={{ background: '#050A05' }}
    >
      <div
        ref={trackRef}
        className="h-scroll-track"
        style={{ height: '100vh' }}
      >
        {SERVICES.map(({ number, title, desc, tag, accent, image }, i) => (
          <div
            key={i}
            className="h-scroll-card"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              padding: 'clamp(2rem, 5vw, 5rem)',
              paddingBottom: 'clamp(3rem, 8vh, 7rem)',
              borderRight: '1px solid rgba(255,255,255,0.04)',
              overflow: 'hidden',
              background: '#050A05',
            }}
          >
            {/* Background Image Otomizado (Lazy load by default) */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.4, zIndex: 0 }}>
              <Image
                src={image}
                alt=""
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 100vw"
                quality={80}
              />
            </div>
            
            {/* Dark Overlay to ensure text readability */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: i % 2 === 0
                  ? 'linear-gradient(135deg, rgba(5,10,5,0.95) 0%, rgba(10,26,15,0.8) 100%)'
                  : 'rgba(0,0,0,0.85)',
                zIndex: 0,
              }}
            />

            <span
              style={{
                position: 'absolute',
                top: '50%',
                right: '8%',
                transform: 'translateY(-50%)',
                fontSize: 'clamp(8rem, 18vw, 20rem)',
                fontWeight: 200,
                color: 'rgba(255,255,255,0.02)',
                letterSpacing: '-0.06em',
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              {number}
            </span>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '55ch' }}>
              <div
                className="card-line"
                style={{
                  width: 40,
                  height: 1,
                  background: accent,
                  marginBottom: '2rem',
                  transformOrigin: 'left',
                }}
              />

              <span
                className="card-number label"
                style={{ color: accent, display: 'block', marginBottom: '1.5rem' }}
              >
                {number}
              </span>

              <h2
                className="card-title display-md"
                style={{ 
                  color: '#fff', 
                  marginBottom: '1.5rem',
                  fontSize: 'clamp(2rem, 6vw, 5rem)' 
                }}
              >
                {title}
              </h2>

              <p
                className="card-desc body-lg"
                style={{ 
                  color: 'rgba(240,255,244,0.45)', 
                  marginBottom: '2.5rem',
                  fontSize: 'clamp(1.1rem, 2vw, 1.4rem)'
                }}
              >
                {desc}
              </p>

              <span
                className="card-tag"
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1.2rem',
                  border: `1px solid ${accent}30`,
                  borderRadius: 999,
                  fontSize: '0.68rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: accent,
                }}
              >
                {tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
