import { useMemo, useState } from 'react'
import { BrainCircuit, Check, SlidersHorizontal, RefreshCw, ShieldAlert, Zap, Users } from 'lucide-react'
import PriorityBadge from './PriorityBadge'
import { useToast } from './Toast'
import { explainTask } from '../utils/priority'

const REASON_ICON = {
  traffic: Zap,
  safety: ShieldAlert,
  resource: Users,
}

function reasonChips(task) {
  const chips = []
  if (task.trafficDensity === 'High') chips.push({ label: 'High Traffic Corridor', icon: 'traffic' })
  if (task.safetyImpact === 'High' || task.safetyImpact === 'Critical') chips.push({ label: 'Safety Critical', icon: 'safety' })
  if (task.overdue) chips.push({ label: `Overdue ${task.daysOpen}d`, icon: 'traffic' })
  chips.push({ label: 'Resource Available', icon: 'resource' })
  return chips.slice(0, 4)
}

export default function AIRecommendationCenter({ tasks }) {
  const { showToast } = useToast()
  const [decided, setDecided] = useState({})

  const top = useMemo(() => tasks.slice(0, 3), [tasks])

  function act(taskId, action) {
    setDecided((d) => ({ ...d, [taskId]: action }))
    const messages = {
      accept: 'Plan accepted and sent to the block planner.',
      modify: 'Opening plan for manual adjustment…',
      alternative: 'Generating an alternative block window…',
    }
    showToast(messages[action], action === 'accept' ? 'success' : 'info')
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-rail-500/25 bg-card shadow-raised">
      <div className="tech-grid bg-grid-fade absolute inset-0 pointer-events-none" />
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rail-600 shadow-glow flex items-center justify-center shrink-0">
              <BrainCircuit size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-ink-900">AI Recommendation Center</h2>
              <p className="text-xs text-ink-500 mt-0.5">
                Top-ranked block plans for today, generated from live task priority and available capacity.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-alert-low bg-alert-lowBg border border-alert-lowBorder rounded-full px-2.5 py-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-alert-low animate-[pulseDot_2s_ease-in-out_infinite]" />
            Optimizer running
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {top.map((task) => {
            const { summary } = explainTask(task)
            const chips = reasonChips(task)
            const decision = decided[task.taskId]
            return (
              <div
                key={task.taskId}
                className="rounded-lg border border-ink-200/70 bg-ink-100/40 p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-[11px] text-ink-500">{task.taskId}</p>
                    <p className="text-sm font-semibold text-ink-900 mt-0.5">{task.assetType}</p>
                    <p className="text-xs text-ink-500">{task.sectionName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-mono font-semibold text-ink-900 leading-none">{task.priorityScore}</p>
                    <p className="text-[10px] text-ink-500 mt-1">Priority Score</p>
                  </div>
                </div>

                <PriorityBadge level={task.priority} size="sm" className="self-start" />

                <div className="flex flex-wrap gap-1.5">
                  {chips.map((c) => {
                    const Icon = REASON_ICON[c.icon]
                    return (
                      <span
                        key={c.label}
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-ink-700 bg-ink-100 border border-ink-200 rounded-full px-2 py-0.5"
                      >
                        <Icon size={10} />
                        {c.label}
                      </span>
                    )
                  })}
                </div>

                <p className="text-[11px] text-ink-500 leading-relaxed line-clamp-2">{summary}</p>

                {decision ? (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-alert-low mt-1">
                    <Check size={14} />
                    {decision === 'accept' && 'Accepted'}
                    {decision === 'modify' && 'Sent for modification'}
                    {decision === 'alternative' && 'Alternative requested'}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 mt-1">
                    <button
                      onClick={() => act(task.taskId, 'accept')}
                      className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium text-white bg-rail-600 hover:bg-rail-700 rounded-md px-2 py-1.5 focus-ring"
                    >
                      <Check size={13} /> Accept
                    </button>
                    <button
                      onClick={() => act(task.taskId, 'modify')}
                      className="inline-flex items-center justify-center gap-1 text-xs font-medium text-ink-700 border border-ink-200 hover:bg-ink-100 rounded-md px-2 py-1.5 focus-ring"
                      title="Modify Plan"
                    >
                      <SlidersHorizontal size={13} />
                    </button>
                    <button
                      onClick={() => act(task.taskId, 'alternative')}
                      className="inline-flex items-center justify-center gap-1 text-xs font-medium text-ink-700 border border-ink-200 hover:bg-ink-100 rounded-md px-2 py-1.5 focus-ring"
                      title="Generate Alternative"
                    >
                      <RefreshCw size={13} />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
