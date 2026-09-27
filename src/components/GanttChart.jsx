import Plot from 'react-plotly.js'
import { departmentColors } from '../data/sections'

/**
 * Horizontal Gantt/timeline built on a Plotly bar chart: each bar's `base`
 * is its start datetime and its `x` length is duration in milliseconds,
 * with the x-axis set to type "date" so Plotly renders a real timeline.
 *
 * blocks: [{
 *   row: string          // y-axis category (e.g. section name)
 *   department: string   // used for color + legend grouping
 *   startISO: string      // e.g. '2026-09-14T22:00'
 *   durationHours: number
 *   taskId, priority, reason, sectionName, startTime, endTime  // for hover
 * }]
 */
export default function GanttChart({ blocks, rows, height = 420 }) {
  const departments = [...new Set(blocks.map((b) => b.department))]

  const traces = departments.map((dept) => {
    const deptBlocks = blocks.filter((b) => b.department === dept)
    return {
      type: 'bar',
      orientation: 'h',
      name: dept,
      y: deptBlocks.map((b) => b.row),
      base: deptBlocks.map((b) => b.startISO),
      x: deptBlocks.map((b) => b.durationHours * 3600 * 1000),
      marker: {
        color: departmentColors[dept] || '#9AA3AB',
        line: { width: 1, color: '#0F172A' },
      },
      customdata: deptBlocks.map((b) => [
        b.taskId || b.blockId || '—',
        b.department,
        b.sectionName || b.row,
        b.priority || '—',
        b.startTime || '',
        b.endTime || '',
        `${b.durationHours}h`,
        b.reason || '—',
      ]),
      hovertemplate:
        '<b>%{customdata[0]}</b><br>' +
        'Department: %{customdata[1]}<br>' +
        'Section: %{customdata[2]}<br>' +
        'Priority: %{customdata[3]}<br>' +
        'Start: %{customdata[4]} &middot; End: %{customdata[5]}<br>' +
        'Duration: %{customdata[6]}<br>' +
        'Reason: %{customdata[7]}<extra></extra>',
    }
  })

  return (
    <Plot
      data={traces}
      layout={{
        height,
        barmode: 'overlay',
        margin: { t: 10, b: 40, l: 150, r: 20 },
        xaxis: {
          type: 'date',
          tickformat: '%b %d\n%H:%M',
          gridcolor: 'rgba(148,163,184,0.12)',
        },
        yaxis: {
          categoryorder: 'array',
          categoryarray: rows ? [...rows].reverse() : undefined,
          automargin: true,
        },
        legend: { orientation: 'h', y: -0.12, font: { size: 11, family: 'IBM Plex Sans' } },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { family: 'IBM Plex Sans', size: 11, color: '#CBD5E1' },
        bargap: 0.35,
      }}
      config={{ displayModeBar: true, displaylogo: false, modeBarButtonsToRemove: ['lasso2d', 'select2d'], responsive: true }}
      style={{ width: '100%' }}
      useResizeHandler
    />
  )
}
