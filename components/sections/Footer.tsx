'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FOOTER_LINKS = [
  {
    category: 'Menu',
    links: [
      { name: 'Inicio',    href: '#hero' },
      { name: 'Visão',     href: '#manifesto' },
      { name: 'Processo',  href: '#services' },
      { name: 'Sobre nós', href: '#about' },
      { name: 'Contato',   href: '#contact', isContactModal: true },
    ]
  },
  {
    category: 'Contato',
    links: [
      { name: 'E-mail',   href: 'mailto:contato@anthuriumtech.com.br' },
      { name: 'Instagram', href: 'https://instagram.com/anthuriumtech' },
      { name: 'Whatsapp',  href: 'https://wa.me/5511965034299' },
    ]
  },
]

export default function Footer() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(wordmarkRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(gridRef.current?.children ?? [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={sectionRef}
      id="contact"
      style={{
        position: 'relative',
        background: '#000',
        overflow: 'hidden',
        boxSizing: 'border-box',
        width: '100%',
        padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 5vw, 5rem)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '40%',
        background: 'radial-gradient(ellipse at center bottom, rgba(26,138,74,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div
        ref={wordmarkRef}
        style={{
          fontSize: 'clamp(4rem, 12vw, 14rem)',
          fontWeight: 200,
          letterSpacing: '-0.06em',
          color: 'rgba(255,255,255,0.04)',
          lineHeight: 0.9,
          marginBottom: '6rem',
          userSelect: 'none',
        }}
      >
        Anthurium
      </div>

      <div
        ref={gridRef}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(4rem, 15vw, 12rem)',
          marginBottom: '5rem',
        }}
      >
        {FOOTER_LINKS.map(({ category, links }) => (
          <div key={category}>
            <span
              className="label"
              style={{ color: 'rgba(255,255,255,0.25)', display: 'block', marginBottom: '1.2rem' }}
            >
              {category}
            </span>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {links.map((link) => (
                <li key={link.name}>
                  {link.isContactModal ? (
                    <a 
                      href={link.href} 
                      className="footer-link"
                      onClick={(e) => {
                        e.preventDefault()
                        window.dispatchEvent(new CustomEvent('open-contact-modal'))
                      }}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span className="label" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © 2026 Anthurium. Todos direitos reservados.
        </span>
        <span className="label" style={{ color: 'rgba(255,255,255,0.12)' }}>
          Living Forms
        </span>
      </div>
    </footer>
  )
}
