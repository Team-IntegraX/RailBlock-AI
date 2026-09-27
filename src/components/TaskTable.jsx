import { useMemo, useState } from 'react'
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import PriorityBadge from './PriorityBadge'
import { EmptyState } from './States'

const COLUMNS = [
  { key: 'taskId', label: 'Task ID' },
  { key: 'department', label: 'Department' },
  { key: 'assetType', label: 'Asset' },
  { key: 'sectionId', label: 'Section' },
  { key: 'severity', label: 'Severity' },
  { key: 'daysOpen', label: 'Days Open' },
  { key: 'safetyImpact', label: 'Safety Impact' },
  { key: 'trafficDensity', label: 'Traffic Density' },
  { key: 'priorityScore', label: 'AI Priority Score' },
  { key: 'priority', label: 'Priority' },
]

const PAGE_SIZE = 10

export default function TaskTable({ tasks, onSelectTask }) {
  const [query, setQuery] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [sortKey, setSortKey] = useState('priorityScore')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const departments = useMemo(() => ['All', ...new Set(tasks.map((t) => t.department))], [tasks])
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low']

  const filtered = useMemo(() => {
    let rows = tasks
    if (deptFilter !== 'All') rows = rows.filter((t) => t.department === deptFilter)
    if (priorityFilter !== 'All') rows = rows.filter((t) => t.priority === priorityFilter)
    if (query.trim()) {
      const q = query.toLowerCase()
      rows = rows.filter(
        (t) =>
          t.taskId.toLowerCase().includes(q) ||
          t.assetId.toLowerCase().includes(q) ||
          t.sectionId.toLowerCase().includes(q) ||
          t.assetType.toLowerCase().includes(q)
      )
    }
    rows = [...rows].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [tasks, query, deptFilter, priorityFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
    setPage(1)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 bg-ink-100 rounded-md px-3 py-2 flex-1 min-w-[180px]">
          <Search size={15} className="text-ink-500 shrink-0" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search task ID, asset, section..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-ink-500"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => {
            setDeptFilter(e.target.value)
            setPage(1)
          }}
          className="text-sm border border-ink-200 rounded-md px-2.5 py-2 bg-ink-100 text-ink-700 focus-ring"
        >
          {departments.map((d) => (
            <option key={d} value={d}>
              {d === 'All' ? 'All Departments' : d}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value)
            setPage(1)
          }}
          className="text-sm border border-ink-200 rounded-md px-2.5 py-2 bg-ink-100 text-ink-700 focus-ring"
        >
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p === 'All' ? 'All Priorities' : p}
            </option>
          ))}
        </select>
      </div>

      {pageRows.length === 0 ? (
        <EmptyState title="No tasks match your filters" description="Try clearing the search or filters above." />
      ) : (
        <>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm min-w-[860px]">
              <thead>
                <tr className="border-b border-ink-200 text-left">
                  {COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      className="py-2.5 px-2 text-xs font-semibold text-ink-500 whitespace-nowrap cursor-pointer select-none hover:text-ink-900"
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key &&
                          (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((t) => (
                  <tr
                    key={t.taskId}
                    onClick={() => onSelectTask?.(t)}
                    className="border-b border-ink-100 hover:bg-rail-50/60 cursor-pointer"
                  >
                    <td className="py-2.5 px-2 font-mono text-xs text-ink-900 whitespace-nowrap">{t.taskId}</td>
                    <td className="py-2.5 px-2 text-ink-700 whitespace-nowrap">{t.department}</td>
                    <td className="py-2.5 px-2 text-ink-700 whitespace-nowrap">{t.assetType}</td>
                    <td className="py-2.5 px-2 text-ink-700 whitespace-nowrap">{t.sectionId}</td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <PriorityBadge level={t.severity} size="sm" />
                    </td>
                    <td className="py-2.5 px-2 text-ink-700 whitespace-nowrap">{t.daysOpen}d</td>
                    <td className="py-2.5 px-2 text-ink-700 whitespace-nowrap">{t.safetyImpact}</td>
                    <td className="py-2.5 px-2 text-ink-700 whitespace-nowrap">{t.trafficDensity}</td>
                    <td className="py-2.5 px-2 font-mono text-ink-900 whitespace-nowrap">{t.priorityScore}</td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <PriorityBadge level={t.priority} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-ink-500">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} tasks
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md border border-ink-200 disabled:opacity-40 hover:bg-ink-100"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-2 font-mono">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md border border-ink-200 disabled:opacity-40 hover:bg-ink-100"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
