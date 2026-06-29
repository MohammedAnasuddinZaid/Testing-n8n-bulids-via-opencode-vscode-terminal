'use client'

import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSphere, useBox } from '@react-three/cannon'
import * as THREE from 'three'

function TennisBall({ position = [2, 1.5, -1] }) {
  const [ref, api] = useSphere(() => ({
    mass: 0.3,
    position,
    args: [0.15],
    material: { restitution: 0.7, friction: 0.3 },
  }))
  const [hovered, setHovered] = useState(false)
  const [grabbed, setGrabbed] = useState(false)
  const mouseConstraint = useRef(null)

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    const dx = (Math.random() - 0.5) * 3
    const dz = (Math.random() - 0.5) * 3
    api.velocity.set(dx, 4 + Math.random() * 2, dz)
    api.angularVelocity.set(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5
    )
  }, [api])

  return (
    <mesh
      ref={ref}
      castShadow
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color={hovered ? '#F5E642' : '#D4E157'}
        roughness={0.4}
        metalness={0.1}
        emissive={hovered ? '#F5E642' : '#000000'}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
    </mesh>
  )
}

function Bone({ position = [-1.5, 1.5, 1.5] }) {
  const [ref, api] = useBox(() => ({
    mass: 0.5,
    position,
    args: [0.4, 0.08, 0.12],
    material: { restitution: 0.3, friction: 0.5 },
  }))
  const [hovered, setHovered] = useState(false)

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    api.velocity.set((Math.random() - 0.5) * 2, 3 + Math.random() * 2, (Math.random() - 0.5) * 2)
  }, [api])

  return (
    <group>
      <mesh
        ref={ref}
        castShadow
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <boxGeometry args={[0.4, 0.08, 0.12]} />
        <meshStandardMaterial
          color={hovered ? '#FFF8E7' : '#F5F0E1'}
          roughness={0.6}
          metalness={0.1}
          emissive={hovered ? '#FFF8E7' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
      <mesh position={[-0.25, 0, 0]} castShadow>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#F5F0E1" roughness={0.6} />
      </mesh>
      <mesh position={[0.25, 0, 0]} castShadow>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#F5F0E1" roughness={0.6} />
      </mesh>
    </group>
  )
}

function ChewToy({ position = [0.5, 0.8, -1.8] }) {
  const [ref, api] = useBox(() => ({
    mass: 0.4,
    position,
    args: [0.2, 0.1, 0.2],
    material: { restitution: 0.5, friction: 0.4 },
  }))
  const [hovered, setHovered] = useState(false)

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    api.velocity.set((Math.random() - 0.5) * 3, 3 + Math.random() * 3, (Math.random() - 0.5) * 3)
  }, [api])

  return (
    <group>
      <mesh
        ref={ref}
        castShadow
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <boxGeometry args={[0.2, 0.1, 0.2]} />
        <meshStandardMaterial
          color={hovered ? '#FF8A80' : '#E53935'}
          roughness={0.3}
          metalness={0.1}
          emissive={hovered ? '#FF8A80' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      <mesh position={[0, 0.12, 0]} castShadow>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#E53935" roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.12, 0]} castShadow>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#E53935" roughness={0.3} />
      </mesh>
    </group>
  )
}

export default function InteractiveToys() {
  return (
    <group>
      <TennisBall />
      <Bone />
      <ChewToy />
    </group>
  )
}
