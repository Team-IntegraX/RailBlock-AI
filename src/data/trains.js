import { mulberry32, pick, randInt } from '../utils/seededRandom'
import { sections } from './sections'

const TRAIN_TYPES = ['Express', 'Passenger', 'Freight', 'Suburban']

function generateTrains() {
  const rng = mulberry32(551223)
  const trains = []
  sections.forEach((section, sIdx) => {
    const count = Math.max(4, Math.round(section.dailyTrainCount / 10))
    for (let i = 0; i < count; i++) {
      const depHour = randInt(rng, 4, 23)
      trains.push({
        trainId: `${12000 + sIdx * 100 + i}`,
        trainType: pick(rng, TRAIN_TYPES),
        sectionId: section.sectionId,
        arrivalTime: `${String(depHour).padStart(2, '0')}:${pick(rng, ['00', '15', '30', '45'])}`,
        departureTime: `${String((depHour + 1) % 24).padStart(2, '0')}:${pick(rng, ['00', '15', '30', '45'])}`,
        priority: pick(rng, ['High', 'Medium', 'Low']),
      })
    }
  })
  return trains
}

export const trains = generateTrains()
