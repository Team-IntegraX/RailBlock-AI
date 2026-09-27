// Lightweight client-side CSV/JSON export — no backend required.
// Used by the "Export" actions across the prototype so buttons produce a
// real downloadable file from the current demo dataset instead of a no-op.

function toCSV(rows) {
  if (!rows || rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const escape = (val) => {
    const s = val === null || val === undefined ? '' : String(val)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [headers.join(',')]
  rows.forEach((row) => {
    lines.push(headers.map((h) => escape(row[h])).join(','))
  })
  return lines.join('\n')
}

function triggerDownload(content, filename, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function downloadCSV(filename, rows) {
  triggerDownload(toCSV(rows), filename, 'text/csv;charset=utf-8;')
}

export function downloadJSON(filename, data) {
  triggerDownload(JSON.stringify(data, null, 2), filename, 'application/json;charset=utf-8;')
}
