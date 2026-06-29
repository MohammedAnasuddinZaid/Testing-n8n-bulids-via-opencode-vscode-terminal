'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { setScrollProgress, getScrollProgress } from './CameraController'
import { useDog } from './DogModel'

const SECTIONS = [
  { id: 'hero', label: 'Meet Pawverse', subtitle: 'A world built for dogs' },
  { id: 'closeup', label: 'The Details', subtitle: 'Every tail wag tells a story' },
  { id: 'toys', label: 'Play Time', subtitle: 'Click. Toss. Fetch.' },
  { id: 'join', label: 'Join the Pack', subtitle: 'Be part of the adventure' },
]

function NavDot({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-3 h-3 rounded-full transition-all duration-500 ${
        active
          ? 'bg-amber-400 scale-125 shadow-lg shadow-amber-400/50'
          : 'bg-white/30 hover:bg-white/50'
      }`}
      title={label}
    />
  )
}

function NavBar({ activeSection, onSectionClick }) {
  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {SECTIONS.map((section) => (
        <NavDot
          key={section.id}
          active={activeSection === section.id}
          onClick={() => onSectionClick(section.id)}
          label={section.label}
        />
      ))}
    </nav>
  )
}

function FloatingCard({ children, className = '' }) {
  return (
    <div
      className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl ${className}`}
    >
      {children}
    </div>
  )
}

export default function Overlay() {
  const containerRef = useRef(null)
  const [activeSection, setActiveSection] = useState('hero')
  const dogCtx = useDog()
  const isScrolling = useRef(false)

  const updateScroll = useCallback(() => {
    if (!containerRef.current || isScrolling.current) return
    const el = containerRef.current
    const scrollTop = el.scrollTop
    const maxScroll = el.scrollHeight - el.clientHeight
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0
    setScrollProgress(progress)

    const sectionIndex = Math.min(
      Math.floor(progress * SECTIONS.length),
      SECTIONS.length - 1
    )
    setActiveSection(SECTIONS[sectionIndex]?.id || 'hero')
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', updateScroll, { passive: true })
    return () => el.removeEventListener('scroll', updateScroll)
  }, [updateScroll])

  const scrollToSection = useCallback((id) => {
    const el = containerRef.current
    if (!el) return
    const idx = SECTIONS.findIndex(s => s.id === id)
    if (idx < 0) return
    const target = (idx / (SECTIONS.length - 1)) * (el.scrollHeight - el.clientHeight)
    const start = el.scrollTop
    const diff = target - start
    const duration = 800
    const startTime = performance.now()

    isScrolling.current = true

    function ease(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }

    function animate(now) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      el.scrollTop = start + diff * ease(t)
      updateScroll()
      if (t < 1) {
        requestAnimationFrame(animate)
      } else {
        isScrolling.current = false
      }
    }

    requestAnimationFrame(animate)
  }, [updateScroll])

  return (
    <>
      <NavBar activeSection={activeSection} onSectionClick={scrollToSection} />

      <div
        ref={containerRef}
        className="fixed inset-0 z-10 overflow-y-auto overflow-x-hidden"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="h-[500vh]">
          <div className="sticky top-0 h-screen flex items-center justify-center">
            <div
              className="w-full max-w-2xl mx-auto px-6 transition-all duration-700"
              style={{
                opacity: activeSection === 'hero' ? 1 : 0,
                transform: `translateY(${activeSection === 'hero' ? '0' : '-20px'})`,
              }}
            >
              <FloatingCard className="p-8 md:p-12 text-center">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
                  Pawverse
                </h1>
                <p className="text-lg md:text-xl text-white/70 mb-8 max-w-md mx-auto">
                  Where every dog has a story, every tail tells a tale, and every paw leaves a print on your heart.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => scrollToSection('toys')}
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-semibold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    Explore Toys
                  </button>
                  <button
                    onClick={() => dogCtx?.bark()}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Say Woof!
                  </button>
                </div>
              </FloatingCard>
            </div>
          </div>

          <div className="sticky top-0 h-screen flex items-center justify-center">
            <div
              className="w-full max-w-2xl mx-auto px-6 transition-all duration-700"
              style={{
                opacity: activeSection === 'closeup' ? 1 : 0,
                transform: `translateY(${activeSection === 'closeup' ? '0' : '20px'})`,
              }}
            >
              <FloatingCard className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-400/30 flex items-center justify-center text-amber-400 text-sm">
                    ?
                  </div>
                  <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">
                    Did You Know?
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Dogs understand up to <span className="text-amber-400">250 words</span> and gestures
                </h2>
                <p className="text-white/60 leading-relaxed">
                  Their incredible intelligence and emotional depth make them the perfect companions.
                  Every tilt of the head, every wag of the tail — it's their way of talking to us.
                </p>
              </FloatingCard>
            </div>
          </div>

          <div className="sticky top-0 h-screen flex items-center justify-center">
            <div
              className="w-full max-w-2xl mx-auto px-6 transition-all duration-700"
              style={{
                opacity: activeSection === 'toys' ? 1 : 0,
                transform: `translateY(${activeSection === 'toys' ? '0' : '20px'})`,
              }}
            >
              <FloatingCard className="p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Play with Physics
                </h2>
                <p className="text-white/60 mb-6 leading-relaxed">
                  Click on the tennis ball, bone, or chew toy scattered around the park.
                  Watch them bounce, roll, and tumble with realistic physics.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Tennis Ball', color: 'bg-lime-400/20 text-lime-300 border-lime-400/30' },
                    { label: 'Bone', color: 'bg-stone-400/20 text-stone-200 border-stone-400/30' },
                    { label: 'Chew Toy', color: 'bg-red-400/20 text-red-300 border-red-400/30' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`px-3 py-2 rounded-lg border text-center text-xs font-medium ${item.color}`}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </FloatingCard>
            </div>
          </div>

          <div className="sticky top-0 h-screen flex items-center justify-center">
            <div
              className="w-full max-w-2xl mx-auto px-6 transition-all duration-700"
              style={{
                opacity: activeSection === 'join' ? 1 : 0,
                transform: `translateY(${activeSection === 'join' ? '0' : '20px'})`,
              }}
            >
              <FloatingCard className="p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Join?
                </h2>
                <p className="text-white/60 mb-8 max-w-sm mx-auto leading-relaxed">
                  The Pawverse is growing. Follow along for updates, cute dog content, and early access.
                </p>
                <div className="flex gap-3 justify-center">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-amber-400/50 transition-colors w-56"
                  />
                  <button className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-semibold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg text-sm">
                    Subscribe
                  </button>
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
