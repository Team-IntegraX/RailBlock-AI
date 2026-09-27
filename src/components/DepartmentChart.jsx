import Plot from 'react-plotly.js'
import { departmentColors } from '../data/sections'

export default function DepartmentChart({ data, height = 280 }) {
  const labels = Object.keys(data)
  const values = Object.values(data)

  return (
    <Plot
      data={[
        {
          type: 'pie',
          hole: 0.62,
          labels,
          values,
          marker: { colors: labels.map((l) => departmentColors[l] || '#9AA3AB') },
          textinfo: 'label+percent',
          textfont: { size: 11, color: '#CBD5E1', family: 'IBM Plex Sans' },
          hovertemplate: '%{label}: %{value} tasks (%{percent})<extra></extra>',
          sort: false,
        },
      ]}
      layout={{
        height,
        margin: { t: 10, b: 10, l: 10, r: 10 },
        showlegend: true,
        legend: { orientation: 'h', y: -0.1, font: { size: 11, family: 'IBM Plex Sans' } },
        annotations: [
          {
            text: `${values.reduce((a, b) => a + b, 0)}<br>Tasks`,
            showarrow: false,
            font: { size: 15, color: '#F1F5F9', family: 'IBM Plex Sans' },
          },
        ],
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { family: 'IBM Plex Sans' },
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%' }}
      useResizeHandler
    />
  )
}
