'use client'

import { useEffect, useRef } from 'react'
import { getLenis } from '@/hooks/useLenis'

const ITEMS = [
  'Excelência com IA',
  'Produtividade',
  'Financeiro',
  'Marketing',
  'Fluxo de caixa',
  'Impostos',
  'Vendas',
  'Automatização',
]

const ALL_ITEMS = [...ITEMS, ...ITEMS, ...ITEMS]

export default function MarqueeStrip() {
  const trackRef      = useRef<HTMLDivElement>(null)
  const track2Ref     = useRef<HTMLDivElement>(null)
  const xRef          = useRef(0)
  const velRef        = useRef(0)

  useEffect(() => {
    const track  = trackRef.current
    const track2 = track2Ref.current
    if (!track || !track2) return

    const totalWidth = track.scrollWidth / 3
    const BASE_SPEED = -0.5
    let rafId: number

    const tick = () => {
      const lenis    = getLenis()
      const scrollVel = lenis ? (lenis as { velocity?: number }).velocity ?? 0 : 0
      velRef.current += (scrollVel * 0.12 - velRef.current) * 0.08

      xRef.current += BASE_SPEED - velRef.current

      if (xRef.current <= -totalWidth) xRef.current += totalWidth
      if (xRef.current >= 0)           xRef.current -= totalWidth

      // Direct style.transform: skips GSAP overhead for a hot-path RAF assignment
      const t = `translateX(${xRef.current}px)`
      track.style.transform  = t
      track2.style.transform = t

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const Item = ({ text, idx }: { text: string; idx: number }) => (
    <div
      className="marquee-item"
      style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}
    >
      <span
        style={{
          fontSize: 'clamp(0.75rem, 1.2vw, 1rem)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: idx % 2 === 0 ? 'rgba(168,230,192,0.5)' : 'rgba(255,255,255,0.18)',
          fontWeight: 300,
        }}
      >
        {text}
      </span>
      <span style={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: 'rgba(26,138,74,0.4)',
        flexShrink: 0,
      }} />
    </div>
  )

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem 0',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: '#040A04',
      }}
    >
      <div style={{ overflow: 'hidden', marginBottom: '0.75rem' }}>
        <div ref={trackRef} className="marquee-track">
          {ALL_ITEMS.map((text, i) => (
            <Item key={`r1-${i}`} text={text} idx={i} />
          ))}
        </div>
      </div>

      <div style={{ overflow: 'hidden', transform: 'scaleX(-1)' }}>
        <div ref={track2Ref} className="marquee-track">
          {ALL_ITEMS.map((text, i) => (
            <Item key={`r2-${i}`} text={text} idx={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
