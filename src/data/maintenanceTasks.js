import { mulberry32, pick, randInt } from '../utils/seededRandom'
import { computePriorityScore, scoreToPriority } from '../utils/priority'
import { sections } from './sections'

// Synthetic feed standing in for TMS (Engineering), SMMS (S&T) and TDMS (TRD).
// Counts are fixed to match the SIH demo narrative: 110 Engineering,
// 72 S&T and 66 TRD tasks = 248 total, with roughly 18 landing Critical.
const ASSET_TYPES = {
  Engineering: ['Rail Track', 'Rail Joint', 'Bridge Girder', 'Points & Crossing', 'Ballast Section'],
  'S&T': ['Signal Unit', 'Interlocking System', 'Telecom Cable', 'Level Crossing Gate', 'Axle Counter'],
  TRD: ['OHE Mast', 'Traction Substation', 'Feeder Line', 'Circuit Breaker', 'OHE Wire'],
}

const DEPT_COUNTS = { Engineering: 110, 'S&T': 72, TRD: 66 }
const SOURCE_SYSTEM = { Engineering: 'TMS', 'S&T': 'SMMS', TRD: 'TDMS' }
const LEVELS = ['Low', 'Medium', 'High', 'Critical']
// Weighted so most tasks land Medium/High, with a thin Critical tail
// (~7% of 248 ≈ 18 tasks) once combined with overdue/safety factors.
const SEVERITY_WEIGHTS = [0.22, 0.4, 0.31, 0.07]

function weightedLevel(rng, weights = SEVERITY_WEIGHTS) {
  const r = rng()
  let acc = 0
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i]
    if (r <= acc) return LEVELS[i]
  }
  return LEVELS[LEVELS.length - 1]
}

function generateTasks() {
  const rng = mulberry32(20260927) // seeded on the SIH 2026 grand finale date
  const tasks = []
  let counter = 1000

  Object.entries(DEPT_COUNTS).forEach(([department, count]) => {
    const prefix = { Engineering: 'ENG', 'S&T': 'SNT', TRD: 'TRD' }[department]
    for (let i = 0; i < count; i++) {
      counter += 1
      const severity = weightedLevel(rng)
      const safetyImpact = weightedLevel(rng, [0.25, 0.35, 0.3, 0.1])
      const trafficDensity = weightedLevel(rng, [0.2, 0.35, 0.35, 0.1])
      const daysOpen = randInt(rng, 1, 45)
      const assetCriticality = randInt(rng, 20, 100)
      const section = pick(rng, sections)
      const assetType = pick(rng, ASSET_TYPES[department])
      const estimatedDuration = randInt(rng, 1, 6) // hours

      const task = {
        taskId: `${prefix}-${counter}`,
        sourceSystem: SOURCE_SYSTEM[department],
        department,
        assetId: `${section.sectionId}-${assetType.slice(0, 3).toUpperCase()}-${randInt(rng, 100, 999)}`,
        assetType,
        sectionId: section.sectionId,
        sectionName: section.sectionName,
        severity,
        daysOpen,
        overdue: daysOpen > 14,
        safetyImpact,
        trafficDensity,
        estimatedDuration,
        assetCriticality,
      }
      task.priorityScore = computePriorityScore(task)
      task.priority = scoreToPriority(task.priorityScore)
      tasks.push(task)
    }
  })

  // Sort by score descending so "top of the list" reads as most urgent.
  return tasks.sort((a, b) => b.priorityScore - a.priorityScore)
}

export const maintenanceTasks = generateTasks()

export const criticalTaskCount = maintenanceTasks.filter((t) => t.priority === 'Critical').length

export const tasksByDepartment = maintenanceTasks.reduce((acc, t) => {
  acc[t.department] = (acc[t.department] || 0) + 1
  return acc
}, {})

export const tasksByPriority = maintenanceTasks.reduce((acc, t) => {
  acc[t.priority] = (acc[t.priority] || 0) + 1
  return acc
}, {})
