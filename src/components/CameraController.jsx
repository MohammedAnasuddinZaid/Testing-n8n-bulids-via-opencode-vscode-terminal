'use client'

import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { onScroll, getScrollProgress, onBark } from '@/lib/store'

const lerp = THREE.MathUtils.lerp

const VIEWS = [
  { position: [0, 2.8, 5.5], target: [0, 0.8, 0] },
  { position: [2.8, 1.8, 3.5], target: [0.4, 0.7, 0] },
  { position: [0, 0.6, 0.8], target: [0.4, 0.5, 0] },
  { position: [-3.5, 2.0, -2.5], target: [0, 0.3, 0] },
]

export default function CameraController() {
  const { camera } = useThree()
  const state = useRef({
    progress: 0,
    position: new THREE.Vector3(...VIEWS[0].position),
    target: new THREE.Vector3(...VIEWS[0].target),
  })
  const shakeRef = useRef(0)

  useEffect(() => {
    const unsub = onScroll((p) => { state.current.progress = p })
    const unsubBark = onBark(() => { shakeRef.current = 0.3 })
    return () => { unsub(); unsubBark() }
  }, [])

  useFrame((_, delta) => {
    const p = state.current.progress
    const totalViews = VIEWS.length - 1
    const exactIndex = p * totalViews
    const idxA = Math.min(Math.floor(exactIndex), totalViews - 1)
    const idxB = idxA + 1
    const t = exactIndex - idxA

    const viewA = VIEWS[idxA]
    const viewB = VIEWS[idxB] || VIEWS[VIEWS.length - 1]
    const easeT = t * t * (3 - 2 * t)
    const smooth = Math.min(1, delta * 4)

    const px = lerp(viewA.position[0], viewB.position[0], easeT)
    const py = lerp(viewA.position[1], viewB.position[1], easeT)
    const pz = lerp(viewA.position[2], viewB.position[2], easeT)
    const tx = lerp(viewA.target[0], viewB.target[0], easeT)
    const ty = lerp(viewA.target[1], viewB.target[1], easeT)
    const tz = lerp(viewA.target[2], viewB.target[2], easeT)

    state.current.position.lerp(new THREE.Vector3(px, py, pz), smooth)
    state.current.target.lerp(new THREE.Vector3(tx, ty, tz), smooth)

    camera.position.copy(state.current.position)
    camera.lookAt(state.current.target)

    if (shakeRef.current > 0) {
      shakeRef.current = Math.max(0, shakeRef.current - delta)
      const intensity = shakeRef.current * 0.06
      camera.position.x += (Math.random() - 0.5) * intensity
      camera.position.y += (Math.random() - 0.5) * intensity
    }
  })

  return null
}
