import { useState } from 'react'
import { X, TrainFront, ShieldAlert } from 'lucide-react'
import Card from '../components/Card'
import { PageHeader, DemoDataNotice } from '../components/PageHeader'
import { sections, corridorStations } from '../data/sections'
import { maintenanceTasks } from '../data/maintenanceTasks'
import { blockWindows } from '../data/blockWindows'

function sectionStats(sectionId) {
  const tasks = maintenanceTasks.filter((t) => t.sectionId === sectionId)
  const critical = tasks.filter((t) => t.priority === 'Critical').length
  const windows = blockWindows.filter((w) => w.sectionId === sectionId)
  const available = windows.filter((w) => w.available).length
  const availability = Math.round((94 + (critical > 3 ? -3 : 1) - tasks.length * 0.02) * 10) / 10
  return { assets: 40 + tasks.length, activeDefects: tasks.length, critical, available, availability }
}

// Health classification drives the corridor's track color: this is the
// at-a-glance signal a controller reads before drilling into any section.
function healthStatus(stats) {
  if (stats.critical > 0) return { key: 'critical', label: 'Critical Risk', dot: 'bg-alert-critical', track: '#F87171', text: 'text-alert-critical' }
  if (stats.activeDefects >= 40) return { key: 'scheduled', label: 'Scheduled Maintenance', dot: 'bg-alert-high', track: '#FBBF24', text: 'text-alert-high' }
  return { key: 'healthy', label: 'Healthy', dot: 'bg-alert-low', track: '#4ADE80', text: 'text-alert-low' }
}

export default function Corridor() {
  const [selected, setSelected] = useState(null)

  const withStats = sections.map((s) => ({ section: s, stats: sectionStats(s.sectionId) }))
  const counts = withStats.reduce(
    (acc, { stats }) => {
      const h = healthStatus(stats).key
      acc[h] += 1
      return acc
    },
    { healthy: 0, scheduled: 0, critical: 0 }
  )

  return (
    <div>
      <PageHeader
        title="Corridor View"
        description="Schematic view of the Nanded corridor — click a section for its live maintenance and block-availability snapshot."
        action={<DemoDataNotice />}
      />

      <Card
        title="Nanded Corridor"
        subtitle="Nanded Jn → Mudkhed → Umri → Aurangabad → Jalna → Parbhani"
        action={
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-medium text-ink-500">
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-alert-low" />Healthy ({counts.healthy})</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-alert-high" />Scheduled ({counts.scheduled})</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-alert-critical" />Critical ({counts.critical})</span>
          </div>
        }
        className="mb-5"
      >
        <div className="overflow-x-auto py-6 tech-grid rounded-lg">
          <div className="flex items-center min-w-[820px] px-4">
            {corridorStations.map((station, i) => (
              <div key={station.code} className="flex items-center">
                <div className="flex flex-col items-center w-20 shrink-0">
                  <div className="w-4 h-4 rounded-full bg-rail-600 border-2 border-app shadow" />
                  <span className="text-xs font-semibold text-ink-900 mt-2">{station.code}</span>
                  <span className="text-[10px] text-ink-500 text-center leading-tight">{station.name}</span>
                </div>
                {i < sections.length && (
                  <button
                    onClick={() => setSelected(sections[i])}
                    className="relative flex-1 min-w-[100px] h-1.5 rounded-full mx-1 group transition-all hover:h-2.5"
                    style={{ background: healthStatus(withStats[i].stats).track }}
                    title={`${sections[i].sectionName} — ${healthStatus(withStats[i].stats).label}`}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-ink-500 group-hover:text-ink-900 whitespace-nowrap">
                      {sections[i].sectionId}
                    </span>
                    {healthStatus(withStats[i].stats).key === 'critical' && (
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                        <ShieldAlert size={12} className="text-alert-critical" />
                      </span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-ink-500 mt-2">Click any track segment to open its section details.</p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {withStats.map(({ section: s, stats }) => {
          const health = healthStatus(stats)
          return (
            <button
              key={s.sectionId}
              onClick={() => setSelected(s)}
              className="text-left bg-card border border-ink-200/70 rounded-lg shadow-card p-4 hover:border-rail-500/60 transition-colors focus-ring relative overflow-hidden"
            >
              <span className="absolute left-0 top-0 bottom-0 w-1" style={{ background: health.track }} />
              <div className="flex items-center justify-between mb-1.5 pl-2">
                <span className="font-mono text-xs text-ink-500">{s.sectionId}</span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${health.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${health.dot}`} />
                  {health.label}
                </span>
              </div>
              <p className="text-sm font-semibold text-ink-900 pl-2">{s.sectionName}</p>
              <div className="grid grid-cols-2 gap-2 mt-3 pl-2 text-xs">
                <Stat label="Active Defects" value={stats.activeDefects} />
                <Stat label="Critical" value={stats.critical} tone={stats.critical > 0 ? 'critical' : undefined} />
                <Stat label="Available Blocks" value={stats.available} />
                <Stat label="Availability" value={`${stats.availability}%`} />
              </div>
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-card border border-ink-200 rounded-lg shadow-raised w-full max-w-md p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-md bg-rail-600 text-white flex items-center justify-center">
                  <TrainFront size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{selected.sectionName}</p>
                  <p className="text-xs text-ink-500 font-mono">{selected.sectionId}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-ink-500 hover:text-ink-900">
                <X size={18} />
              </button>
            </div>
            {(() => {
              const stats = sectionStats(selected.sectionId)
              const health = healthStatus(stats)
              return (
                <>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${health.text} bg-ink-100 border border-ink-200 rounded-full px-2.5 py-1 mb-3`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${health.dot}`} />
                    Track Status: {health.label}
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <Stat label="Number of Assets" value={stats.assets} big />
                    <Stat label="Active Defects" value={stats.activeDefects} big />
                    <Stat label="Critical Defects" value={stats.critical} big tone={stats.critical > 0 ? 'critical' : undefined} />
                    <Stat label="Traffic Density" value={selected.trafficDensity} big />
                    <Stat label="Available Blocks" value={stats.available} big />
                    <Stat label="Asset Availability" value={`${stats.availability}%`} big />
                  </div>
                </>
              )
            })()}
            <p className="text-xs text-ink-500 mt-4 border-t border-ink-100 pt-3">
              {selected.lengthKm} km &middot; {selected.lineType} &middot; {selected.dailyTrainCount} trains/day
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, big, tone }) {
  return (
    <div>
      <p className="text-[11px] text-ink-500">{label}</p>
      <p className={`${big ? 'text-lg' : 'text-sm'} font-semibold mt-0.5 ${tone === 'critical' ? 'text-alert-critical' : 'text-ink-900'}`}>
        {value}
      </p>
    </div>
  )
}
