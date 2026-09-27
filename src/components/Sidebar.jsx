import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Wrench,
  BrainCircuit,
  CalendarRange,
  CalendarDays,
  CalendarClock,
  Route,
  FlaskConical,
  FileBarChart,
  Database,
  Settings,
  UserCircle,
  TrainFront,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/maintenance', label: 'Maintenance Tasks', icon: Wrench },
  { to: '/prioritization', label: 'AI Prioritization', icon: BrainCircuit },
  { to: '/block-planner', label: 'Block Planner', icon: CalendarRange },
  { to: '/weekly-plan', label: 'Weekly Plan', icon: CalendarDays },
  { to: '/monthly-plan', label: 'Monthly Plan', icon: CalendarClock },
  { to: '/corridor', label: 'Corridor View', icon: Route },
  { to: '/what-if', label: 'What-If Analysis', icon: FlaskConical },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/system-data', label: 'System Data', icon: Database },
]

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed z-40 inset-y-0 left-0 flex flex-col bg-surface border-r border-ink-200/60 text-ink-900 transition-all duration-200
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center gap-2 h-16 px-4 border-b border-ink-200/60 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-rail-600 shadow-glow shrink-0">
            <TrainFront size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-semibold leading-tight tracking-tight truncate">RailBlock AI</p>
              <p className="text-[11px] text-ink-500 leading-tight truncate">
                by IntegraX &bull; Smart Block Planning
              </p>
            </div>
          )}
          <button
            onClick={onCloseMobile}
            className="ml-auto lg:hidden text-ink-500 hover:text-white"
            aria-label="Close menu"
          >
            <ChevronsLeft size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors focus-ring
                ${isActive ? 'bg-rail-100 text-white font-medium relative before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-rail-500 before:rounded-full' : 'text-ink-500 hover:bg-white/5 hover:text-ink-900'}
                ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-200/60 px-2 py-3 space-y-0.5">
          <button
            className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-500 hover:bg-white/5 hover:text-ink-900 focus-ring ${collapsed ? 'justify-center' : ''}`}
          >
            <Settings size={18} className="shrink-0" />
            {!collapsed && <span>Settings</span>}
          </button>
          <button
            className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-500 hover:bg-white/5 hover:text-ink-900 focus-ring ${collapsed ? 'justify-center' : ''}`}
          >
            <UserCircle size={18} className="shrink-0" />
            {!collapsed && (
              <span className="text-left leading-tight">
                <span className="block truncate text-ink-900">S. Kulkarni</span>
                <span className="block text-[11px] text-ink-500">Section Controller</span>
              </span>
            )}
          </button>
          <button
            onClick={onToggle}
            className="hidden lg:flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-300 hover:bg-white/5 hover:text-ink-900 focus-ring"
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!collapsed && <span>Collapse</span>}
          </button>
          {!collapsed && (
            <p className="px-3 pt-1 text-[10px] text-ink-500 tracking-wide">
              SIH Prototype &bull; Team IntegraX
            </p>
          )}
        </div>
      </aside>
    </>
  )
}
