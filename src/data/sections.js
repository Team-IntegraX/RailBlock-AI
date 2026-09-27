// Mock railway section master data for the Nanded division corridor.
// sectionId maps stations along a single demo corridor (A -> E).
export const sections = [
  {
    sectionId: 'NED-A1',
    sectionName: 'Nanded Jn — Mudkhed',
    zone: 'South Central Railway',
    lengthKm: 22.4,
    dailyTrainCount: 68,
    trafficDensity: 'High',
    lineType: 'Double Electrified',
  },
  {
    sectionId: 'NED-A2',
    sectionName: 'Mudkhed — Umri',
    zone: 'South Central Railway',
    lengthKm: 18.1,
    dailyTrainCount: 54,
    trafficDensity: 'High',
    lineType: 'Double Electrified',
  },
  {
    sectionId: 'NED-A3',
    sectionName: 'Umri — Aurangabad',
    zone: 'South Central Railway',
    lengthKm: 31.7,
    dailyTrainCount: 41,
    trafficDensity: 'Medium',
    lineType: 'Single Electrified',
  },
  {
    sectionId: 'NED-A4',
    sectionName: 'Aurangabad — Jalna',
    zone: 'South Central Railway',
    lengthKm: 27.9,
    dailyTrainCount: 33,
    trafficDensity: 'Medium',
    lineType: 'Single Electrified',
  },
  {
    sectionId: 'NED-A5',
    sectionName: 'Jalna — Parbhani',
    zone: 'South Central Railway',
    lengthKm: 19.6,
    dailyTrainCount: 25,
    trafficDensity: 'Low',
    lineType: 'Single Non-Electrified',
  },
]

// Friendly short labels used on the corridor schematic (Station A..E)
export const corridorStations = [
  { code: 'NED', name: 'Nanded Jn' },
  { code: 'MUE', name: 'Mudkhed' },
  { code: 'UMR', name: 'Umri' },
  { code: 'AWB', name: 'Aurangabad' },
  { code: 'J', name: 'Jalna' },
  { code: 'PBN', name: 'Parbhani' },
]

export const departments = ['Engineering', 'S&T', 'TRD']

export const departmentColors = {
  Engineering: '#34D399', // emerald - reads clearly on dark navy
  'S&T': '#60A5FA', // info blue
  TRD: '#FB923C', // amber-orange
}

export const priorityColors = {
  Critical: { text: '#F87171', bg: 'rgba(239,68,68,0.14)' },
  High: { text: '#FB923C', bg: 'rgba(245,158,11,0.14)' },
  Medium: { text: '#FDE68A', bg: 'rgba(245,158,11,0.10)' },
  Low: { text: '#4ADE80', bg: 'rgba(34,197,94,0.14)' },
}
