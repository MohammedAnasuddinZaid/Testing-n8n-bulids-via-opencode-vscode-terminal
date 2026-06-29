'use client'

import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const lerp = THREE.MathUtils.lerp

const VIEWS = [
  { position: [0, 2.5, 5], target: [0, 0.8, 0] },
  { position: [3, 1.5, 3], target: [0.5, 0.7, 0] },
  { position: [0, 0.8, 0.5], target: [0.5, 0.5, 0] },
  { position: [-3, 1.2, -2], target: [0, 0.3, 0] },
]

let scrollProgress = 0
const listeners = new Set()

export function setScrollProgress(value) {
  scrollProgress = Math.max(0, Math.min(1, value))
  listeners.forEach(fn => fn(scrollProgress))
}

export function onScrollChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getScrollProgress() {
  return scrollProgress
}

export default function CameraController() {
  const { camera } = useThree()
  const stateRef = useRef({
    currentView: 0,
    progress: 0,
    position: new THREE.Vector3(0, 2.5, 5),
    target: new THREE.Vector3(0, 0.8, 0),
  })

  useEffect(() => {
    const unsub = onScrollChange((progress) => {
      stateRef.current.progress = progress
    })
    return unsub
  }, [])

  useFrame(({ clock }, delta) => {
    const p = stateRef.current.progress
    const totalViews = VIEWS.length - 1
    const exactIndex = p * totalViews
    const idxA = Math.min(Math.floor(exactIndex), totalViews - 1)
    const idxB = idxA + 1
    const t = exactIndex - idxA

    const viewA = VIEWS[idxA]
    const viewB = VIEWS[idxB] || VIEWS[VIEWS.length - 1]

    const smooth = 1 - Math.pow(0.001, delta)
    const easeT = t * t * (3 - 2 * t)

    const px = lerp(viewA.position[0], viewB.position[0], easeT)
    const py = lerp(viewA.position[1], viewB.position[1], easeT)
    const pz = lerp(viewA.position[2], viewB.position[2], easeT)

    const tx = lerp(viewA.target[0], viewB.target[0], easeT)
    const ty = lerp(viewA.target[1], viewB.target[1], easeT)
    const tz = lerp(viewA.target[2], viewB.target[2], easeT)

    stateRef.current.position.lerp(new THREE.Vector3(px, py, pz), smooth)
    stateRef.current.target.lerp(new THREE.Vector3(tx, ty, tz), smooth)

    camera.position.copy(stateRef.current.position)
    camera.lookAt(stateRef.current.target)
  })

  return null
}
