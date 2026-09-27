import { Inbox, AlertTriangle, Loader2 } from 'lucide-react'

export function EmptyState({ title = 'Nothing here yet', description, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="w-12 h-12 rounded-full bg-ink-100 border border-ink-200 flex items-center justify-center mb-3">
        <Icon size={20} className="text-ink-500" />
      </div>
      <p className="text-sm font-medium text-ink-900">{title}</p>
      {description && <p className="text-xs text-ink-500 mt-1 max-w-xs">{description}</p>}
    </div>
  )
}

export function ErrorState({ title = 'Could not load this data', description, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="w-12 h-12 rounded-full bg-alert-criticalBg border border-alert-criticalBorder flex items-center justify-center mb-3">
        <AlertTriangle size={20} className="text-alert-critical" />
      </div>
      <p className="text-sm font-medium text-ink-900">{title}</p>
      {description && <p className="text-xs text-ink-500 mt-1 max-w-xs">{description}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-xs font-medium text-white bg-rail-600 hover:bg-rail-700 rounded-md px-3 py-1.5 focus-ring"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 text-ink-500">
      <Loader2 size={22} className="animate-spin mb-2" />
      <p className="text-xs">{label}</p>
    </div>
  )
}

export function SkeletonRows({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-9 bg-ink-100 rounded-md animate-pulse" />
      ))}
    </div>
  )
}
