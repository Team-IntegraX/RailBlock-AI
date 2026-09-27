import { Database, BrainCircuit, SlidersHorizontal, Users, CalendarCheck2, ArrowRight, ArrowDown } from 'lucide-react'

const STAGES = [
  {
    icon: Database,
    title: 'Data Integration',
    description: 'TMS, SMMS, TDMS, COA/BDMS and the working timetable are merged into one task feed.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Prioritization',
    description: 'Each task is scored on severity, safety impact, overdue days, traffic density and asset criticality.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Block Optimization',
    description: 'An optimization engine allocates block windows against the ranked task list to minimize conflicts.',
  },
  {
    icon: Users,
    title: 'Multi-Department Coordination',
    description: 'Engineering, S&T and TRD work in the same section/time window is merged into shared blocks.',
  },
  {
    icon: CalendarCheck2,
    title: 'Weekly / Monthly Plan',
    description: 'The coordinated schedule is published as a weekly and monthly block plan for the division.',
  },
]

const SOURCES = ['TMS', 'SMMS', 'TDMS', 'COA', 'Timetable']

export default function Workflow() {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {SOURCES.map((s) => (
          <span key={s} className="text-xs font-medium text-rail-500 bg-rail-50 border border-rail-100 rounded-full px-3 py-1">
            {s}
          </span>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-stretch gap-2">
        {STAGES.map((stage, i) => (
          <div key={stage.title} className="flex flex-col lg:flex-row items-center lg:items-stretch">
            <div className="flex-1 bg-rail-50 border border-rail-100 rounded-lg p-4 min-w-[168px] lg:w-44">
              <div className="w-8 h-8 rounded-md bg-rail-500 text-white flex items-center justify-center mb-2.5">
                <stage.icon size={16} />
              </div>
              <p className="text-sm font-semibold text-ink-900 leading-tight">{stage.title}</p>
              <p className="text-[11px] text-ink-500 mt-1 leading-snug">{stage.description}</p>
            </div>
            {i < STAGES.length - 1 && (
              <div className="flex items-center justify-center text-rail-500 shrink-0 py-2 lg:py-0 lg:px-1">
                <ArrowDown size={18} className="lg:hidden" />
                <ArrowRight size={18} className="hidden lg:block" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
