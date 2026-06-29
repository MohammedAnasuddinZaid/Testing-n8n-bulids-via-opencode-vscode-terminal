'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({ count = 400 }) {
  const ref = useRef()
  const timeRef = useRef(0)

  const [positions, velocities, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    const siz = new Float32Array(count)

    const palette = [
      '#FFD700', '#FF9F43', '#FF6B6B',
      '#A8E06C', '#74B9FF', '#C084FC',
      '#FFB5C2', '#60A5FA',
    ].map((h) => new THREE.Color(h))

    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      pos[i * 3] = Math.cos(theta) * radius
      pos[i * 3 + 1] = Math.random() * 7 + 0.3
      pos[i * 3 + 2] = Math.sin(theta) * radius
      vel[i * 3] = (Math.random() - 0.5) * 0.008
      vel[i * 3 + 1] = 0.003 + Math.random() * 0.008
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008
      const c = palette[Math.floor(Math.random() * palette.length)]
      cols[i * 3] = c.r
      cols[i * 3 + 1] = c.g
      cols[i * 3 + 2] = c.b
      siz[i] = 0.03 + Math.random() * 0.08
    }
    return [pos, vel, cols, siz]
  }, [count])

  useFrame((_, delta) => {
    if (!ref.current) return
    timeRef.current += delta
    const pos = ref.current.geometry.attributes.position.array

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      pos[idx] += velocities[idx] + Math.sin(timeRef.current * 0.5 + i) * 0.002
      pos[idx + 1] += velocities[idx + 1]
      pos[idx + 2] += velocities[idx + 2] + Math.cos(timeRef.current * 0.5 + i) * 0.002

      if (pos[idx + 1] > 7.5) {
        pos[idx + 1] = 0.3
        pos[idx] = (Math.random() - 0.5) * 10
        pos[idx + 2] = (Math.random() - 0.5) * 10
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
