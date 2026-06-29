'use client'

import { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

function TextContent() {
  const ref = useRef()
  const t = useRef(0)

  useFrame((_, delta) => {
    if (!ref.current) return
    t.current += delta
    ref.current.position.y = 1.6 + Math.sin(t.current * 0.4) * 0.15
    ref.current.rotation.y = Math.sin(t.current * 0.15) * 0.1
  })

  return (
    <group ref={ref} position={[0.2, 1.6, 0]}>
      <Text
        position={[0, 0, 0]}
        fontSize={0.35}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#B8860B"
        letterSpacing={0.08}
      >
        PAWVERSE
      </Text>
      <Text
        position={[0, -0.35, 0]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        opacity={0.6}
      >
        Where every paw leaves a print
      </Text>
    </group>
  )
}

export default function FloatingText3D() {
  return (
    <Suspense fallback={null}>
      <TextContent />
    </Suspense>
  )
}
