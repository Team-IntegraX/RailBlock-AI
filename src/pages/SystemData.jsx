import { Database, CheckCircle2, Info } from 'lucide-react'
import Card from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import { systemSources } from '../data/systemSources'

export default function SystemData() {
  return (
    <div>
      <PageHeader title="System Data" description="Source systems feeding the block planning engine." />

      <div className="flex items-start gap-2.5 bg-alert-infoBg border border-rail-500/25 rounded-lg p-4 mb-5">
        <Info size={17} className="text-alert-info shrink-0 mt-0.5" />
        <p className="text-sm text-ink-700">
          <span className="font-semibold text-ink-900">Prototype using Synthetic / Demo Data.</span> This build does not
          connect to any live Indian Railways internal system — every record below is generated mock data for demonstration.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {systemSources.map((s) => (
          <Card key={s.code}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-md bg-rail-50 text-rail-500 flex items-center justify-center shrink-0">
                <Database size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-ink-900">{s.code}</h3>
                <p className="text-xs text-ink-500 mt-0.5">{s.name}</p>
                <p className="text-xs text-ink-500">{s.department}</p>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-alert-low bg-alert-lowBg rounded-full px-2 py-0.5">
                    <CheckCircle2 size={11} />
                    {s.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-ink-100 text-xs">
                  <div>
                    <p className="text-[11px] text-ink-500">Records</p>
                    <p className="font-mono text-ink-900 mt-0.5">{s.records}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-500">Last Data Sync</p>
                    <p className="font-mono text-ink-900 mt-0.5">{s.lastSync}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
