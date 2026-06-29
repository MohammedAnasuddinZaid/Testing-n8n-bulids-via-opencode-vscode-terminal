'use client'

import dynamic from 'next/dynamic'
import Overlay from '@/components/Overlay'

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-amber-900 via-amber-800 to-emerald-900">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-amber-400/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-amber-400 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-transparent border-t-amber-300 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
        <p className="text-amber-200/70 text-sm font-medium tracking-wider">Loading Pawverse...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return (
    <>
      <Scene />
      <Overlay />
    </>
  )
}
