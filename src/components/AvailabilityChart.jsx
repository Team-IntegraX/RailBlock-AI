import Plot from 'react-plotly.js'

export default function AvailabilityChart({ labels, values, height = 280, compareValues, compareLabel }) {
  const traces = [
    {
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Asset Availability',
      x: labels,
      y: values,
      line: { color: '#3B82F6', width: 2.5, shape: 'spline' },
      marker: { size: 6, color: '#3B82F6' },
      hovertemplate: '%{x}: %{y}%<extra></extra>',
    },
  ]
  if (compareValues) {
    traces.push({
      type: 'scatter',
      mode: 'lines+markers',
      name: compareLabel || 'Baseline',
      x: labels,
      y: compareValues,
      line: { color: '#9AA3AB', width: 2, dash: 'dot' },
      marker: { size: 5, color: '#9AA3AB' },
      hovertemplate: '%{x}: %{y}%<extra></extra>',
    })
  }

  return (
    <Plot
      data={traces}
      layout={{
        height,
        margin: { t: 20, b: 36, l: 40, r: 10 },
        yaxis: { title: '%', gridcolor: 'rgba(148,163,184,0.12)', range: [85, 100] },
        xaxis: { gridcolor: 'rgba(148,163,184,0.08)' },
        legend: compareValues ? { orientation: 'h', y: -0.2, font: { size: 11 } } : undefined,
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { family: 'IBM Plex Sans', size: 11, color: '#CBD5E1' },
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%' }}
      useResizeHandler
    />
  )
}
