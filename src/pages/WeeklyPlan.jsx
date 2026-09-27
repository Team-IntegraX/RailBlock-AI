import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import Card from '../components/Card'
import GanttChart from '../components/GanttChart'
import { PageHeader, DemoDataNotice } from '../components/PageHeader'
import { useToast } from '../components/Toast'
import { sections, departments, departmentColors } from '../data/sections'
import { weekDates, weekDayLabels, rawBlocks, optimizedBlocks } from '../data/blockWindows'
import { toRawGanttBlocks, toOptimizedGanttBlocks } from '../utils/optimization'

export default function WeeklyPlan() {
  const { showToast } = useToast()
  const [generated, setGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)

  const blocks = generated ? toOptimizedGanttBlocks(optimizedBlocks) : toRawGanttBlocks(rawBlocks)
  const rows = sections.map((s) => s.sectionName)

  function handleGenerate() {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
      showToast('Weekly block plan generated for 14–20 Sep 2026.', 'success')
    }, 900)
  }

  return (
    <div>
      <PageHeader
        title="Weekly Plan"
        description="Monday through Sunday block schedule across every section in the division."
        action={<DemoDataNotice />}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {weekDates.map((d, i) => (
          <span key={d} className="text-xs font-medium text-ink-700 bg-ink-100 border border-ink-200 rounded-full px-3 py-1.5">
            {weekDayLabels[i]} &middot; {d.slice(5)}
          </span>
        ))}
      </div>

      <Card
        title={generated ? 'Optimized Weekly Schedule' : 'Draft Weekly Schedule'}
        subtitle="All sections, Mon 14 Sep – Sun 20 Sep 2026"
        action={
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-rail-600 hover:bg-rail-700 disabled:opacity-60 rounded-md px-3 py-2 focus-ring"
          >
            <Sparkles size={14} />
            {generating ? 'Generating…' : generated ? 'Regenerate Weekly Plan' : 'Generate Weekly Plan'}
          </button>
        }
      >
        <div className="flex flex-wrap gap-3 mb-3">
          {departments.map((d) => (
            <span key={d} className="inline-flex items-center gap-1.5 text-xs text-ink-700">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: departmentColors[d] }} />
              {d}
            </span>
          ))}
        </div>
        <GanttChart blocks={blocks} rows={rows} height={420} />
      </Card>
    </div>
  )
}
