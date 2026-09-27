const STYLES = {
  Critical: 'text-alert-critical bg-alert-criticalBg border border-alert-criticalBorder',
  High: 'text-alert-high bg-alert-highBg border border-alert-highBorder',
  Medium: 'text-alert-medium bg-alert-mediumBg border border-alert-highBorder/60',
  Low: 'text-alert-low bg-alert-lowBg border border-alert-lowBorder',
}

export default function PriorityBadge({ level, size = 'md', className = '' }) {
  const style = STYLES[level] || 'text-ink-500 bg-ink-100 border border-ink-200'
  const sizing = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium self-start ${sizing} ${style} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {level}
    </span>
  )
}
