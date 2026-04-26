'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ── Shader ────────────────────────────────────────────────────────────────── */
const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */`
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform float uBrightness;

  varying vec2 vUv;

  // Hash + noise
  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f*f*(3.0 - 2.0*f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for(int i = 0; i < 5; i++) {  // Was 7 — fewer octaves reduces GPU fragment cost ~28%
      v += a * noise(p);
      p  = p * 2.1 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float vel = uScrollVelocity * 0.12;
    vec2 uv = vUv;

    // Distortion driven by scroll velocity
    uv.y += sin(uv.x * 6.0 + uTime * 0.4) * (0.015 + vel);
    uv.x += cos(uv.y * 4.0 + uTime * 0.3) * (0.01 + vel * 0.5);

    float t  = uTime * 0.08 + vel * 2.0; // Time speeds up slightly on scroll
    float n1 = fbm(uv * 2.5 + vec2(t, t * 0.4));
    float n2 = fbm(uv * 3.8 + vec2(-t * 0.7, t));
    float n3 = fbm(uv * 1.6 + vec2(t * 0.3, -t * 0.8));

    float blended = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // Dark emerald color ramp
    vec3 darkVoid     = vec3(0.0,  0.02, 0.01);
    vec3 deepEmerald  = vec3(0.0,  0.18, 0.08);
    vec3 brightStream = vec3(0.05, 0.60, 0.22);
    vec3 specular     = vec3(0.7,  1.0,  0.8);

    vec3 color = darkVoid;
    color = mix(color, deepEmerald,  smoothstep(0.2, 0.45, blended));
    color = mix(color, brightStream, smoothstep(0.45, 0.7, blended));
    // Subtle Chromatic Aberration on scroll
    float shift = vel * 0.15;
    color.r *= 1.0 + shift;
    color.b *= 1.0 + shift * 0.5;
    color.g *= 1.0 - shift * 0.2;

    // Brightness arc driven by scroll position
    color *= uBrightness;

    gl_FragColor = vec4(color, 1.0);
  }
`

/* ── Shader Plane ──────────────────────────────────────────────────────────── */
interface FluidPlaneProps {
  scrollVelocityRef: React.MutableRefObject<number>
  brightnessRef:     React.MutableRefObject<number>
}

function FluidPlane({ scrollVelocityRef, brightnessRef }: FluidPlaneProps) {
  const timeRef = useRef(0)

  const uniforms = useMemo(() => ({
    uTime:           { value: 0 },
    uScrollVelocity: { value: 0 },
    uBrightness:     { value: 0.9 },
  }), [])

  useFrame((_, delta) => {
    timeRef.current += delta
    uniforms.uTime.value           = timeRef.current
    uniforms.uScrollVelocity.value += (Math.abs(scrollVelocityRef.current) - uniforms.uScrollVelocity.value) * 0.1
    uniforms.uBrightness.value     += (brightnessRef.current - uniforms.uBrightness.value) * 0.04
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ── Canvas Export ─────────────────────────────────────────────────────────── */
export default function FluidBackground({
  scrollVelocityRef,
  brightnessRef,
}: {
  scrollVelocityRef: React.MutableRefObject<number>
  brightnessRef:     React.MutableRefObject<number>
}) {
  return (
    <Canvas
      dpr={[1, 1]}
      orthographic
      camera={{ zoom: 1, position: [0, 0, 1] }}
      gl={{ antialias: false, alpha: false }}
      style={{ background: '#000500' }}
    >
      <FluidPlane
        scrollVelocityRef={scrollVelocityRef}
        brightnessRef={brightnessRef}
      />
    </Canvas>
  )
}
