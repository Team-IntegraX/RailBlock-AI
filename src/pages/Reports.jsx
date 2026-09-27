import { useState } from 'react'
import { FileText, Download, Eye, X, CheckCircle2, Clock, TrendingDown, Gauge, ShieldCheck } from 'lucide-react'
import Card from '../components/Card'
import KPICard from '../components/KPICard'
import { PageHeader, DemoDataNotice } from '../components/PageHeader'
import { useToast } from '../components/Toast'
import { blockHoursSaved, percentImprovement, delayReductionPercent, afterOptimization, beforeOptimization, optimizedBlocks } from '../data/blockWindows'
import { maintenanceTasks } from '../data/maintenanceTasks'
import { sections } from '../data/sections'
import { downloadCSV } from '../utils/exportData'
import { flattenOptimizedBlocks } from '../utils/optimization'

const REPORTS = [
  {
    title: 'Weekly Block Plan',
    cadence: 'Weekly',
    description: 'Block allocation for 14–20 Sep 2026 across all sections.',
    status: 'Generated',
    rows: () => flattenOptimizedBlocks(optimizedBlocks),
  },
  {
    title: 'Monthly Block Plan',
    cadence: 'Monthly',
    description: 'Four-week rollup of planned maintenance and block capacity.',
    status: 'Generated',
    rows: () => flattenOptimizedBlocks(optimizedBlocks),
  },
  {
    title: 'Maintenance Priority Report',
    cadence: 'Weekly',
    description: 'Full AI-ranked task list with score breakdowns.',
    status: 'Generated',
    rows: () => maintenanceTasks,
  },
  {
    title: 'Asset Availability Report',
    cadence: 'Monthly',
    description: 'Section-wise availability trend for the division.',
    status: 'Generated',
    rows: () => sections,
  },
  {
    title: 'Quarterly Performance Review',
    cadence: 'Quarterly',
    description: 'Block efficiency, safety and delay-reduction trends for Jul–Sep 2026.',
    status: 'Generated',
    rows: () => [
      { metric: 'Block Hours Before', value: beforeOptimization.totalHours },
      { metric: 'Block Hours After', value: afterOptimization.totalHours },
      { metric: 'Block Hours Saved', value: blockHoursSaved },
      { metric: 'Resource Efficiency (%)', value: percentImprovement },
      { metric: 'Estimated Delay Reduction (%)', value: delayReductionPercent },
      { metric: 'Conflicts Before', value: beforeOptimization.conflicts },
      { metric: 'Conflicts After', value: afterOptimization.conflicts },
    ],
  },
  {
    title: 'Safety Compliance Summary',
    cadence: 'Quarterly',
    description: 'Safety-critical task closure rate and audit-ready evidence log.',
    status: 'Generated',
    rows: () => maintenanceTasks.filter((t) => t.safetyImpact === 'High' || t.safetyImpact === 'Critical'),
  },
]

export default function Reports() {
  const { showToast } = useToast()
  const [preview, setPreview] = useState(null)
  const conflictsResolved = beforeOptimization.conflicts - afterOptimization.conflicts

  const metrics = [
    { label: 'Hours Saved', value: blockHoursSaved, unit: 'hrs', icon: Clock, tint: 'rail' },
    { label: 'Delay Reduction', value: delayReductionPercent, unit: '%', icon: TrendingDown, tint: 'rail', trend: delayReductionPercent, trendGood: true },
    { label: 'Resource Efficiency', value: percentImprovement, unit: '%', icon: Gauge, tint: 'info' },
    { label: 'Safety Improvements', value: conflictsResolved, unit: 'conflicts resolved', icon: ShieldCheck, tint: 'warning' },
  ]

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generated planning reports, ready to view or export."
        action={<DemoDataNotice />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {metrics.map((m) => (
          <KPICard key={m.label} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REPORTS.map((r) => (
          <Card key={r.title}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-md bg-rail-50 text-rail-500 flex items-center justify-center shrink-0">
                <FileText size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <h3 className="text-sm font-semibold text-ink-900 truncate">{r.title}</h3>
                    <span className="text-[10px] font-medium text-ink-500 bg-ink-100 border border-ink-200 rounded-full px-2 py-0.5 shrink-0">
                      {r.cadence}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-alert-low bg-alert-lowBg rounded-full px-2 py-0.5 shrink-0">
                    <CheckCircle2 size={11} />
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-ink-500 mt-1">{r.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => setPreview(r)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-700 border border-ink-200 rounded-md px-2.5 py-1.5 hover:bg-ink-100"
                  >
                    <Eye size={13} /> View
                  </button>
                  <button
                    onClick={() => {
                      setPreview(r)
                      showToast('Use your browser\u2019s Print \u2192 Save as PDF to export this view.', 'info')
                      setTimeout(() => window.print(), 200)
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-700 border border-ink-200 rounded-md px-2.5 py-1.5 hover:bg-ink-100"
                  >
                    <Download size={13} /> Export PDF
                  </button>
                  <button
                    onClick={() => {
                      downloadCSV(`${r.title.replace(/\s+/g, '-').toLowerCase()}.csv`, r.rows())
                      showToast(`${r.title} downloaded as CSV.`, 'success')
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-700 border border-ink-200 rounded-md px-2.5 py-1.5 hover:bg-ink-100"
                  >
                    <Download size={13} /> Export CSV
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {preview && (
        <div className="mt-6 print:mt-0">
          <Card
            title={preview.title}
            subtitle={`${preview.rows().length} records \u2022 Prototype demonstration using structured/synthetic data`}
            action={
              <button
                onClick={() => setPreview(null)}
                className="print:hidden inline-flex items-center gap-1 text-xs font-medium text-ink-500 hover:text-ink-900"
              >
                <X size={14} /> Close
              </button>
            }
          >
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-xs min-w-[640px]">
                <thead>
                  <tr className="border-b border-ink-200 text-left font-semibold text-ink-500">
                    {preview.rows()[0] &&
                      Object.keys(preview.rows()[0]).slice(0, 8).map((h) => (
                        <th key={h} className="py-2 px-2 whitespace-nowrap">{h}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows().slice(0, 25).map((row, i) => (
                    <tr key={i} className="border-b border-ink-100">
                      {Object.keys(row).slice(0, 8).map((h) => (
                        <td key={h} className="py-1.5 px-2 whitespace-nowrap text-ink-700">{String(row[h])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.rows().length > 25 && (
                <p className="text-[11px] text-ink-500 mt-2">
                  Showing first 25 of {preview.rows().length} records — export CSV for the full set.
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
