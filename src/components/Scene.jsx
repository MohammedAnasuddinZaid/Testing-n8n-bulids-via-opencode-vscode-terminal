'use client'

import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { ContactShadows, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { Suspense, Component } from 'react'

import DogModel from './DogModel'
import Ground from './Ground'
import Particles from './Particles'
import InteractiveToys from './InteractiveToys'
import CameraController from './CameraController'
import Environment3D from './Environment'
import FloatingText3D from './FloatingText3D'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error) {
    console.warn('[3D] Scene error bound:', error.message)
  }
  render() {
    return this.state.hasError ? null : this.props.children
  }
}

function Effects() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.6} />
      <ChromaticAberration offset={[0.0015, 0.0015]} />
      <Vignette eskil={false} offset={0.3} darkness={0.4} />
    </EffectComposer>
  )
}

function SceneContent() {
  return (
    <ErrorBoundary>
      <CameraController />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#87CEEB', '#90EE90']} intensity={0.5} />
      <directionalLight
        position={[6, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={25}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.001}
      />
      <directionalLight position={[-4, 5, -3]} intensity={0.3} color="#FFD700" />

      <Suspense fallback={null}>
        <Environment preset="sunset" />
      </Suspense>

      <Ground />
      <Particles count={400} />
      <Environment3D />
      <Suspense fallback={null}>
        <FloatingText3D />
      </Suspense>

      <Physics gravity={[0, -9.81, 0]} defaultContactMaterial={{ restitution: 0.5, friction: 0.4 }}>
        <InteractiveToys />
      </Physics>

      <DogModel />

      <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={14} blur={2.5} far={4} />

      <Suspense fallback={null}>
        <Effects />
      </Suspense>
    </ErrorBoundary>
  )
}

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      camera={{ position: [0, 2.8, 5.5], fov: 45, near: 0.1, far: 50 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}
      onCreated={({ gl }) => {
        gl.setClearColor('#1a1a2e')
      }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}
