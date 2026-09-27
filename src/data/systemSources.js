import { tasksByDepartment } from './maintenanceTasks'

export const systemSources = [
  {
    code: 'TMS',
    name: 'Track Management System',
    department: 'Engineering / Track Maintenance',
    status: 'Connected · Demo Data',
    records: tasksByDepartment['Engineering'] || 0,
    lastSync: '2026-09-10 06:00 IST',
  },
  {
    code: 'SMMS',
    name: 'Signal Maintenance Management System',
    department: 'Signal & Telecom Maintenance',
    status: 'Connected · Demo Data',
    records: tasksByDepartment['S&T'] || 0,
    lastSync: '2026-09-10 06:00 IST',
  },
  {
    code: 'TDMS',
    name: 'Traction Distribution Management System',
    department: 'Traction / OHE Maintenance',
    status: 'Connected · Demo Data',
    records: tasksByDepartment['TRD'] || 0,
    lastSync: '2026-09-10 06:00 IST',
  },
  {
    code: 'COA / BDMS',
    name: 'Block Demand Management System',
    department: 'Block & Operational Data',
    status: 'Connected · Demo Data',
    records: 96,
    lastSync: '2026-09-10 05:45 IST',
  },
]
