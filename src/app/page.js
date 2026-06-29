'use client'

import dynamic from 'next/dynamic'
import Overlay from '@/components/Overlay'

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 flex items-center justify-center bg-gradient-to-b from-amber-900 via-amber-800 to-emerald-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60 text-sm">Loading Pawverse...</p>
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
