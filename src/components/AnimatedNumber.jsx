import { useEffect, useRef, useState } from 'react'

/**
 * Counts up from 0 (or the previous value) to `value` over `duration` ms.
 * Falls back to an instant render if the value isn't a finite number, so
 * this is safe to use around any numeric KPI without extra guards.
 */
export default function AnimatedNumber({ value, duration = 700, decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  const prevValue = useRef(0)
  const raf = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }
    const from = prevValue.current
    const to = typeof value === 'number' && isFinite(value) ? value : 0
    const start = performance.now()

    function tick(now) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (to - from) * eased)
      if (t < 1) {
        raf.current = requestAnimationFrame(tick)
      } else {
        prevValue.current = to
      }
    }
    raf.current = requestAnimationFrame(tick)
    return () => raf.current && cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  if (typeof value !== 'number' || !isFinite(value)) return <>{value}</>
  return <>{decimals ? display.toFixed(decimals) : Math.round(display).toLocaleString('en-IN')}</>
}
