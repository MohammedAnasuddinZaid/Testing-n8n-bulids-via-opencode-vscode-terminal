'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Flower({ position, color }) {
  const ref = useRef()
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.02, 0.1, 0.02]} />
        <meshStandardMaterial color="#4A7C2E" roughness={0.9} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 5) * Math.PI * 2) * 0.04,
            0.12,
            Math.sin((i / 5) * Math.PI * 2) * 0.04,
          ]}
          rotation={[0, 0, (i / 5) * Math.PI * 2]}
        >
          <circleGeometry args={[0.02, 5]} />
          <meshStandardMaterial color={color} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh position={[0, 0.1, 0]}>
        <circleGeometry args={[0.015, 6]} />
        <meshStandardMaterial color="#FFE066" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Flowers() {
  const positions = useMemo(() => {
    const arr = []
    const colors = ['#FF6B8A', '#FFB5C2', '#FFE066', '#C084FC', '#60A5FA']
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1.5 + Math.random() * 6
      arr.push({
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    return arr
  }, [])

  return positions.map((p, i) => <Flower key={i} position={p.position} color={p.color} />)
}

export default function Ground() {
  const meshRef = useRef()
  const waveTime = useRef(0)
  const ripples = useRef([])

  const geometry = useMemo(() => {
    const width = 24
    const depth = 24
    const seg = 80
    const geo = new THREE.PlaneGeometry(width, depth, seg, seg)
    geo.rotateX(-Math.PI / 2)

    const pos = geo.attributes.position
    const colorArr = new Float32Array(pos.count * 3)
    const grassBase = new THREE.Color('#6BBF4A')
    const grassLight = new THREE.Color('#8CD867')
    const grassDark = new THREE.Color('#4A8C2E')

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const dist = Math.sqrt(x * x + z * z)
      const t = Math.min(dist / 10, 1)
      const c = grassBase.clone().lerp(grassLight, Math.random() * 0.3)
      if (dist > 5) c.lerp(grassDark, (dist - 5) / 5 * 0.5)

      colorArr[i * 3] = c.r
      colorArr[i * 3 + 1] = c.g
      colorArr[i * 3 + 2] = c.b
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colorArr, 3))
    geo.computeVertexNormals()
    return geo
  }, [])

  const handleClick = (e) => {
    if (!e.point) return
    ripples.current.push({
      x: e.point.x,
      z: e.point.z,
      time: 0,
      strength: 0.1,
    })
  }

  useFrame((_, delta) => {
    if (!meshRef.current) return
    waveTime.current += delta
    const pos = meshRef.current.geometry.attributes.position

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      let y = 0

      y += Math.sin(x * 1.2 + waveTime.current * 0.6) * 0.02
      y += Math.sin(z * 1.8 + waveTime.current * 0.4) * 0.015
      y += Math.sin((x + z) * 1.0 + waveTime.current * 0.5) * 0.01

      for (const r of ripples.current) {
        const dx = x - r.x
        const dz = z - r.z
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist < r.time * 3 + 0.5) {
          const ripple = Math.sin(dist * 5 - r.time * 5) * r.strength * Math.max(0, 1 - r.time / 2.5)
          y += ripple * Math.max(0, 1 - dist / 4)
        }
      }

      pos.setY(i, y)
    }

    ripples.current = ripples.current.filter((r) => {
      r.time += delta
      return r.time < 2.5
    })

    pos.needsUpdate = true
    meshRef.current.geometry.computeVertexNormals()
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} receiveShadow onClick={handleClick}>
        <meshStandardMaterial vertexColors roughness={0.9} metalness={0} flatShading />
      </mesh>
      <Flowers />
    </group>
  )
}
