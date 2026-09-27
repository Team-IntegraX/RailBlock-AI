import { useState } from 'react'
import { BrainCircuit } from 'lucide-react'
import Card from '../components/Card'
import TaskTable from '../components/TaskTable'
import TaskDetailDrawer from '../components/TaskDetailDrawer'
import { ScoreDistributionChart } from '../components/PriorityChart'
import { PageHeader, DemoDataNotice } from '../components/PageHeader'
import { maintenanceTasks, criticalTaskCount } from '../data/maintenanceTasks'

export default function Prioritization() {
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <PageHeader
        title="AI Prioritization"
        description="Every task is scored 0-100 from severity, safety impact, overdue time, traffic density and asset criticality."
        action={<DemoDataNotice />}
      />

      <div className="flex items-center gap-3 bg-rail-50 border border-rail-100 rounded-lg p-4 mb-4">
        <div className="w-9 h-9 rounded-md bg-rail-500 text-white flex items-center justify-center shrink-0">
          <BrainCircuit size={18} />
        </div>
        <p className="text-sm text-ink-700">
          The AI model has scored <span className="font-semibold text-ink-900">{maintenanceTasks.length}</span> maintenance
          tasks and identified <span className="font-semibold text-alert-critical">{criticalTaskCount} critical</span> tasks
          requiring an urgent block. Scores rank urgency only — block timing comes from the optimization engine.
        </p>
      </div>

      <Card title="AI Priority Score Distribution" subtitle="Count of tasks across the 0-100 score range" className="mb-4">
        <ScoreDistributionChart tasks={maintenanceTasks} />
      </Card>

      <Card title="Ranked Task List" subtitle="Sorted by AI priority score by default — click a row for the full explanation">
        <TaskTable tasks={maintenanceTasks} onSelectTask={setSelected} />
      </Card>

      <TaskDetailDrawer task={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
