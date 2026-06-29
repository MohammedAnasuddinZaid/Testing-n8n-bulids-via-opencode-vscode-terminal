'use client'

import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSphere, useBox } from '@react-three/cannon'
import * as THREE from 'three'

function GlowRing({ position, color = '#FFD700' }) {
  const ref = useRef()
  const time = useRef(0)

  useFrame((_, delta) => {
    if (!ref.current) return
    time.current += delta
    ref.current.rotation.x = Math.sin(time.current * 0.5) * 0.2
    ref.current.rotation.z = Math.cos(time.current * 0.3) * 0.2
  })

  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.12, 0.14, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  )
}

function TennisBall({ position }) {
  const [ref, api] = useSphere(() => ({
    mass: 0.3, position, args: [0.15],
    material: { restitution: 0.7, friction: 0.3 },
  }))
  const [hovered, setHovered] = useState(false)

  const launch = useCallback((e) => {
    e.stopPropagation()
    const dx = (Math.random() - 0.5) * 4
    const dz = (Math.random() - 0.5) * 4
    api.velocity.set(dx, 3 + Math.random() * 3, dz)
    api.angularVelocity.set(
      (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8
    )
  }, [api])

  return (
    <group>
      <mesh
        ref={ref} castShadow
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
        onClick={launch}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? '#F5E642' : '#D4E157'}
          roughness={0.4} metalness={0.1}
          emissive={hovered ? '#F5E642' : '#D4E157'}
          emissiveIntensity={hovered ? 0.4 : 0.1}
        />
      </mesh>
      <GlowRing position={position} color="#D4E157" />
    </group>
  )
}

function Bone({ position }) {
  const [ref, api] = useBox(() => ({
    mass: 0.5, position, args: [0.35, 0.06, 0.1],
    material: { restitution: 0.3, friction: 0.5 },
  }))
  const [hovered, setHovered] = useState(false)

  const launch = useCallback((e) => {
    e.stopPropagation()
    api.velocity.set((Math.random() - 0.5) * 3, 2 + Math.random() * 3, (Math.random() - 0.5) * 3)
    api.angularVelocity.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, 0)
  }, [api])

  return (
    <group>
      <mesh
        ref={ref} castShadow
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
        onClick={launch}
      >
        <boxGeometry args={[0.35, 0.06, 0.1]} />
        <meshStandardMaterial
          color={hovered ? '#FFF8E7' : '#F5F0E1'}
          roughness={0.6} metalness={0.1}
          emissive={hovered ? '#FFF8E7' : '#F5F0E1'}
          emissiveIntensity={hovered ? 0.3 : 0.05}
        />
      </mesh>
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#F5F0E1" roughness={0.6} />
        </mesh>
      ))}
      <GlowRing position={position} color="#F5F0E1" />
    </group>
  )
}

function ChewToy({ position }) {
  const [ref, api] = useBox(() => ({
    mass: 0.4, position, args: [0.18, 0.08, 0.18],
    material: { restitution: 0.5, friction: 0.4 },
  }))
  const [hovered, setHovered] = useState(false)

  const launch = useCallback((e) => {
    e.stopPropagation()
    api.velocity.set((Math.random() - 0.5) * 4, 2.5 + Math.random() * 3.5, (Math.random() - 0.5) * 4)
    api.angularVelocity.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6)
  }, [api])

  return (
    <group>
      <mesh
        ref={ref} castShadow
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
        onClick={launch}
      >
        <boxGeometry args={[0.18, 0.08, 0.18]} />
        <meshStandardMaterial
          color={hovered ? '#FF8A80' : '#E53935'}
          roughness={0.3} metalness={0.1}
          emissive={hovered ? '#FF8A80' : '#E53935'}
          emissiveIntensity={hovered ? 0.4 : 0.1}
        />
      </mesh>
      {[[0, 0.08, 0], [0, -0.08, 0]].map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#E53935" roughness={0.3} />
        </mesh>
      ))}
      <GlowRing position={position} color="#E53935" />
    </group>
  )
}

export default function InteractiveToys() {
  const positions = [
    [2.0, 1.2, -1.0],
    [-1.8, 0.8, 1.8],
    [0.8, 0.6, -2.2],
  ]

  return (
    <group>
      <TennisBall position={positions[0]} />
      <Bone position={positions[1]} />
      <ChewToy position={positions[2]} />
    </group>
  )
}
