// Weighted priority scoring used by the AI Prioritization page.
// This mirrors what a trained model would output, but is computed
// transparently here from mock feature values so the demo can explain
// every score (see AI Explainability panel).
export const PRIORITY_WEIGHTS = {
  severity: 0.3,
  safetyImpact: 0.25,
  overdueDays: 0.2,
  trafficDensity: 0.15,
  assetCriticality: 0.1,
}

const LEVEL_SCORE = { Low: 30, Medium: 60, High: 85, Critical: 100 }

export function overdueScore(days) {
  // Saturates at 30 days overdue = 100
  return Math.min(100, Math.round((days / 30) * 100))
}

export function computeFactorScores(task) {
  return {
    severity: LEVEL_SCORE[task.severity] ?? 50,
    safetyImpact: LEVEL_SCORE[task.safetyImpact] ?? 50,
    overdueDays: overdueScore(task.daysOpen),
    trafficDensity: LEVEL_SCORE[task.trafficDensity] ?? 50,
    assetCriticality: task.assetCriticality,
  }
}

export function computePriorityScore(task) {
  const f = computeFactorScores(task)
  const score =
    f.severity * PRIORITY_WEIGHTS.severity +
    f.safetyImpact * PRIORITY_WEIGHTS.safetyImpact +
    f.overdueDays * PRIORITY_WEIGHTS.overdueDays +
    f.trafficDensity * PRIORITY_WEIGHTS.trafficDensity +
    f.assetCriticality * PRIORITY_WEIGHTS.assetCriticality
  return Math.round(score * 10) / 10
}

export function scoreToPriority(score) {
  if (score >= 85) return 'Critical'
  if (score >= 65) return 'High'
  if (score >= 40) return 'Medium'
  return 'Low'
}

export function explainTask(task) {
  const f = computeFactorScores(task)
  const contributions = [
    { label: 'Severity', weight: PRIORITY_WEIGHTS.severity, value: f.severity },
    { label: 'Safety Impact', weight: PRIORITY_WEIGHTS.safetyImpact, value: f.safetyImpact },
    { label: 'Overdue Days', weight: PRIORITY_WEIGHTS.overdueDays, value: f.overdueDays },
    { label: 'Traffic Density', weight: PRIORITY_WEIGHTS.trafficDensity, value: f.trafficDensity },
    { label: 'Asset Criticality', weight: PRIORITY_WEIGHTS.assetCriticality, value: f.assetCriticality },
  ]
  const reasons = []
  if (task.trafficDensity === 'High') reasons.push('affects a high-traffic corridor')
  if (task.safetyImpact === 'High' || task.safetyImpact === 'Critical') reasons.push('has a high safety impact')
  if (task.daysOpen >= 14) reasons.push(`has been overdue for ${task.daysOpen} days`)
  if (task.severity === 'Critical') reasons.push('is flagged as a critical-severity defect')

  const summary = reasons.length
    ? `This task has been ranked ${task.priority} because it ${reasons.join(', ')}.`
    : `This task has been ranked ${task.priority} based on its combined severity, safety and overdue-time profile.`

  return { contributions, summary }
}
