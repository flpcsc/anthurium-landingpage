'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const rootRef    = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barRef     = useRef<HTMLDivElement>(null)
  const panel1Ref  = useRef<HTMLDivElement>(null)
  const panel2Ref  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root    = rootRef.current
    const counter = counterRef.current
    const bar     = barRef.current
    const p1      = panel1Ref.current
    const p2      = panel2Ref.current
    if (!root || !counter || !bar || !p1 || !p2) return

    const tl = gsap.timeline({
      onComplete: () => {
        // Unmount preloader after exit animation
        root.style.display = 'none'
        onComplete()
      },
    })

    // Count up 0 → 100
    const obj = { val: 0 }
    tl.to(obj, {
      val: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counter) counter.textContent = String(Math.round(obj.val)).padStart(3, '0')
      },
    }, 0)

    // Progress bar fill
    tl.to(bar, {
      scaleX: 1,
      duration: 2.2,
      ease: 'power2.inOut',
    }, 0)

    // Counter fade out
    tl.to(counter, {
      opacity: 0,
      y: -30,
      duration: 0.5,
      ease: 'power2.in',
    }, 2.0)

    // Split panels exit — left panel slides left, right panel slides right
    tl.to(p1, {
      xPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
    }, 2.3)

    tl.to(p2, {
      xPercent: 100,
      duration: 0.9,
      ease: 'power4.inOut',
    }, 2.3)

    return () => { tl.kill() }
  }, [onComplete])

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      {/* Left panel */}
      <div
        ref={panel1Ref}
        style={{
          position: 'absolute',
          inset: 0,
          width: '50%',
          background: '#000',
          zIndex: 2,
        }}
      />
      {/* Right panel */}
      <div
        ref={panel2Ref}
        style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0,
          width: '50%',
          background: '#000',
          zIndex: 2,
        }}
      />

      {/* Counter */}
      <span
        ref={counterRef}
        className="preloader__counter"
        style={{ position: 'relative', zIndex: 3 }}
      >
        000
      </span>

      {/* Progress bar */}
      <div
        ref={barRef}
        className="preloader__bar"
        style={{ width: '100%', zIndex: 3 }}
      />
    </div>
  )
}
