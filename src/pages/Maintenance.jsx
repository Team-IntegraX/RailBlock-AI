import { useState } from 'react'
import Card from '../components/Card'
import TaskTable from '../components/TaskTable'
import TaskDetailDrawer from '../components/TaskDetailDrawer'
import DepartmentChart from '../components/DepartmentChart'
import { PriorityBarChart } from '../components/PriorityChart'
import { PageHeader, DemoDataNotice } from '../components/PageHeader'
import { maintenanceTasks, tasksByDepartment, tasksByPriority } from '../data/maintenanceTasks'

export default function Maintenance() {
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <PageHeader
        title="Maintenance Tasks"
        description="Consolidated maintenance backlog pulled from TMS, SMMS and TDMS before AI prioritization."
        action={<DemoDataNotice />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card title="Tasks by Department">
          <DepartmentChart data={tasksByDepartment} height={220} />
        </Card>
        <Card title="Tasks by Priority">
          <PriorityBarChart data={tasksByPriority} height={220} />
        </Card>
      </div>

      <Card title="All Maintenance Tasks" subtitle="Click a row to see the AI priority breakdown">
        <TaskTable tasks={maintenanceTasks} onSelectTask={setSelected} />
      </Card>

      <TaskDetailDrawer task={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
