import { mulberry32, randInt } from '../utils/seededRandom'
import { departments } from './sections'
import { criticalTaskCount } from './maintenanceTasks'

export const WEEKS = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

// Sections used as heatmap rows for weekly block-utilization %.
const SECTION_CODES = ['NED-A1', 'NED-A2', 'NED-A3', 'NED-A4', 'NED-A5']

function buildMonthlyData() {
  const rng = mulberry32(9092026)
  const planned = WEEKS.map(() => randInt(rng, 52, 70))
  // distribute the real critical count across 4 weeks
  const criticalShares = [0.35, 0.25, 0.2, 0.2]
  const critical = criticalShares.map((s) => Math.round(criticalTaskCount * s))
  const capacity = WEEKS.map(() => randInt(rng, 88, 104))
  const utilization = WEEKS.map(() => randInt(rng, 68, 84))
  const availability = WEEKS.map(() => Math.round((90 + rng() * 6) * 10) / 10)
  const workload = departments.map(() => WEEKS.map(() => randInt(rng, 10, 34)))
  // section x week utilization %, for the heatmap
  const utilizationHeatmap = SECTION_CODES.map(() => WEEKS.map(() => randInt(rng, 55, 98)))

  return { planned, critical, capacity, utilization, availability, workload, utilizationHeatmap }
}

export const { planned, critical, capacity, utilization, availability, workload, utilizationHeatmap } =
  buildMonthlyData()
export const sectionCodes = SECTION_CODES
