'use client'

import { useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Ground() {
  const meshRef = useRef()
  const waveTime = useRef(0)
  const ripples = useRef([])

  const { geometry, colors } = useMemo(() => {
    const width = 20
    const depth = 20
    const seg = 64
    const geo = new THREE.PlaneGeometry(width, depth, seg, seg)
    geo.rotateX(-Math.PI / 2)

    const pos = geo.attributes.position
    const colorArr = new Float32Array(pos.count * 3)
    const grassGreen = new THREE.Color('#7EC850')
    const grassLight = new THREE.Color('#A8E06C')
    const grassDark = new THREE.Color('#5DA33D')

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const dist = Math.sqrt(x * x + z * z)
      const t = Math.min(dist / 8, 1)
      const c = grassGreen.clone().lerp(grassLight, Math.random() * 0.4)
      if (t > 0.5) c.lerp(grassDark, (t - 0.5) * 2)
      colorArr[i * 3] = c.r
      colorArr[i * 3 + 1] = c.g
      colorArr[i * 3 + 2] = c.b
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colorArr, 3))
    geo.computeVertexNormals()

    return { geometry: geo, colors: colorArr }
  }, [])

  const handleClick = useCallback((e) => {
    if (!e.point) return
    ripples.current.push({
      x: e.point.x,
      z: e.point.z,
      time: 0,
      radius: 0,
      strength: 0.08,
    })
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    waveTime.current += delta
    const pos = meshRef.current.geometry.attributes.position
    const c = meshRef.current.geometry.attributes.color

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      let y = 0
      y += Math.sin(x * 1.5 + waveTime.current * 0.5) * 0.015
      y += Math.sin(z * 2.0 + waveTime.current * 0.3) * 0.01
      y += Math.sin((x + z) * 1.2 + waveTime.current * 0.4) * 0.008

      for (const r of ripples.current) {
        const dx = x - r.x
        const dz = z - r.z
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist < r.radius + 1) {
          const ripple = Math.sin(dist * 6 - r.time * 4) * r.strength * Math.max(0, 1 - dist / 3)
          y += ripple * (1 - r.time / 2)
        }
      }

      pos.setY(i, y)
    }

    ripples.current = ripples.current.filter(r => {
      r.time += delta
      r.radius += delta * 2
      return r.time < 2
    })

    pos.needsUpdate = true
    meshRef.current.geometry.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow onClick={handleClick}>
      <meshStandardMaterial
        vertexColors
        roughness={0.9}
        metalness={0}
        flatShading
      />
    </mesh>
  )
}
