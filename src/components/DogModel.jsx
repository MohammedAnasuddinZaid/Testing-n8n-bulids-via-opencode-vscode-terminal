'use client'

import { useRef, useState, useMemo, createContext, useContext } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const lerp = THREE.MathUtils.lerp

export const DogContext = createContext({ bark: () => {} })
export const useDog = () => useContext(DogContext)

const EAR_COLOR = '#C4956A'
const BODY_COLOR = '#E8B88A'
const DARK_FUR = '#A67B5B'
const NOSE_COLOR = '#2C1810'
const EYE_COLOR = '#1A1A2E'
const COLLAR_COLOR = '#E63946'
const TONGUE_COLOR = '#FF6B6B'

function Body({ hovered }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (!ref.current) return
    const target = hovered ? 0.08 : -0.02
    ref.current.position.y = lerp(ref.current.position.y, target, delta * 2)
  })
  return (
    <group ref={ref}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.2, 0.7, 0.8]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.45, 0.5]} castShadow>
        <boxGeometry args={[0.4, 0.25, 0.3]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.8} />
      </mesh>
    </group>
  )
}

function Tail({ hovered }) {
  const ref = useRef()
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!ref.current) return
    timeRef.current += delta
    const speed = hovered ? 12 : 4
    const amplitude = hovered ? 0.8 : 0.3
    const targetRot = Math.sin(timeRef.current * speed) * amplitude
    ref.current.rotation.z = lerp(ref.current.rotation.z, targetRot, delta * 8)
  })

  return (
    <group ref={ref} position={[-0.65, 0.8, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color={DARK_FUR} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial color={DARK_FUR} roughness={0.9} />
      </mesh>
    </group>
  )
}

function Head({ dogRef, hovered, setHovered, onClick }) {
  const headRef = useRef()
  const targetRot = useRef({ x: 0, y: 0 })
  const { pointer } = useThree()
  const [mood, setMood] = useState('Happy')
  const moods = ['Happy', 'Playful', 'Curious', 'Silly']

  useFrame((_, delta) => {
    if (!headRef.current || !dogRef.current) return

    const maxAngle = 0.4
    const targetX = -pointer.y * maxAngle
    const targetY = pointer.x * maxAngle

    targetRot.current.x = lerp(targetRot.current.x, targetX, delta * 3)
    targetRot.current.y = lerp(targetRot.current.y, targetY, delta * 3)

    headRef.current.rotation.x = targetRot.current.x
    headRef.current.rotation.y = targetRot.current.y
  })

  const cycleMood = () => {
    setMood(prev => {
      const idx = moods.indexOf(prev)
      return moods[(idx + 1) % moods.length]
    })
  }

  return (
    <group
      ref={headRef}
      position={[0.55, 0.85, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false) }}
      onClick={(e) => { e.stopPropagation(); onClick(); cycleMood() }}
    >
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.55, 0.5, 0.5]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.05, 0.35]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.25]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.8} />
      </mesh>
      <mesh position={[0.2, 0.05, 0.52]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={NOSE_COLOR} roughness={0.6} />
      </mesh>
      <mesh position={[-0.12, 0.25, 0.42]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={EYE_COLOR} roughness={0.2} />
      </mesh>
      <mesh position={[0.12, 0.25, 0.42]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={EYE_COLOR} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.1, 0.48]} castShadow>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color={EYE_COLOR} />
      </mesh>
      <mesh position={[0.25, -0.1, 0.4]} castShadow>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color={TONGUE_COLOR} roughness={0.5} />
      </mesh>
      <mesh position={[-0.28, 0.35, 0]} rotation={[0, 0, -0.3]} castShadow>
        <coneGeometry args={[0.12, 0.25, 4]} />
        <meshStandardMaterial color={EAR_COLOR} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.28, 0.35, 0]} rotation={[0, 0, 0.3]} castShadow>
        <coneGeometry args={[0.12, 0.25, 4]} />
        <meshStandardMaterial color={EAR_COLOR} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      <Html position={[0, 0.6, 0]} center distanceFactor={10} occlude={false}>
        <div className="pointer-events-none select-none">
          <div className="bg-white/80 backdrop-blur-md rounded-full px-3 py-1 text-xs font-semibold text-amber-800 shadow-lg border border-white/40 whitespace-nowrap">
            Mood: {mood}
          </div>
        </div>
      </Html>
    </group>
  )
}

function Legs() {
  const positions = [
    [-0.4, 0.25, -0.3],
    [0.4, 0.25, -0.3],
    [-0.4, 0.25, 0.3],
    [0.4, 0.25, 0.3],
  ]
  return positions.map((pos, i) => (
    <mesh key={i} position={pos} castShadow>
      <cylinderGeometry args={[0.06, 0.08, 0.5, 6]} />
      <meshStandardMaterial color={BODY_COLOR} roughness={0.9} />
    </mesh>
  ))
}

function Collar() {
  return (
    <group position={[0.55, 0.55, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.28, 0.04, 6, 12]} />
        <meshStandardMaterial color={COLLAR_COLOR} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, -0.1, 0.25]}>
        <boxGeometry args={[0.06, 0.06, 0.04]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

export default function DogModel() {
  const dogRef = useRef()
  const [hovered, setHovered] = useState(false)
  const scaleRef = useRef(1)
  const shockwaveRef = useRef(null)
  const [shockwaveActive, setShockwaveActive] = useState(false)

  const bark = useMemo(() => () => {
    scaleRef.current = 1.4
    setShockwaveActive(true)
    setTimeout(() => setShockwaveActive(false), 800)
  }, [])

  useFrame((_, delta) => {
    if (!dogRef.current) return
    scaleRef.current = lerp(scaleRef.current, 1, delta * 6)
    const s = scaleRef.current
    dogRef.current.scale.set(s, s, s)
  })

  return (
    <DogContext.Provider value={{ bark }}>
      <group ref={dogRef} position={[0, 0, 0]}>
        <Legs />
        <Body hovered={hovered} />
        <Tail hovered={hovered} />
        <Collar />
        <Head dogRef={dogRef} hovered={hovered} setHovered={setHovered} onClick={bark} />
      </group>

      {shockwaveActive && (
        <mesh position={[0, 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.3, 32]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </DogContext.Provider>
  )
}
