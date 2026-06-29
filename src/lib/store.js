/**
 * Global store using module-level variables + event emitters.
 * This allows communication between the 3D Canvas world and the HTML Overlay
 * without React context issues (since Canvas creates a separate React tree).
 */

const listeners = {}

function on(event, fn) {
  if (!listeners[event]) listeners[event] = new Set()
  listeners[event].add(fn)
  return () => listeners[event].delete(fn)
}

function emit(event, ...args) {
  if (!listeners[event]) return
  for (const fn of listeners[event]) fn(...args)
}

// --- Scroll Progress ---
let scrollProgress = 0
export function setScrollProgress(value) {
  scrollProgress = Math.max(0, Math.min(1, value))
  emit('scroll', scrollProgress)
}
export function getScrollProgress() { return scrollProgress }
export function onScroll(fn) { return on('scroll', fn) }

// --- Bark Events ---
export function triggerBark() { emit('bark') }
export function onBark(fn) { return on('bark', fn) }

// --- Active Section ---
let activeSection = 'hero'
export function setActiveSection(id) {
  activeSection = id
  emit('section', id)
}
export function getActiveSection() { return activeSection }
export function onSection(fn) { return on('section', fn) }

// --- Dog Animation State ---
let dogState = 'idle' // 'idle' | 'happy' | 'curious' | 'sleepy'
export function setDogState(state) {
  dogState = state
  emit('dogState', state)
}
export function getDogState() { return dogState }
export function onDogState(fn) { return on('dogState', fn) }

// --- Mouse position (normalized, -1 to 1) ---
let mouseX = 0, mouseY = 0
export function setMouse(x, y) { mouseX = x; mouseY = y }
export function getMouse() { return { x: mouseX, y: mouseY } }
