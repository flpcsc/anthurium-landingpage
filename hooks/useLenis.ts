import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function initLenis(): Lenis {
  if (lenisInstance) {
    lenisInstance.destroy()
  }

  lenisInstance = new Lenis({
    duration: 1.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.8,
    infinite: false,
  })

  // Bridge Lenis → GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000)
  })

  // Critical: disable GSAP lag smoothing for Lenis compatibility
  gsap.ticker.lagSmoothing(0)

  return lenisInstance
}

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function stopLenis(): void {
  lenisInstance?.stop()
}

export function startLenis(): void {
  lenisInstance?.start()
}

export function scrollTo(
  target: string | number | HTMLElement,
  options?: { duration?: number; offset?: number; onComplete?: () => void }
): void {
  lenisInstance?.scrollTo(target, {
    duration: options?.duration ?? 1.6,
    offset: options?.offset ?? 0,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    onComplete: options?.onComplete,
  })
}
