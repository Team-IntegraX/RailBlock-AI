import Plot from 'react-plotly.js'

/**
 * Block-utilization heatmap: sections (rows) x weeks (columns), colored by
 * % of available capacity used. Built on Plotly's heatmap trace with a
 * blue->amber->red scale so over-utilized sections pop visually.
 */
export default function UtilizationHeatmap({ rows, columns, values, height = 260 }) {
  return (
    <Plot
      data={[
        {
          type: 'heatmap',
          z: values,
          x: columns,
          y: rows,
          zmin: 40,
          zmax: 100,
          colorscale: [
            [0, '#1E293B'],
            [0.5, '#2563EB'],
            [0.8, '#F59E0B'],
            [1, '#EF4444'],
          ],
          showscale: true,
          colorbar: { thickness: 10, len: 0.9, tickfont: { size: 10, color: '#94A3B8' } },
          hovertemplate: '%{y} &middot; %{x}<br>Utilization: %{z}%<extra></extra>',
          xgap: 4,
          ygap: 4,
        },
      ]}
      layout={{
        height,
        margin: { t: 10, b: 30, l: 70, r: 10 },
        xaxis: { side: 'bottom', gridcolor: 'rgba(148,163,184,0.1)' },
        yaxis: { automargin: true, gridcolor: 'rgba(148,163,184,0.1)' },
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
