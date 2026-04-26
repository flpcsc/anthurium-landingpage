'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { scrollTo } from '@/hooks/useLenis'

const LINKS = [
  { label: 'Inicio', href: '#hero'   },
  { label: 'Visão',    href: '#manifesto'  },
  { label: 'Processo',    href: '#services'  },
  { label: 'Sobre nós',   href: '#about'     },
  { label: 'Contato', href: '#contact'   },
]

export default function Nav() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    // Entrance: fade down from above
    gsap.fromTo(nav,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.4, ease: 'power3.out' }
    )
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) scrollTo(target as HTMLElement, { duration: 2 })
  }

  return (
    <nav ref={navRef} className="nav" aria-label="Main navigation">
      <span className="nav__logo">Anthurium</span>

      <ul className="nav__links">
        {LINKS.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              className="nav__link"
              data-magnetic
              onClick={(e) => {
                if (label === 'Contato') {
                  e.preventDefault()
                  window.dispatchEvent(new CustomEvent('open-contact-modal'))
                } else {
                  handleClick(e, href)
                }
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
