'use client'

import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fill = fillRef.current
    if (!fill) return

    // Otimizando para usar o progresso global do scroll
    const updateProgress = () => {
      const winScroll = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (winScroll / height)
      fill.style.transform = `scaleX(${scrolled})`
    }

    window.addEventListener('scroll', updateProgress)
    window.addEventListener('resize', updateProgress)
    
    // Força um update inicial
    updateProgress()

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={fillRef} className="scroll-progress__fill" />
    </div>
  )
}
