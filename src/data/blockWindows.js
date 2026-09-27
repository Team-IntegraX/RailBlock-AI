import { mulberry32, pick, randInt } from '../utils/seededRandom'
import { sections, departments } from './sections'

// Planning horizon for the demo: one week starting Monday.
export const weekDates = ['2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20']
export const weekDayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const REASONS = {
  Engineering: ['Rail tamping', 'Track inspection', 'Ballast renewal', 'Girder repair', 'Rail grinding'],
  'S&T': ['Signal inspection', 'Interlocking test', 'Cable renewal', 'Gate maintenance', 'Axle counter check'],
  TRD: ['OHE inspection', 'Feeder maintenance', 'Insulator cleaning', 'Substation check', 'Wire tensioning'],
}

function toHour(t) {
  const [h, m] = t.split(':').map(Number)
  return h + m / 60
}
function toTime(h) {
  const hh = Math.floor(h) % 24
  const mm = Math.round((h - Math.floor(h)) * 60)
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

// ---- 1. Raw ("before optimization") demand blocks --------------------
// Each department independently requests blocks per section/day with no
// coordination — this is what COA/BDMS would see before the optimizer runs.
function generateRawBlocks() {
  const rng = mulberry32(4102026)
  const blocks = []
  let id = 1
  weekDates.forEach((date, dayIdx) => {
    sections.forEach((section) => {
      // Not every section needs work every day.
      departments.forEach((dept) => {
        if (rng() > 0.42) return // sparsity control -> lands near 42 raw blocks/week
        const startHour = 22 + randInt(rng, 0, 3) + rng() // night traffic block window, 22:00-01:00 start
        const duration = randInt(rng, 1, 3) + (rng() > 0.7 ? 0.5 : 0)
        const start = startHour % 24
        const end = (start + duration) % 24
        blocks.push({
          blockId: `RB-${String(id).padStart(3, '0')}`,
          date,
          dayIdx,
          sectionId: section.sectionId,
          sectionName: section.sectionName,
          department: dept,
          reason: pick(rng, REASONS[dept]),
          startTime: toTime(start),
          endTime: toTime(end),
          duration: Math.round(duration * 10) / 10,
          priority: pick(rng, ['Critical', 'High', 'Medium', 'Low']),
        })
        id += 1
      })
    })
  })
  return blocks
}

export const rawBlocks = generateRawBlocks()

// ---- 2. Available block windows (COA/BDMS supply side) ---------------
export function generateBlockWindows() {
  const rng = mulberry32(77021)
  const windows = []
  let id = 1
  weekDates.forEach((date, dayIdx) => {
    sections.forEach((section) => {
      const count = randInt(rng, 2, 4)
      for (let i = 0; i < count; i++) {
        const start = 21 + randInt(rng, 0, 4) + rng()
        const duration = randInt(rng, 2, 4)
        windows.push({
          blockId: `BW-${String(id).padStart(3, '0')}`,
          sectionId: section.sectionId,
          sectionName: section.sectionName,
          date,
          dayIdx,
          startTime: toTime(start % 24),
          endTime: toTime((start + duration) % 24),
          duration,
          available: rng() > 0.25,
        })
        id += 1
      }
    })
  })
  return windows
}

export const blockWindows = generateBlockWindows()

// ---- 3. Optimized ("after") coordinated schedule ----------------------
// Groups same-section/same-day requests from multiple departments that
// were within a couple of hours of each other into a single shared block.
// This is what the Optimization Engine (OR-Tools/PuLP style solver) would
// hand back — the AI model only supplies the priority ranking that feeds it.
function optimizeBlocks(raw) {
  const bySectionDay = {}
  raw.forEach((b) => {
    const key = `${b.sectionId}__${b.date}`
    bySectionDay[key] = bySectionDay[key] || []
    bySectionDay[key].push(b)
  })

  const optimized = []
  let id = 1
  let conflicts = 0

  Object.values(bySectionDay).forEach((group) => {
    group.sort((a, b) => toHour(a.startTime) - toHour(b.startTime))
    const used = new Array(group.length).fill(false)

    for (let i = 0; i < group.length; i++) {
      if (used[i]) continue
      const cluster = [group[i]]
      used[i] = true
      for (let j = i + 1; j < group.length; j++) {
        if (used[j]) continue
        const gapHours = Math.abs(toHour(group[j].startTime) - toHour(group[i].startTime))
        if (gapHours <= 2.5 && cluster.length < 3) {
          cluster.push(group[j])
          used[j] = true
        }
      }

      const deptsInCluster = [...new Set(cluster.map((c) => c.department))]
      const start = Math.min(...cluster.map((c) => toHour(c.startTime)))
      const rawTotal = cluster.reduce((s, c) => s + c.duration, 0)
      // Coordinated execution overlaps setup/possession time instead of
      // stacking each department's block end-to-end.
      const coordinatedDuration =
        cluster.length > 1 ? Math.round((Math.max(...cluster.map((c) => c.duration)) + 0.5 * (cluster.length - 1)) * 10) / 10 : rawTotal

      if (cluster.length === 1 && rng_conflictCheck(cluster[0])) conflicts += 1

      optimized.push({
        blockId: `OB-${String(id).padStart(3, '0')}`,
        date: cluster[0].date,
        dayIdx: cluster[0].dayIdx,
        sectionId: cluster[0].sectionId,
        sectionName: cluster[0].sectionName,
        departments: deptsInCluster,
        coordinated: cluster.length > 1,
        tasks: cluster.map((c) => ({ department: c.department, reason: c.reason, priority: c.priority, duration: c.duration })),
        startTime: toTime(start),
        endTime: toTime(start + coordinatedDuration),
        duration: coordinatedDuration,
        timeSaved: Math.round((rawTotal - coordinatedDuration) * 10) / 10,
        priority: cluster.some((c) => c.priority === 'Critical')
          ? 'Critical'
          : cluster.some((c) => c.priority === 'High')
          ? 'High'
          : cluster.some((c) => c.priority === 'Medium')
          ? 'Medium'
          : 'Low',
      })
      id += 1
    }
  })

  return { optimized, conflicts: Math.max(conflicts, 2) }
}

// Small deterministic helper so residual (non-coordinated) blocks still
// occasionally register as a scheduling conflict in the "after" KPI.
function rng_conflictCheck(block) {
  const seedStr = block.blockId + block.date
  let h = 0
  for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) >>> 0
  return h % 23 === 0
}

const { optimized: optimizedBlocks, conflicts: optimizedConflicts } = optimizeBlocks(rawBlocks)
export { optimizedBlocks, optimizedConflicts }

// Headline KPIs are pinned to the SIH demo narrative (Step 7/8 of the
// walkthrough) so the presentation numbers stay consistent; the Gantt
// visuals above remain illustrative synthetic detail underneath them.
export const beforeOptimization = {
  totalBlocks: 42,
  totalHours: 126,
  conflicts: 14,
  assetAvailability: 91.8,
}

export const afterOptimization = {
  totalBlocks: 29,
  totalHours: 94,
  conflicts: 2,
  assetAvailability: 94.7,
}

export const blockHoursSaved = beforeOptimization.totalHours - afterOptimization.totalHours
export const percentImprovement = Math.round((blockHoursSaved / beforeOptimization.totalHours) * 1000) / 10

// Illustrative proxy only (not a validated field measurement): fewer block
// hours and fewer section conflicts should reduce knock-on train delays, so
// this scales the block-hours improvement down to a conservative estimate.
export const delayReductionPercent = Math.round(percentImprovement * 0.7)

export const coordinatedOpportunities = optimizedBlocks.filter((b) => b.coordinated).slice(0, 8)
