'use client'

import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { ContactShadows, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'

import DogModel from './DogModel'
import Ground from './Ground'
import Particles from './Particles'
import InteractiveToys from './InteractiveToys'
import CameraController from './CameraController'

function SceneContent() {
  return (
    <>
      <CameraController />

      <ambientLight intensity={0.4} />
      <hemisphereLight
        args={['#87CEEB', '#90EE90', 0.6]}
        intensity={0.6}
      />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.001}
      />
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.3}
        color="#FFD700"
      />

      <Suspense fallback={null}>
        <Environment preset="sunset" />
      </Suspense>

      <Ground />
      <Particles count={300} />

      <Physics
        gravity={[0, -9.81, 0]}
        defaultContactMaterial={{
          restitution: 0.5,
          friction: 0.4,
        }}
      >
        <InteractiveToys />
      </Physics>

      <DogModel />

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.5}
        scale={12}
        blur={2}
        far={4}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial transparent opacity={0.15} />
      </mesh>
    </>
  )
}

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      camera={{
        position: [0, 2.5, 5],
        fov: 45,
        near: 0.1,
        far: 50,
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
    >
      <SceneContent />
    </Canvas>
  )
}
