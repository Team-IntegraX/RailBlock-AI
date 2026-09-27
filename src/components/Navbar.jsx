import { useState } from 'react'
import { Menu, Search, Bell, ChevronDown, UserCircle } from 'lucide-react'

const DIVISIONS = ['Nanded', 'Secunderabad', 'Guntakal', 'Hyderabad', 'Vijayawada']

export default function Navbar({ title, onOpenMobile }) {
  const [division, setDivision] = useState('Nanded')
  const [divOpen, setDivOpen] = useState(false)

  const today = new Date('2026-09-10')
  const dateStr = today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <header className="sticky top-0 z-20 h-16 glass border-b border-ink-200/60 flex items-center gap-3 px-4 lg:px-6">
      <button
        onClick={onOpenMobile}
        className="lg:hidden text-ink-500 hover:text-ink-900 focus-ring rounded"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="min-w-0">
        <h1 className="text-base font-semibold text-ink-900 leading-tight truncate">{title}</h1>
        <p className="text-xs text-ink-500 leading-tight">Planning Horizon: September 2026</p>
      </div>

      <span className="hidden md:inline-flex items-center gap-1.5 ml-2 text-[11px] font-medium text-alert-low bg-alert-lowBg border border-alert-lowBorder rounded-full px-2.5 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-alert-low animate-[pulseDot_2s_ease-in-out_infinite]" />
        Live
      </span>

      <div className="relative ml-2 hidden md:block">
        <button
          onClick={() => setDivOpen((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium bg-rail-100 text-ink-900 border border-ink-200 rounded-full px-3 py-1.5 hover:border-rail-500/60 focus-ring"
        >
          Division: {division}
          <ChevronDown size={13} />
        </button>
        {divOpen && (
          <div className="absolute mt-1 w-44 bg-card border border-ink-200 rounded-md shadow-raised py-1 z-30">
            {DIVISIONS.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDivision(d)
                  setDivOpen(false)
                }}
                className="w-full text-left px-3 py-1.5 text-sm text-ink-700 hover:bg-rail-100"
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex items-center gap-2 bg-ink-100 border border-ink-200/60 rounded-md px-3 py-1.5 w-56">
          <Search size={15} className="text-ink-500 shrink-0" />
          <input
            type="text"
            placeholder="Search tasks, sections..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-ink-500 text-ink-900"
          />
        </div>

        <span className="hidden sm:block text-xs text-ink-500 font-mono">{dateStr}</span>

        <button className="relative text-ink-500 hover:text-ink-900 focus-ring rounded" aria-label="Notifications">
          <Bell size={19} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-alert-critical" />
        </button>

        <UserCircle size={26} className="text-ink-500 md:hidden" />
      </div>
    </header>
  )
}
