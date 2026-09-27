export function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
      <div>
        <h2 className="text-xl font-semibold text-ink-900 tracking-tight">{title}</h2>
        {description && <p className="text-sm text-ink-500 mt-1 max-w-2xl">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function DemoDataNotice({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium text-alert-info bg-alert-infoBg border border-rail-500/25 rounded-full px-2.5 py-1 ${className}`}
    >
      Prototype &middot; Synthetic / Demo Data
    </span>
  )
}
