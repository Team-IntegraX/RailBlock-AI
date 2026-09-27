import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import AnimatedNumber from './AnimatedNumber'

/**
 * trend: positive number = good/up, negative = down. trendGood lets the
 * caller flip which direction counts as "good" (e.g. fewer conflicts is good).
 */
export default function KPICard({ label, value, unit, icon: Icon, trend, trendGood = true, tint = 'rail' }) {
  const tints = {
    rail: 'bg-rail-100 text-rail-500',
    critical: 'bg-alert-criticalBg text-alert-critical',
    info: 'bg-alert-infoBg text-alert-info',
    warning: 'bg-alert-mediumBg text-alert-high',
  }

  const isUp = trend > 0
  const goodDirection = isUp === trendGood
  const trendColor = trend === undefined ? '' : goodDirection ? 'text-alert-low' : 'text-alert-critical'

  return (
    <div className="bg-card border border-ink-200/70 rounded-xl shadow-card p-4 flex flex-col gap-3 min-w-0 transition-colors hover:border-ink-200">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-ink-500 leading-snug">{label}</span>
        {Icon && (
          <span className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${tints[tint]}`}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold text-ink-900 tracking-tight font-mono">
          <AnimatedNumber value={typeof value === 'number' ? value : Number(value)} />
          {unit && <span className="text-sm font-medium text-ink-500 ml-1 font-sans">{unit}</span>}
        </span>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
            {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  )
}
