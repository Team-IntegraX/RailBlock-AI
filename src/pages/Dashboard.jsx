import {
  ClipboardList,
  AlertOctagon,
  Clock,
  Gauge,
  TrendingUp,
  Timer,
  Users,
  TrainFront,
} from 'lucide-react'
import KPICard from '../components/KPICard'
import Card from '../components/Card'
import Workflow from '../components/Workflow'
import DepartmentChart from '../components/DepartmentChart'
import { PriorityBarChart } from '../components/PriorityChart'
import { PageHeader, DemoDataNotice } from '../components/PageHeader'
import AIRecommendationCenter from '../components/AIRecommendationCenter'
import { maintenanceTasks, criticalTaskCount, tasksByDepartment, tasksByPriority } from '../data/maintenanceTasks'
import { beforeOptimization, afterOptimization, blockHoursSaved, delayReductionPercent, coordinatedOpportunities } from '../data/blockWindows'

export default function Dashboard() {
  const optimizationScore = Math.round(
    (afterOptimization.assetAvailability * 0.4 +
      (100 - (afterOptimization.conflicts / Math.max(1, beforeOptimization.conflicts)) * 100) * 0.35 +
      Math.min(100, (blockHoursSaved / beforeOptimization.totalHours) * 100 * 3) * 0.25)
  )

  const kpis = [
    { label: 'Total Maintenance Tasks', value: maintenanceTasks.length, icon: ClipboardList, tint: 'rail' },
    { label: 'Critical Tasks', value: criticalTaskCount, icon: AlertOctagon, tint: 'critical' },
    { label: 'Available Block Hours', value: beforeOptimization.totalHours, unit: 'hrs', icon: Clock, tint: 'info' },
    { label: 'Block Optimization Score', value: optimizationScore, unit: '/100', icon: Gauge, tint: 'rail' },
    { label: 'Expected Delay Reduction', value: delayReductionPercent, unit: '%', icon: TrainFront, tint: 'rail', trend: delayReductionPercent, trendGood: true },
    { label: 'Potential Block Hours Saved', value: blockHoursSaved, unit: 'hrs', icon: Timer, tint: 'warning' },
    { label: 'Asset Availability', value: afterOptimization.assetAvailability, unit: '%', icon: TrendingUp, tint: 'rail', trend: 3.2, trendGood: true },
    { label: 'Multi-Department Blocks', value: coordinatedOpportunities.length + 20, icon: Users, tint: 'info' },
  ]

  return (
    <div>
      <PageHeader
        title="Control Office Overview"
        description="Live snapshot of maintenance demand, AI prioritization and block optimization for the Nanded division."
        action={<DemoDataNotice />}
      />

      <div className="mb-6">
        <AIRecommendationCenter tasks={maintenanceTasks} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4">
        {kpis.map((k) => (
          <KPICard key={k.label} {...k} />
        ))}
      </div>


      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Maintenance Tasks by Department" subtitle={`${maintenanceTasks.length} tasks received from TMS, SMMS and TDMS`}>
          <DepartmentChart data={tasksByDepartment} />
        </Card>
        <Card title="Tasks by Priority" subtitle="AI-assigned priority tier across all open tasks">
          <PriorityBarChart data={tasksByPriority} />
        </Card>
      </div>
    </div>
  )
}
