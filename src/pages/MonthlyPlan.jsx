import Plot from 'react-plotly.js'
import Card from '../components/Card'
import KPICard from '../components/KPICard'
import AvailabilityChart from '../components/AvailabilityChart'
import UtilizationHeatmap from '../components/UtilizationHeatmap'
import { PageHeader, DemoDataNotice } from '../components/PageHeader'
import { ClipboardList, AlertOctagon, Clock, TrendingUp } from 'lucide-react'
import { departments, departmentColors } from '../data/sections'
import { maintenanceTasks, criticalTaskCount } from '../data/maintenanceTasks'
import { afterOptimization } from '../data/blockWindows'
import { WEEKS, planned, critical, capacity, utilization, availability, workload, utilizationHeatmap, sectionCodes } from '../data/monthlyPlan'

export default function MonthlyPlan() {
  const totalPlanned = planned.reduce((a, b) => a + b, 0)

  return (
    <div>
      <PageHeader
        title="Monthly Plan"
        description="Four-week rollup of planned maintenance, block capacity and asset availability for September 2026."
        action={<DemoDataNotice />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <KPICard label="Planned Maintenance" value={totalPlanned} unit="tasks" icon={ClipboardList} tint="rail" />
        <KPICard label="Critical Tasks" value={criticalTaskCount} icon={AlertOctagon} tint="critical" />
        <KPICard label="Avg. Block Capacity" value={Math.round(capacity.reduce((a, b) => a + b) / 4)} unit="hrs/wk" icon={Clock} tint="info" />
        <KPICard label="Asset Availability" value={afterOptimization.assetAvailability} unit="%" icon={TrendingUp} tint="rail" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card title="Maintenance Workload by Week" subtitle="Planned tasks vs. critical tasks, by week">
          <Plot
            data={[
              { type: 'bar', name: 'Planned Tasks', x: WEEKS, y: planned, marker: { color: '#3B82F6' } },
              { type: 'bar', name: 'Critical Tasks', x: WEEKS, y: critical, marker: { color: '#F87171' } },
            ]}
            layout={{
              height: 280,
              barmode: 'overlay',
              margin: { t: 20, b: 30, l: 36, r: 10 },
              legend: { orientation: 'h', y: -0.15, font: { size: 11 } },
              yaxis: { gridcolor: 'rgba(148,163,184,0.12)' },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { family: 'IBM Plex Sans', size: 11, color: '#CBD5E1' },
              bargap: 0.35,
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%' }}
            useResizeHandler
          />
        </Card>

        <Card title="Block Utilization" subtitle="Optimized block hours used vs. available capacity, by week">
          <Plot
            data={[
              { type: 'bar', name: 'Available Capacity', x: WEEKS, y: capacity, marker: { color: '#334155' } },
              { type: 'bar', name: 'Utilized Hours', x: WEEKS, y: utilization, marker: { color: '#3B82F6' } },
            ]}
            layout={{
              height: 280,
              barmode: 'overlay',
              margin: { t: 20, b: 30, l: 36, r: 10 },
              legend: { orientation: 'h', y: -0.15, font: { size: 11 } },
              yaxis: { title: 'hrs', gridcolor: 'rgba(148,163,184,0.12)' },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { family: 'IBM Plex Sans', size: 11, color: '#CBD5E1' },
              bargap: 0.35,
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%' }}
            useResizeHandler
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card title="Asset Availability Trend" subtitle="Weekly average across the division">
          <AvailabilityChart labels={WEEKS} values={availability} />
        </Card>

        <Card title="Department Workload" subtitle="Task volume by department, per week">
          <Plot
            data={departments.map((d, i) => ({
              type: 'bar',
              name: d,
              x: WEEKS,
              y: workload[i],
              marker: { color: departmentColors[d] },
            }))}
            layout={{
              height: 280,
              barmode: 'stack',
              margin: { t: 20, b: 30, l: 36, r: 10 },
              legend: { orientation: 'h', y: -0.15, font: { size: 11 } },
              yaxis: { gridcolor: 'rgba(148,163,184,0.12)' },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { family: 'IBM Plex Sans', size: 11, color: '#CBD5E1' },
              bargap: 0.35,
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%' }}
            useResizeHandler
          />
        </Card>
      </div>

      <Card title="Section Block Utilization Heatmap" subtitle="% of available block capacity used, by section and week">
        <UtilizationHeatmap rows={sectionCodes} columns={WEEKS} values={utilizationHeatmap} />
      </Card>

      <p className="text-xs text-ink-500 mt-4">
        Reference: {maintenanceTasks.length} total tasks currently open across the division this planning cycle.
      </p>
    </div>
  )
}
