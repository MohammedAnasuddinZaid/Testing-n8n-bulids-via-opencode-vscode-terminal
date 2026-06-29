'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

export default function FloatingText3D() {
  const groupRef = useRef()
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    timeRef.current += delta
    groupRef.current.position.y = 1.6 + Math.sin(timeRef.current * 0.4) * 0.15
    groupRef.current.rotation.y = Math.sin(timeRef.current * 0.15) * 0.1
  })

  return (
    <group ref={groupRef} position={[0.2, 1.6, 0]} scale={1}>
      <Text
        position={[0, 0, 0]}
        fontSize={0.35}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff"
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
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff"
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        opacity={0.6}
      >
        Where every paw leaves a print
      </Text>
    </group>
  )
}
