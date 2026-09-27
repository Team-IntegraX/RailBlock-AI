import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
}
const COLORS = {
  success: 'text-alert-low',
  info: 'text-alert-info',
  warning: 'text-alert-medium',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id))
    }, 3500)
  }, [])

  const dismiss = (id) => setToasts((t) => t.filter((toast) => toast.id !== id))

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
        {toasts.map(({ id, message, type }) => {
          const Icon = ICONS[type] || Info
          return (
            <div
              key={id}
              className="glass flex items-start gap-2.5 border border-ink-200/70 shadow-raised rounded-lg px-3.5 py-3 animate-[fadeIn_0.15s_ease-out]"
            >
              <Icon size={17} className={`shrink-0 mt-0.5 ${COLORS[type] || COLORS.info}`} />
              <p className="text-sm text-ink-700 flex-1">{message}</p>
              <button onClick={() => dismiss(id)} className="text-ink-300 hover:text-ink-500">
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
