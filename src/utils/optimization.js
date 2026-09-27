// Helpers that shape the block-schedule data for the Gantt chart, and a
// lightweight simulator for the What-If Analysis page. In a real system
// this logic would live behind the FastAPI optimization engine (OR-Tools /
// PuLP); here it's a transparent, deterministic stand-in over mock data.
import { beforeOptimization, afterOptimization } from '../data/blockWindows'

export function toRawGanttBlocks(rawBlocks) {
  return rawBlocks.map((b) => ({
    row: b.sectionName,
    department: b.department,
    startISO: `${b.date}T${b.startTime}`,
    durationHours: b.duration,
    taskId: b.blockId,
    priority: b.priority,
    sectionName: b.sectionName,
    startTime: b.startTime,
    endTime: b.endTime,
    reason: b.reason,
  }))
}

export function toOptimizedGanttBlocks(optimizedBlocks) {
  const out = []
  optimizedBlocks.forEach((b) => {
    b.tasks.forEach((t) => {
      out.push({
        row: b.sectionName,
        department: t.department,
        startISO: `${b.date}T${b.startTime}`,
        durationHours: b.duration,
        taskId: b.blockId,
        priority: b.priority,
        sectionName: b.sectionName,
        startTime: b.startTime,
        endTime: b.endTime,
        reason: b.coordinated ? `${t.reason} (coordinated block)` : t.reason,
      })
    })
  })
  return out
}

// Flattens the nested `departments`/`tasks` arrays on an optimized block
// into plain string fields so the record is CSV/table friendly for exports
// and report previews.
export function flattenOptimizedBlocks(optimizedBlocks) {
  return optimizedBlocks.map((b) => ({
    blockId: b.blockId,
    date: b.date,
    sectionName: b.sectionName,
    departments: b.departments.join('; '),
    coordinated: b.coordinated,
    startTime: b.startTime,
    endTime: b.endTime,
    duration: b.duration,
    priority: b.priority,
    tasks: b.tasks.map((t) => `${t.department}: ${t.reason} (${t.duration}h)`).join(' | '),
  }))
}

/**
 * Simple, explainable scenario model for What-If Analysis: starts from the
 * "after optimization" baseline and nudges block hours / conflicts based on
 * the sliders, so the direction of every change stays intuitive.
 */
export function runScenario({ blockDuration, trafficDensity, taskCount, priorityThreshold, workingHours }) {
  const base = afterOptimization

  const durationFactor = blockDuration / 3 // baseline block ~3 hrs
  const trafficFactor = trafficDensity / 50 // baseline ~50 (medium)
  const taskFactor = taskCount / 248
  const thresholdRelief = (priorityThreshold - 40) / 100 // higher threshold = fewer tasks compete for blocks
  const hoursFactor = 8 / workingHours // baseline 8 working hours/night

  let hours = base.totalHours * durationFactor * taskFactor * hoursFactor * (1 - thresholdRelief * 0.3)
  let conflicts = base.conflicts * trafficFactor * taskFactor * (1 - thresholdRelief * 0.5) * hoursFactor
  let availability = base.assetAvailability - (hours - base.totalHours) * 0.03 + thresholdRelief * 1.5

  hours = Math.max(40, Math.round(hours))
  conflicts = Math.max(0, Math.round(conflicts))
  availability = Math.min(99.5, Math.max(85, Math.round(availability * 10) / 10))
  const blocks = Math.max(10, Math.round(base.totalBlocks * taskFactor * hoursFactor))

  return {
    totalBlocks: blocks,
    totalHours: hours,
    conflicts,
    assetAvailability: availability,
  }
}

export const currentPlanScenario = {
  label: 'Scenario A — Current Plan',
  totalBlocks: beforeOptimization.totalBlocks,
  totalHours: beforeOptimization.totalHours,
  conflicts: beforeOptimization.conflicts,
  assetAvailability: beforeOptimization.assetAvailability,
}
