'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { setScrollProgress, setActiveSection, triggerBark, getScrollProgress, getActiveSection } from '@/lib/store'

const SECTIONS = [
  { id: 'hero', label: 'Hero', subtitle: 'A world built for dogs' },
  { id: 'details', label: 'Details', subtitle: 'Every tail wag tells a story' },
  { id: 'toys', label: 'Toys', subtitle: 'Click. Toss. Fetch.' },
  { id: 'join', label: 'Join', subtitle: 'Be part of the adventure' },
]

function NavDot({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-[10px] h-[10px] rounded-full transition-all duration-500 ${
        active
          ? 'bg-amber-400 scale-125 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
          : 'bg-white/30 hover:bg-white/50'
      }`}
      aria-label={label}
    />
  )
}

function NavBar({ activeSection, onSectionClick }) {
  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {SECTIONS.map((s) => (
        <NavDot key={s.id} active={activeSection === s.id} onClick={() => onSectionClick(s.id)} label={s.label} />
      ))}
    </nav>
  )
}

function GlassCard({ children, className = '' }) {
  return (
    <div className={`backdrop-blur-2xl bg-white/[0.08] border border-white/[0.15] rounded-3xl shadow-2xl shadow-black/20 ${className}`}>
      {children}
    </div>
  )
}

function SectionHero({ visible }) {
  return (
    <div
      className="w-full max-w-xl mx-auto px-4 transition-all duration-1000"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? 0 : '30px'}) scale(${visible ? 1 : 0.95})`,
      }}
    >
      <GlassCard className="p-10 md:p-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Interactive 3D Experience
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-3 tracking-tight">
          Pawverse
        </h1>
        <p className="text-base md:text-lg text-white/60 mb-8 max-w-sm mx-auto leading-relaxed">
          Where every dog has a story, every tail tells a tale, and every paw leaves a print on your heart.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              const el = document.querySelector('[data-scroll-container]')
              if (!el) return
              const target = (1 / (SECTIONS.length - 1)) * (el.scrollHeight - el.clientHeight)
              smoothScrollTo(el, target)
            }}
            className="group px-7 py-3.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-amber-400/30"
          >
            Explore
            <span className="inline-block ml-1.5 group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <button
            onClick={() => triggerBark()}
            className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Say Woof! 🐕
          </button>
        </div>
      </GlassCard>
    </div>
  )
}

function SectionDetails({ visible }) {
  return (
    <div
      className="w-full max-w-xl mx-auto px-4 transition-all duration-1000"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? 0 : '30px'}) scale(${visible ? 1 : 0.95})`,
      }}
    >
      <GlassCard className="p-10 md:p-14">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 text-sm font-bold">?</div>
          <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">Did You Know?</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          Dogs understand up to <span className="text-amber-400">250 words</span> and gestures
        </h2>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          Their intelligence and emotional depth make them the perfect companions. Every head tilt,
          every tail wag is their way of talking to us.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: '250+ words', desc: 'Vocabulary' },
            { label: '~17 hrs', desc: 'Daily sleep' },
            { label: '1-2 yrs', desc: 'Training age' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-amber-400 text-lg font-bold">{stat.label}</div>
              <div className="text-white/40 text-xs">{stat.desc}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

function SectionToys({ visible }) {
  return (
    <div
      className="w-full max-w-xl mx-auto px-4 transition-all duration-1000"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? 0 : '30px'}) scale(${visible ? 1 : 0.95})`,
      }}
    >
      <GlassCard className="p-10 md:p-14">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
          Play with Physics
        </h2>
        <p className="text-white/50 text-sm mb-6 leading-relaxed">
          Click on the toys scattered around the park. Watch them bounce, roll, and tumble with
          realistic physics — then click again to send them flying!
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Tennis Ball', emoji: '🎾', color: 'from-lime-500/20 to-lime-400/5 text-lime-300 border-lime-500/30' },
            { label: 'Bone', emoji: '🦴', color: 'from-stone-500/20 to-stone-400/5 text-stone-200 border-stone-500/30' },
            { label: 'Chew Toy', emoji: '🧸', color: 'from-red-500/20 to-red-400/5 text-red-300 border-red-500/30' },
          ].map((item) => (
            <div
              key={item.label}
              className={`px-3 py-4 rounded-xl border text-center bg-gradient-to-b ${item.color}`}
            >
              <div className="text-lg mb-1">{item.emoji}</div>
              <div className="text-xs font-semibold">{item.label}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

function SectionJoin({ visible }) {
  return (
    <div
      className="w-full max-w-xl mx-auto px-4 transition-all duration-1000"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? 0 : '30px'}) scale(${visible ? 1 : 0.95})`,
      }}
    >
      <GlassCard className="p-10 md:p-14 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
          Join the Pack
        </h2>
        <p className="text-white/50 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
          The Pawverse is growing. Get early access, cute dog content, and updates straight to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            placeholder="your@email.com"
            className="px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400/50 transition-colors w-full sm:w-56"
          />
          <button className="px-7 py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-amber-400/30 text-sm">
            Subscribe
          </button>
        </div>
        <div className="flex justify-center gap-6 mt-8 text-white/30 text-xs">
          <span className="hover:text-white/60 cursor-pointer transition-colors">Twitter</span>
          <span className="hover:text-white/60 cursor-pointer transition-colors">Instagram</span>
          <span className="hover:text-white/60 cursor-pointer transition-colors">Discord</span>
        </div>
      </GlassCard>
    </div>
  )
}

function smoothScrollTo(el, target) {
  const start = el.scrollTop
  const diff = target - start
  const duration = 900
  const startTime = performance.now()

  function ease(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  function animate(now) {
    const elapsed = now - startTime
    const t = Math.min(elapsed / duration, 1)
    el.scrollTop = start + diff * ease(t)
    if (t < 1) requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

const SECTION_COMPONENTS = {
  hero: SectionHero,
  details: SectionDetails,
  toys: SectionToys,
  join: SectionJoin,
}

export default function Overlay() {
  const containerRef = useRef(null)
  const [activeSection, setActive] = useState('hero')
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsInitialLoad(false), 100)
  }, [])

  const updateScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const scrollTop = el.scrollTop
    const maxScroll = el.scrollHeight - el.clientHeight
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0
    setScrollProgress(progress)
    const idx = Math.min(Math.floor(progress * SECTIONS.length), SECTIONS.length - 1)
    const id = SECTIONS[idx]?.id || 'hero'
    setActive(id)
    setActiveSection(id)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', updateScroll, { passive: true })
    updateScroll()
    return () => el.removeEventListener('scroll', updateScroll)
  }, [updateScroll])

  const scrollToSection = useCallback((id) => {
    const el = containerRef.current
    if (!el) return
    const idx = SECTIONS.findIndex((s) => s.id === id)
    if (idx < 0) return
    const target = (idx / (SECTIONS.length - 1)) * (el.scrollHeight - el.clientHeight)
    smoothScrollTo(el, target)
  }, [])

  return (
    <>
      <NavBar activeSection={activeSection} onSectionClick={scrollToSection} />

      <div
        ref={containerRef}
        data-scroll-container
        className="fixed inset-0 z-10 overflow-y-auto overflow-x-hidden"
        style={{ pointerEvents: 'auto', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="h-[400vh] relative">
          {SECTIONS.map((s, i) => {
            const SectionComponent = SECTION_COMPONENTS[s.id]
            const isVisible = activeSection === s.id
            return (
              <div
                key={s.id}
                className="sticky top-0 h-screen flex items-center justify-center"
                style={{ zIndex: SECTIONS.length - i }}
              >
                <SectionComponent visible={isVisible || isInitialLoad} />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
