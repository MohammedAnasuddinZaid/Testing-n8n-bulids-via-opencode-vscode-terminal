'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Tree({ position, scale = 1 }) {
  const groupRef = useRef()
  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.1, 1.2, 5]} />
        <meshStandardMaterial color="#5C3D2E" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <coneGeometry args={[0.5, 0.6, 6]} />
        <meshStandardMaterial color="#2D7D3A" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <coneGeometry args={[0.35, 0.4, 6]} />
        <meshStandardMaterial color="#3A9D4A" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <coneGeometry args={[0.2, 0.3, 6]} />
        <meshStandardMaterial color="#4AB85C" roughness={0.8} />
      </mesh>
    </group>
  )
}

function FencePost({ position }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[0.04, 0.3, 0.04]} />
      <meshStandardMaterial color="#8B7355" roughness={0.9} />
    </mesh>
  )
}

function FenceRail({ start, end }) {
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
  const dx = end.x - start.x
  const dz = end.z - start.z
  const length = Math.sqrt(dx * dx + dz * dz)
  const angle = Math.atan2(dx, dz)
  return (
    <mesh position={[mid.x, 0.15, mid.z]} rotation={[0, angle, 0]} castShadow>
      <boxGeometry args={[0.03, 0.03, length]} />
      <meshStandardMaterial color="#8B7355" roughness={0.9} />
    </mesh>
  )
}

function Fence() {
  const posts = useMemo(() => {
    const arr = []
    const radius = 5.5
    const count = 24
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      arr.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    return arr
  }, [])

  return (
    <group>
      {posts.map((p, i) => (
        <FencePost key={i} position={[p.x, 0.15, p.z]} />
      ))}
      {posts.map((p, i) => {
        const next = posts[(i + 1) % posts.length]
        return <FenceRail key={`r${i}`} start={p} end={next} />
      })}
      {posts.map((p, i) => {
        const next = posts[(i + 1) % posts.length]
        const mid = new THREE.Vector3().addVectors(p, next).multiplyScalar(0.5)
        return <FenceRail key={`r2${i}`} start={new THREE.Vector3(mid.x, 0.05, mid.z)} end={new THREE.Vector3(mid.x, 0.25, mid.z)} />
      })}
    </group>
  )
}

function Bush({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.2, 6, 6]} />
        <meshStandardMaterial color="#3A8A4A" roughness={0.9} />
      </mesh>
      <mesh position={[0.15, 0.1, 0.1]} castShadow>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshStandardMaterial color="#4AA85C" roughness={0.9} />
      </mesh>
      <mesh position={[-0.1, 0.12, -0.1]} castShadow>
        <sphereGeometry args={[0.12, 6, 6]} />
        <meshStandardMaterial color="#3A9A4A" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Firefly({ position }) {
  const ref = useRef()
  const speed = 0.5 + Math.random() * 1.5
  const phase = Math.random() * Math.PI * 2

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed + phase
    const glow = Math.sin(t) * 0.5 + 0.5
    ref.current.position.y = position[1] + Math.sin(t * 0.7) * 0.3
    ref.current.material.opacity = glow * 0.8
    ref.current.scale.setScalar(0.5 + glow * 0.5)
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.03, 6, 6]} />
      <meshBasicMaterial color="#FFE066" transparent opacity={0.5} />
    </mesh>
  )
}

function Fireflies() {
  const positions = useMemo(() => {
    const arr = []
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1 + Math.random() * 4
      arr.push([Math.cos(angle) * radius, 0.3 + Math.random() * 1.5, Math.sin(angle) * radius])
    }
    return arr
  }, [])

  return positions.map((p, i) => <Firefly key={i} position={p} />)
}

export default function Environment() {
  const trees = useMemo(() => {
    const arr = []
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.3
      const radius = 3.8 + Math.random() * 1.2
      arr.push({
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        scale: 0.6 + Math.random() * 0.6,
      })
    }
    return arr
  }, [])

  const bushes = useMemo(() => {
    const arr = []
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1.5 + Math.random() * 3.5
      arr.push({
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        scale: 0.5 + Math.random() * 0.7,
      })
    }
    return arr
  }, [])

  return (
    <group>
      <Fence />
      {trees.map((t, i) => (
        <Tree key={i} position={t.position} scale={t.scale} />
      ))}
      {bushes.map((b, i) => (
        <Bush key={i} position={b.position} scale={b.scale} />
      ))}
      <Fireflies />
    </group>
  )
}
