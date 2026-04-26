import { useEffect, RefObject } from 'react'
import gsap from 'gsap'

interface MagneticOptions {
  strength?: number   // 0–1, default 0.35
  ease?: number       // lerp factor, default 0.12
}

/**
 * Attaches magnetic pull effect to a DOM element.
 * When cursor enters the element's proximity, it pulls the element toward the cursor.
 */
export function useMagneticCursor(
  ref: RefObject<HTMLElement>,
  options: MagneticOptions = {}
) {
  const { strength = 0.35, ease = 0.12 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let rafId: number
    let mx = 0, my = 0
    let cx = 0, cy = 0

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Distance from cursor to element center
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY

      mx = dx * strength
      my = dy * strength
    }

    const onMouseLeave = () => {
      mx = 0
      my = 0
    }

    const tick = () => {
      cx += (mx - cx) * ease
      cy += (my - cy) * ease

      gsap.set(el, { x: cx, y: cy })
      rafId = requestAnimationFrame(tick)
    }

    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)
    rafId = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(rafId)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [ref, strength, ease])
}

/**
 * Global cursor position tracking — used by Cursor component.
 */
export function trackGlobalCursor(
  dotEl: HTMLElement,
  ringEl: HTMLElement
) {
  let mouseX = 0, mouseY = 0
  let dotX = 0,   dotY = 0
  let ringX = 0,  ringY = 0
  let rafId: number

  const onMove = (e: MouseEvent) => {
    mouseX = e.clientX
    mouseY = e.clientY
  }

  const onEnterMagnetic = () => document.body.classList.add('cursor-hover')
  const onLeaveMagnetic = () => document.body.classList.remove('cursor-hover')

  document.addEventListener('mousemove', onMove)

  // Attach hover state to all magnetic elements
  const magneticEls = document.querySelectorAll('[data-magnetic]')
  magneticEls.forEach((el) => {
    el.addEventListener('mouseenter', onEnterMagnetic)
    el.addEventListener('mouseleave', onLeaveMagnetic)
  })

  const tick = () => {
    // Dot follows cursor directly (near-instant)
    dotX += (mouseX - dotX) * 0.85
    dotY += (mouseY - dotY) * 0.85

    // Ring follows with lag
    ringX += (mouseX - ringX) * 0.1
    ringY += (mouseY - ringY) * 0.1

    gsap.set(dotEl,  { x: dotX,  y: dotY  })
    gsap.set(ringEl, { x: ringX, y: ringY })

    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)

  return () => {
    document.removeEventListener('mousemove', onMove)
    magneticEls.forEach((el) => {
      el.removeEventListener('mouseenter', onEnterMagnetic)
      el.removeEventListener('mouseleave', onLeaveMagnetic)
    })
    cancelAnimationFrame(rafId)
  }
}
