import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import { ToastProvider } from './components/Toast'

import Dashboard from './pages/Dashboard'
import Maintenance from './pages/Maintenance'
import Prioritization from './pages/Prioritization'
import BlockPlanner from './pages/BlockPlanner'
import WeeklyPlan from './pages/WeeklyPlan'
import MonthlyPlan from './pages/MonthlyPlan'
import Corridor from './pages/Corridor'
import WhatIf from './pages/WhatIf'
import Reports from './pages/Reports'
import SystemData from './pages/SystemData'

const TITLES = {
  '/': 'Dashboard',
  '/maintenance': 'Maintenance Tasks',
  '/prioritization': 'AI Prioritization',
  '/block-planner': 'Block Planner',
  '/weekly-plan': 'Weekly Plan',
  '/monthly-plan': 'Monthly Plan',
  '/corridor': 'Corridor View',
  '/what-if': 'What-If Analysis',
  '/reports': 'Reports',
  '/system-data': 'System Data',
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const title = TITLES[location.pathname] || 'RailBlock AI'

  return (
    <ToastProvider>
      <div className="min-h-screen bg-app">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div className={`transition-all duration-200 ${collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}`}>
          <Navbar title={title} onOpenMobile={() => setMobileOpen(true)} />
          <main className="p-4 lg:p-6 max-w-[1440px] mx-auto">
            <div key={location.pathname} className="animate-[fadeIn_0.25s_ease-out]">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/prioritization" element={<Prioritization />} />
                <Route path="/block-planner" element={<BlockPlanner />} />
                <Route path="/weekly-plan" element={<WeeklyPlan />} />
                <Route path="/monthly-plan" element={<MonthlyPlan />} />
                <Route path="/corridor" element={<Corridor />} />
                <Route path="/what-if" element={<WhatIf />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/system-data" element={<SystemData />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
