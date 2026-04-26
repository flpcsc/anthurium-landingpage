import { useEffect, useRef } from 'react'

/**
 * Tracks raw normalized mouse position (-1 to 1).
 * Returns a ref — consumers lerp in their own RAF/useFrame loop.
 * Eliminates the standalone RAF that previously ran in parallel with Three.js's render loop.
 */
export function useMouseParallax(strength: number = 1) {
  const targetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current.x = ((e.clientX / window.innerWidth)  * 2 - 1) * strength
      targetRef.current.y = ((e.clientY / window.innerHeight) * 2 - 1) * strength
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [strength])

  return targetRef
}
