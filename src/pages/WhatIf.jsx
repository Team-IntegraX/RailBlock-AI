import { useState } from 'react'
import { FlaskConical, Play } from 'lucide-react'
import Card from '../components/Card'
import { BeforeAfterChart } from '../components/PriorityChart'
import { PageHeader, DemoDataNotice } from '../components/PageHeader'
import { useToast } from '../components/Toast'
import { runScenario, currentPlanScenario } from '../utils/optimization'
import { afterOptimization } from '../data/blockWindows'

export default function WhatIf() {
  const { showToast } = useToast()
  const [blockDuration, setBlockDuration] = useState(3)
  const [trafficDensity, setTrafficDensity] = useState(50)
  const [taskCount, setTaskCount] = useState(248)
  const [priorityThreshold, setPriorityThreshold] = useState(65)
  const [workingHours, setWorkingHours] = useState(8)
  const [scenarioB, setScenarioB] = useState(afterOptimization)
  const [hasRun, setHasRun] = useState(false)

  function handleRun() {
    const result = runScenario({ blockDuration, trafficDensity, taskCount, priorityThreshold, workingHours })
    setScenarioB(result)
    setHasRun(true)
    showToast('Scenario re-optimized with your parameters.', 'info')
  }

  return (
    <div>
      <PageHeader
        title="What-If Scenario Planning"
        description="Adjust block and traffic parameters to see how the optimizer would respond."
        action={<DemoDataNotice />}
      />

      <Card title="Scenario Parameters" className="mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SliderField label="Block Duration" value={blockDuration} onChange={setBlockDuration} min={1} max={6} step={0.5} unit="hrs" />
          <SliderField label="Traffic Density" value={trafficDensity} onChange={setTrafficDensity} min={10} max={100} step={5} unit="/100" />
          <SliderField label="Number of Maintenance Tasks" value={taskCount} onChange={setTaskCount} min={100} max={320} step={10} unit="tasks" />
          <SliderField label="Priority Threshold" value={priorityThreshold} onChange={setPriorityThreshold} min={30} max={90} step={5} unit="score" />
          <SliderField label="Available Working Hours" value={workingHours} onChange={setWorkingHours} min={4} max={12} step={1} unit="hrs/night" />
        </div>
        <button
          onClick={handleRun}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white bg-rail-600 hover:bg-rail-700 rounded-md px-4 py-2 focus-ring"
        >
          <Play size={15} />
          Run Scenario
        </button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <ScenarioCard title="Scenario A — Current Plan" data={currentPlanScenario} tone="warning" />
        <ScenarioCard
          title="Scenario B — AI Optimized"
          data={scenarioB}
          tone="rail"
          note={hasRun ? undefined : 'Showing the default optimized plan — adjust parameters and run a scenario.'}
        />
      </div>

      <Card title="Scenario Comparison">
        <BeforeAfterChart before={currentPlanScenario} after={scenarioB} />
      </Card>
    </div>
  )
}

function SliderField({ label, value, onChange, min, max, step, unit }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-ink-700">{label}</label>
        <span className="text-xs font-mono text-ink-900">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-rail-600"
      />
    </div>
  )
}

function ScenarioCard({ title, data, tone, note }) {
  const accent = tone === 'rail' ? 'border-rail-500/30 bg-rail-50' : 'border-alert-highBorder bg-alert-highBg'
  return (
    <div className={`rounded-lg border p-4 ${accent}`}>
      <div className="flex items-center gap-2 mb-3">
        <FlaskConical size={16} className={tone === 'rail' ? 'text-rail-500' : 'text-alert-high'} />
        <h4 className="text-sm font-semibold text-ink-900">{title}</h4>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Block Hours" value={`${data.totalHours} hrs`} />
        <Metric label="Total Blocks" value={data.totalBlocks} />
        <Metric label="Conflicts" value={data.conflicts} />
        <Metric label="Asset Availability" value={`${data.assetAvailability}%`} />
      </div>
      {note && <p className="text-[11px] text-ink-500 mt-3">{note}</p>}
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-ink-500">{label}</p>
      <p className="text-base font-semibold text-ink-900 mt-0.5">{value}</p>
    </div>
  )
}
