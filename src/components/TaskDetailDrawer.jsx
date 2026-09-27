import { X } from 'lucide-react'
import PriorityBadge from './PriorityBadge'
import { explainTask, PRIORITY_WEIGHTS } from '../utils/priority'

const FACTOR_KEYS = {
  Severity: 'severity',
  'Safety Impact': 'safetyImpact',
  'Overdue Days': 'overdueDays',
  'Traffic Density': 'trafficDensity',
  'Asset Criticality': 'assetCriticality',
}

export default function TaskDetailDrawer({ task, onClose }) {
  if (!task) return null
  const { contributions, summary } = explainTask(task)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative w-full sm:w-[440px] bg-card h-full shadow-xl overflow-y-auto animate-[slideIn_0.18s_ease-out]">
        <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-ink-200 px-5 py-4 flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-ink-500">{task.taskId}</p>
            <h3 className="text-base font-semibold text-ink-900 mt-0.5">{task.assetType}</h3>
            <p className="text-xs text-ink-500 mt-0.5">
              {task.sectionName} &middot; {task.department}
            </p>
          </div>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-900 focus-ring rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between bg-rail-50 border border-rail-100 rounded-lg p-4">
            <div>
              <p className="text-xs text-ink-500">AI Priority Score</p>
              <p className="text-2xl font-semibold text-ink-900 mt-0.5">
                {task.priorityScore}
                <span className="text-sm text-ink-500"> / 100</span>
              </p>
            </div>
            <PriorityBadge level={task.priority} />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink-900 mb-2">Why this score</h4>
            <p className="text-sm text-ink-700 leading-relaxed bg-ink-50 border border-ink-100 rounded-lg p-3">{summary}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink-900 mb-3">Score breakdown</h4>
            <div className="space-y-3">
              {contributions.map((c) => (
                <div key={c.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-ink-700 font-medium">
                      {c.label} <span className="text-ink-500 font-normal">({Math.round(c.weight * 100)}% weight)</span>
                    </span>
                    <span className="font-mono text-ink-900">{Math.round(c.value)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
                    <div className="h-full bg-rail-500 rounded-full" style={{ width: `${Math.min(100, c.value)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Asset ID" value={task.assetId} mono />
            <Field label="Source System" value={task.sourceSystem} />
            <Field label="Days Open" value={`${task.daysOpen} days`} />
            <Field label="Overdue" value={task.overdue ? 'Yes' : 'No'} />
            <Field label="Est. Duration" value={`${task.estimatedDuration} hrs`} />
            <Field label="Asset Criticality" value={`${task.assetCriticality} / 100`} />
          </div>

          <p className="text-[11px] text-ink-500 border-t border-ink-100 pt-3">
            The AI model ranks tasks by priority only — final block timing and section allocation are produced by a
            separate optimization engine.
          </p>
        </div>
      </aside>
    </div>
  )
}

function Field({ label, value, mono }) {
  return (
    <div>
      <p className="text-[11px] text-ink-500">{label}</p>
      <p className={`text-ink-900 mt-0.5 ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
    </div>
  )
}
