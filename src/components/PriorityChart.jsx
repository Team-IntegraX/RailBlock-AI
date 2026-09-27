import Plot from 'react-plotly.js'
import { priorityColors } from '../data/sections'

const ORDER = ['Critical', 'High', 'Medium', 'Low']

export function PriorityBarChart({ data, height = 280 }) {
  const labels = ORDER.filter((l) => data[l] !== undefined)
  const values = labels.map((l) => data[l])

  return (
    <Plot
      data={[
        {
          type: 'bar',
          x: labels,
          y: values,
          marker: { color: labels.map((l) => priorityColors[l].text) },
          text: values.map(String),
          textposition: 'outside',
          hovertemplate: '%{x}: %{y} tasks<extra></extra>',
        },
      ]}
      layout={{
        height,
        margin: { t: 20, b: 30, l: 36, r: 10 },
        yaxis: { title: 'Tasks', gridcolor: 'rgba(148,163,184,0.12)', zeroline: false },
        xaxis: { title: '' },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { family: 'IBM Plex Sans', size: 11, color: '#CBD5E1' },
        bargap: 0.45,
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%' }}
      useResizeHandler
    />
  )
}

export function ScoreDistributionChart({ tasks, height = 280 }) {
  return (
    <Plot
      data={[
        {
          type: 'histogram',
          x: tasks.map((t) => t.priorityScore),
          xbins: { start: 0, end: 100, size: 5 },
          marker: { color: '#3B82F6' },
          hovertemplate: 'Score %{x}: %{y} tasks<extra></extra>',
        },
      ]}
      layout={{
        height,
        margin: { t: 20, b: 36, l: 36, r: 10 },
        xaxis: { title: 'AI Priority Score', gridcolor: 'rgba(148,163,184,0.12)' },
        yaxis: { title: 'Tasks', gridcolor: 'rgba(148,163,184,0.12)', zeroline: false },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { family: 'IBM Plex Sans', size: 11, color: '#CBD5E1' },
        bargap: 0.05,
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%' }}
      useResizeHandler
    />
  )
}

export function BeforeAfterChart({ before, after, height = 300 }) {
  const metrics = ['Total Blocks', 'Block Hours', 'Conflicts']
  const beforeVals = [before.totalBlocks, before.totalHours, before.conflicts]
  const afterVals = [after.totalBlocks, after.totalHours, after.conflicts]

  return (
    <Plot
      data={[
        {
          type: 'bar',
          name: 'Before Optimization',
          x: metrics,
          y: beforeVals,
          marker: { color: '#FB923C' },
          text: beforeVals.map(String),
          textposition: 'outside',
        },
        {
          type: 'bar',
          name: 'After AI Optimization',
          x: metrics,
          y: afterVals,
          marker: { color: '#3B82F6' },
          text: afterVals.map(String),
          textposition: 'outside',
        },
      ]}
      layout={{
        height,
        margin: { t: 20, b: 40, l: 40, r: 10 },
        barmode: 'group',
        legend: { orientation: 'h', y: -0.15, font: { size: 11, family: 'IBM Plex Sans' } },
        yaxis: { gridcolor: 'rgba(148,163,184,0.12)', zeroline: false },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { family: 'IBM Plex Sans', size: 11, color: '#CBD5E1' },
        bargap: 0.3,
        bargroupgap: 0.15,
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%' }}
      useResizeHandler
    />
  )
}
