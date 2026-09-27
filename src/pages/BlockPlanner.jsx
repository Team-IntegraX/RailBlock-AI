import { useMemo, useState } from 'react'
import { Sparkles, CheckCircle2, XCircle, Download, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react'
import Card from '../components/Card'
import KPICard from '../components/KPICard'
import PriorityBadge from '../components/PriorityBadge'
import GanttChart from '../components/GanttChart'
import { BeforeAfterChart } from '../components/PriorityChart'
import { PageHeader, DemoDataNotice } from '../components/PageHeader'
import { EmptyState } from '../components/States'
import { useToast } from '../components/Toast'
import { sections, departments, departmentColors } from '../data/sections'
import {
  blockWindows,
  weekDates,
  rawBlocks,
  optimizedBlocks,
  beforeOptimization,
  afterOptimization,
  blockHoursSaved,
  percentImprovement,
  coordinatedOpportunities,
} from '../data/blockWindows'
import { toRawGanttBlocks, toOptimizedGanttBlocks, flattenOptimizedBlocks } from '../utils/optimization'
import { downloadCSV } from '../utils/exportData'

export default function BlockPlanner() {
  const { showToast } = useToast()
  const [sectionFilter, setSectionFilter] = useState('All')
  const [date, setDate] = useState(weekDates[0])
  const [horizon, setHorizon] = useState('Daily')
  const [deptFilter, setDeptFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [generated, setGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState('Pending Review')

  const sectionNames = ['All', ...sections.map((s) => s.sectionName)]

  const filteredWindows = useMemo(() => {
    return blockWindows.filter((w) => {
      if (sectionFilter !== 'All' && w.sectionName !== sectionFilter) return false
      if (horizon === 'Daily' && w.date !== date) return false
      return true
    })
  }, [sectionFilter, date, horizon])

  const ganttBlocks = useMemo(() => {
    const shaped = generated ? toOptimizedGanttBlocks(optimizedBlocks) : toRawGanttBlocks(rawBlocks)
    return shaped.filter((b) => {
      if (horizon === 'Daily' && !b.startISO.startsWith(date)) return false
      if (sectionFilter !== 'All' && b.sectionName !== sectionFilter) return false
      if (deptFilter !== 'All' && b.department !== deptFilter) return false
      if (priorityFilter !== 'All' && b.priority !== priorityFilter) return false
      return true
    })
  }, [generated, horizon, date, sectionFilter, deptFilter, priorityFilter])

  const rows = sections.map((s) => s.sectionName)

  function handleGenerate() {
    setGenerating(true)
    setApprovalStatus('Pending Review')
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
      showToast(`Optimized block plan generated — ${blockHoursSaved} hrs saved across the division.`, 'success')
    }, 900)
  }

  function handleReset() {
    setGenerated(false)
    setApprovalStatus('Pending Review')
    showToast('Reset to the original demo state.', 'info')
  }

  function handleExport() {
    const exportRows = generated ? flattenOptimizedBlocks(optimizedBlocks) : rawBlocks
    downloadCSV(`railblock-ai-block-plan-${date}.csv`, exportRows)
    showToast('Block plan exported as CSV.', 'success')
  }

  return (
    <div>
      <PageHeader
        title="Block Planner"
        description="Select a section and date, review demand against available block windows, then run the optimizer."
        action={<DemoDataNotice />}
      />

      <Card className="mb-5">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Select label="Division" value="Nanded" onChange={() => {}} options={['Nanded']} />
          <Select label="Section" value={sectionFilter} onChange={setSectionFilter} options={sectionNames} />
          <div>
            <label className="text-xs font-medium text-ink-500 block mb-1">Date</label>
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={horizon !== 'Daily'}
              className="w-full text-sm border border-ink-200 rounded-md px-2.5 py-2 bg-ink-100 text-ink-700 focus-ring disabled:opacity-40"
            >
              {weekDates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <Select label="Planning Horizon" value={horizon} onChange={setHorizon} options={['Daily', 'Weekly']} />
          <Select label="Department" value={deptFilter} onChange={setDeptFilter} options={['All', ...departments]} />
          <Select label="Priority" value={priorityFilter} onChange={setPriorityFilter} options={['All', 'Critical', 'High', 'Medium', 'Low']} />
        </div>
      </Card>

      <Card
        title="Available Block Windows"
        subtitle="Supply-side windows released by COA/BDMS for the selected section and date"
        className="mb-5"
      >
        {filteredWindows.length === 0 ? (
          <EmptyState title="No block windows for this selection" description="Try Weekly horizon or a different section." />
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-ink-200 text-left text-xs font-semibold text-ink-500">
                  <th className="py-2 px-2">Block ID</th>
                  <th className="py-2 px-2">Section</th>
                  <th className="py-2 px-2">Date</th>
                  <th className="py-2 px-2">Start</th>
                  <th className="py-2 px-2">End</th>
                  <th className="py-2 px-2">Duration</th>
                  <th className="py-2 px-2">Available</th>
                </tr>
              </thead>
              <tbody>
                {filteredWindows.slice(0, 8).map((w) => (
                  <tr key={w.blockId} className="border-b border-ink-100">
                    <td className="py-2 px-2 font-mono text-xs">{w.blockId}</td>
                    <td className="py-2 px-2 text-ink-700 whitespace-nowrap">{w.sectionName}</td>
                    <td className="py-2 px-2 text-ink-700 font-mono text-xs">{w.date}</td>
                    <td className="py-2 px-2 text-ink-700 font-mono text-xs">{w.startTime}</td>
                    <td className="py-2 px-2 text-ink-700 font-mono text-xs">{w.endTime}</td>
                    <td className="py-2 px-2 text-ink-700">{w.duration} hrs</td>
                    <td className="py-2 px-2">
                      {w.available ? (
                        <span className="inline-flex items-center gap-1 text-alert-low text-xs font-medium">
                          <CheckCircle2 size={13} /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-alert-critical text-xs font-medium">
                          <XCircle size={13} /> Allocated
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card
        title={generated ? 'Recommended Allocation — After AI Optimization' : 'Current Block Schedule — Before Optimization'}
        subtitle="Engineering, S&T and TRD blocks by section, colour-coded by department"
        action={
          <div className="flex flex-wrap items-center gap-2">
            {generated && (
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-700 border border-ink-200 hover:bg-ink-100 rounded-md px-3 py-2 focus-ring"
              >
                <Download size={14} /> Export Plan
              </button>
            )}
            {generated && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-700 border border-ink-200 hover:bg-ink-100 rounded-md px-3 py-2 focus-ring"
              >
                <RotateCcw size={14} /> Reset
              </button>
            )}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-rail-600 hover:bg-rail-700 disabled:opacity-60 rounded-md px-3 py-2 focus-ring"
            >
              <Sparkles size={14} />
              {generating ? 'Optimizing…' : generated ? 'Regenerate Plan' : 'Generate Optimized Plan'}
            </button>
          </div>
        }
        className="mb-5"
      >
        <div className="flex flex-wrap gap-3 mb-3">
          {departments.map((d) => (
            <span key={d} className="inline-flex items-center gap-1.5 text-xs text-ink-700">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: departmentColors[d] }} />
              {d}
            </span>
          ))}
        </div>
        {ganttBlocks.length === 0 ? (
          <EmptyState title="No blocks match these filters" description="Widen the date range or clear a filter." />
        ) : (
          <GanttChart blocks={ganttBlocks} rows={rows} height={340} />
        )}
      </Card>

      {generated && (
        <>
          <Card className="mb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink-900">Railway Official Review</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  Status:{' '}
                  <span
                    className={
                      approvalStatus === 'Approved'
                        ? 'text-alert-low font-medium'
                        : approvalStatus === 'Needs Revision'
                        ? 'text-alert-critical font-medium'
                        : 'text-ink-700 font-medium'
                    }
                  >
                    {approvalStatus}
                  </span>{' '}
                  — this is a decision-support recommendation, not an autonomous control action.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setApprovalStatus('Approved')
                    showToast('Block plan approved and sent for execution.', 'success')
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-alert-low hover:opacity-90 rounded-md px-3 py-2 focus-ring"
                >
                  <ThumbsUp size={14} /> Approve Plan
                </button>
                <button
                  onClick={() => {
                    setApprovalStatus('Needs Revision')
                    showToast('Block plan marked as needing revision.', 'info')
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-alert-critical hover:opacity-90 rounded-md px-3 py-2 focus-ring"
                >
                  <ThumbsDown size={14} /> Reject Plan
                </button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <KPICard label="Block Hours (Before)" value={beforeOptimization.totalHours} unit="hrs" tint="warning" />
            <KPICard label="Block Hours (After)" value={afterOptimization.totalHours} unit="hrs" tint="rail" />
            <KPICard label="Block Hours Saved" value={blockHoursSaved} unit="hrs" tint="rail" trend={percentImprovement} />
            <KPICard label="Conflicts Resolved" value={beforeOptimization.conflicts - afterOptimization.conflicts} tint="info" />
          </div>

          <Card title="Coordinated Maintenance Opportunities" subtitle="Shared blocks the optimizer merged across departments" className="mb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {coordinatedOpportunities.map((b) => (
                <div key={b.blockId} className="border border-ink-200 rounded-lg p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-ink-500">{b.blockId}</span>
                    <PriorityBadge level={b.priority} size="sm" />
                  </div>
                  <p className="text-sm font-medium text-ink-900">{b.sectionName}</p>
                  <ul className="mt-2 space-y-1">
                    {b.tasks.map((t, i) => (
                      <li key={i} className="text-xs text-ink-700 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm" style={{ background: departmentColors[t.department] }} />
                          {t.department}: {t.reason}
                        </span>
                        <span className="text-ink-500">{t.duration}h</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-ink-100 text-xs">
                    <span className="text-ink-500">1 coordinated block = {b.duration}h</span>
                    <span className="text-alert-low font-medium">Time Saved: {b.timeSaved > 0 ? b.timeSaved : 0.5}h</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Before vs After Optimization">
            <BeforeAfterChart before={beforeOptimization} after={afterOptimization} />
          </Card>
        </>
      )}
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-500 block mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm border border-ink-200 rounded-md px-2.5 py-2 bg-ink-100 text-ink-700 focus-ring"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
