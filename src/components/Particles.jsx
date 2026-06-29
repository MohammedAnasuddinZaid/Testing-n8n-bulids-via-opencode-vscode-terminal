'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({ count = 200 }) {
  const ref = useRef()
  const timeRef = useRef(0)

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)

    const palette = [
      new THREE.Color('#FFD700'),
      new THREE.Color('#FF9F43'),
      new THREE.Color('#FF6B6B'),
      new THREE.Color('#A8E06C'),
      new THREE.Color('#74B9FF'),
    ]

    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI - Math.PI / 2
      pos[i * 3] = Math.cos(theta) * radius
      pos[i * 3 + 1] = Math.random() * 6 + 0.5
      pos[i * 3 + 2] = Math.sin(theta) * radius
      vel[i * 3] = (Math.random() - 0.5) * 0.005
      vel[i * 3 + 1] = 0.002 + Math.random() * 0.005
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005
      const c = palette[Math.floor(Math.random() * palette.length)]
      cols[i * 3] = c.r
      cols[i * 3 + 1] = c.g
      cols[i * 3 + 2] = c.b
    }
    return [pos, vel, cols]
  }, [count])

  useFrame((_, delta) => {
    if (!ref.current) return
    timeRef.current += delta
    const pos = ref.current.geometry.attributes.position.array

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      pos[idx] += velocities[idx] + Math.sin(timeRef.current + i) * 0.001
      pos[idx + 1] += velocities[idx + 1]
      pos[idx + 2] += velocities[idx + 2] + Math.cos(timeRef.current + i) * 0.001

      if (pos[idx + 1] > 6.5) {
        pos[idx + 1] = 0.5
        pos[idx] = (Math.random() - 0.5) * 8
        pos[idx + 2] = (Math.random() - 0.5) * 8
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
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
