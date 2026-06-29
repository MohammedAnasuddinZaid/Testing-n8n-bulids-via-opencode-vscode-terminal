'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { onBark, onDogState, setDogState, getDogState } from '@/lib/store'

const lerp = THREE.MathUtils.lerp
const CLR_BODY = '#D4A373'
const CLR_BODY_DARK = '#B8845A'
const CLR_EAR = '#B8845A'
const CLR_NOSE = '#2C1810'
const CLR_EYE = '#1A1A2E'
const CLR_COLLAR = '#E63946'
const CLR_TONGUE = '#FF6B6B'
const CLR_BELLY = '#F5E6D0'

function Leg({ position, isFront }) {
  const ref = useRef()
  const legPhase = useRef(Math.random() * Math.PI * 2)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const state = getDogState()
    if (state === 'happy') {
      const t = clock.getElapsedTime() * 3
      ref.current.rotation.x = Math.sin(t + legPhase.current) * 0.15
    } else {
      ref.current.rotation.x = lerp(ref.current.rotation.x, 0, 0.05)
    }
  })
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 0.4, 6]} />
        <meshStandardMaterial color={CLR_BODY} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.38, 0.02]} castShadow>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color={CLR_BODY_DARK} roughness={0.9} />
      </mesh>
    </group>
  )
}

function Tail({ isHappy }) {
  const ref = useRef()
  const time = useRef(0)

  useFrame((_, delta) => {
    if (!ref.current) return
    time.current += delta
    const speed = isHappy ? 14 : 4
    const amp = isHappy ? 1.0 : 0.3
    ref.current.rotation.z = Math.sin(time.current * speed) * amp
  })

  return (
    <group ref={ref} position={[-0.55, 0.7, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.06, 0.45, 0.06]} />
        <meshStandardMaterial color={CLR_BODY_DARK} roughness={0.9} />
      </mesh>
      <mesh position={[0.02, 0.5, 0]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color={CLR_BODY_DARK} roughness={0.9} />
      </mesh>
    </group>
  )
}

function Head({ setParentHovered, onBarkClick }) {
  const ref = useRef()
  const targetRot = useRef({ x: 0, y: 0 })
  const { pointer } = useThree()
  const [mood, setMood] = useState('Happy')
  const moods = ['Happy', 'Playful', 'Curious', 'Sleepy']
  const blinkRef = useRef(0)
  const eyeLRef = useRef()
  const eyeRRef = useRef()

  useFrame((_, delta) => {
    if (!ref.current) return
    const maxAngle = 0.35
    targetRot.current.x = lerp(targetRot.current.x, -pointer.y * maxAngle, delta * 3)
    targetRot.current.y = lerp(targetRot.current.y, pointer.x * maxAngle, delta * 3)
    ref.current.rotation.x = targetRot.current.x
    ref.current.rotation.y = targetRot.current.y
    blinkRef.current += delta
    if (eyeLRef.current && eyeRRef.current) {
      const isBlinking = blinkRef.current % 4 < 0.1
      eyeLRef.current.scale.y = isBlinking ? 0.1 : 1
      eyeRRef.current.scale.y = isBlinking ? 0.1 : 1
    }
  })

  const cycleMood = () => {
    setMood((prev) => {
      const idx = moods.indexOf(prev)
      const next = moods[(idx + 1) % moods.length]
      setDogState(next.toLowerCase())
      return next
    })
  }

  return (
    <group
      ref={ref}
      position={[0.5, 0.75, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setParentHovered(true) }}
      onPointerOut={(e) => { e.stopPropagation(); setParentHovered(false) }}
      onClick={(e) => { e.stopPropagation(); onBarkClick(); cycleMood() }}
    >
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.5, 0.45, 0.45]} />
        <meshStandardMaterial color={CLR_BODY} roughness={0.8} />
      </mesh>
      <mesh position={[0.08, 0.02, 0.25]}>
        <boxGeometry args={[0.25, 0.18, 0.2]} />
        <meshStandardMaterial color={CLR_BELLY} roughness={0.8} />
      </mesh>
      <mesh position={[0.12, 0.04, 0.4]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={CLR_NOSE} roughness={0.6} />
      </mesh>
      <group ref={eyeLRef} position={[-0.1, 0.22, 0.38]}>
        <mesh>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={CLR_EYE} roughness={0.2} />
        </mesh>
        <mesh position={[0.02, 0.02, 0.04]}>
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
      <group ref={eyeRRef} position={[0.12, 0.22, 0.38]}>
        <mesh>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={CLR_EYE} roughness={0.2} />
        </mesh>
        <mesh position={[0.02, 0.02, 0.04]}>
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
      <mesh position={[0.18, -0.05, 0.3]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color={CLR_TONGUE} roughness={0.5} />
      </mesh>
      <mesh position={[-0.24, 0.32, 0]} rotation={[0, 0, -0.3]} castShadow>
        <coneGeometry args={[0.1, 0.22, 4]} />
        <meshStandardMaterial color={CLR_EAR} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.24, 0.32, 0]} rotation={[0, 0, 0.3]} castShadow>
        <coneGeometry args={[0.1, 0.22, 4]} />
        <meshStandardMaterial color={CLR_EAR} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.35]}>
        <boxGeometry args={[0.08, 0.04, 0.12]} />
        <meshStandardMaterial color="#FFB5B5" roughness={0.5} transparent opacity={0.4} />
      </mesh>
      <Html position={[0, 0.5, 0]} center distanceFactor={10} occlude={false}>
        <div className="pointer-events-none select-none">
          <div className="bg-white/80 backdrop-blur-md rounded-full px-3 py-1 text-xs font-semibold text-amber-800 shadow-lg border border-white/40 whitespace-nowrap">
            Mood: {mood}
          </div>
        </div>
      </Html>
    </group>
  )
}

export default function DogModel() {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [isHappy, setIsHappy] = useState(false)
  const scaleRef = useRef(1)
  const shockRingRef = useRef()
  const shockTime = useRef(0)
  const [showShock, setShowShock] = useState(false)

  const bark = useCallback(() => {
    scaleRef.current = 1.5
    setShowShock(true)
    shockTime.current = 0
    setIsHappy(true)
    setDogState('happy')
    setTimeout(() => {
      setIsHappy(false)
      setDogState('idle')
    }, 2000)
  }, [])

  useEffect(() => {
    const unsub = onBark(() => bark())
    const unsub2 = onDogState((state) => {
      if (state === 'happy') { setIsHappy(true); scaleRef.current = 1.2 }
      else setIsHappy(false)
    })
    return () => { unsub(); unsub2() }
  }, [bark])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    scaleRef.current = lerp(scaleRef.current, 1, delta * 5)
    const s = scaleRef.current
    groupRef.current.scale.set(s, s, s)

    if (showShock) {
      shockTime.current += delta
      if (shockRingRef.current) {
        const progress = shockTime.current / 1.2
        const r = 0.05 + progress * 2
        shockRingRef.current.scale.set(r, r, r)
        shockRingRef.current.material.opacity = Math.max(0, 1 - progress)
      }
      if (shockTime.current > 1.2) setShowShock(false)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.0, 0.55, 0.6]} />
        <meshStandardMaterial color={CLR_BODY} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.35, 0.1]}>
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <meshStandardMaterial color={CLR_BELLY} roughness={0.8} />
      </mesh>
      <Leg position={[-0.32, 0.2, -0.25]} isFront={false} />
      <Leg position={[0.32, 0.2, -0.25]} isFront={false} />
      <Leg position={[-0.32, 0.2, 0.25]} isFront={true} />
      <Leg position={[0.32, 0.2, 0.25]} isFront={true} />
      <Tail isHappy={isHappy} />
      <Head setParentHovered={setHovered} onBarkClick={bark} />
      <group position={[0.5, 0.45, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.24, 0.035, 6, 12]} />
          <meshStandardMaterial color={CLR_COLLAR} roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.08, 0.2]}>
          <boxGeometry args={[0.05, 0.05, 0.035]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {showShock && (
        <mesh ref={shockRingRef} position={[0, 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 48]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
      {showShock && (
        <mesh position={[0, 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.1, 0.2, 32]} />
          <meshBasicMaterial color="#FFE066" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}
