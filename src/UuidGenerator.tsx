import { useState, useCallback } from 'react'
import { Copy, Check, RefreshCw, Trash2, Sun, Moon, Languages, Hash, ClipboardList } from 'lucide-react'

// ── i18n ─────────────────────────────────────────────────────────────────────
const translations = {
  en: {
    title: 'UUID v4 Generator',
    subtitle: 'Generate cryptographically secure UUID v4 identifiers using the Web Crypto API. Everything runs client-side.',
    configTitle: 'Options',
    configDesc: 'Format and quantity',
    quantity: 'Quantity',
    uuids: 'UUIDs',
    format: 'Format',
    uppercase: 'Uppercase',
    lowercase: 'Lowercase',
    dashes: 'With dashes',
    noDashes: 'Without dashes',
    braces: 'With braces { }',
    generate: 'Generate',
    regenerate: 'Regenerate',
    copyAll: 'Copy All',
    clearHistory: 'Clear History',
    history: 'Generated UUIDs',
    historyDesc: 'Last generated batch',
    empty: 'Click "Generate" to create UUIDs...',
    copy: 'Copy',
    copied: 'Copied!',
    copiedAll: 'All copied!',
    total: 'total',
    builtBy: 'Built by',
    noHistory: 'No UUIDs generated yet.',
  },
  pt: {
    title: 'Gerador de UUID v4',
    subtitle: 'Gere identificadores UUID v4 criptograficamente seguros usando a Web Crypto API. Tudo roda no navegador.',
    configTitle: 'Opcoes',
    configDesc: 'Formato e quantidade',
    quantity: 'Quantidade',
    uuids: 'UUIDs',
    format: 'Formato',
    uppercase: 'Maiusculas',
    lowercase: 'Minusculas',
    dashes: 'Com tracoes',
    noDashes: 'Sem tracoes',
    braces: 'Com chaves { }',
    generate: 'Gerar',
    regenerate: 'Gerar novamente',
    copyAll: 'Copiar tudo',
    clearHistory: 'Limpar historico',
    history: 'UUIDs gerados',
    historyDesc: 'Ultimo lote gerado',
    empty: 'Clique em "Gerar" para criar UUIDs...',
    copy: 'Copiar',
    copied: 'Copiado!',
    copiedAll: 'Tudo copiado!',
    total: 'total',
    builtBy: 'Criado por',
    noHistory: 'Nenhum UUID gerado ainda.',
  },
} as const
type Lang = keyof typeof translations
type Translations = (typeof translations)[Lang]

// ── Logic ─────────────────────────────────────────────────────────────────────
function formatUuid(raw: string, upper: boolean, dashes: boolean, braces: boolean): string {
  let s = dashes ? raw : raw.replace(/-/g, '')
  if (upper) s = s.toUpperCase()
  if (braces) s = `{${s}}`
  return s
}

// ── UUID row ──────────────────────────────────────────────────────────────────
function UuidRow({ value, t }: { value: string; t: Translations }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
      <span className="flex-1 font-mono text-xs break-all text-zinc-700 dark:text-zinc-300 select-all">{value}</span>
      <button onClick={copy} className="shrink-0 flex items-center gap-1 text-xs text-zinc-400 hover:text-violet-500 transition-colors">
        {copied ? <Check size={13} className="text-violet-500" /> : <Copy size={13} />}
        <span className="hidden sm:inline">{copied ? t.copied : t.copy}</span>
      </button>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function UuidGenerator() {
  const [lang, setLang] = useState<Lang>(() => navigator.language.startsWith('pt') ? 'pt' : 'en')
  const [dark, setDark] = useState(() => {
    const d = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', d)
    return d
  })
  const [quantity, setQuantity] = useState(5)
  const [upper, setUpper] = useState(false)
  const [dashes, setDashes] = useState(true)
  const [braces, setBraces] = useState(false)
  const [uuids, setUuids] = useState<string[]>([])
  const [copiedAll, setCopiedAll] = useState(false)

  const t = translations[lang]

  const toggleDark = () => {
    const next = !dark; setDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  const generate = useCallback(() => {
    const list: string[] = []
    for (let i = 0; i < quantity; i++) {
      list.push(formatUuid(crypto.randomUUID(), upper, dashes, braces))
    }
    setUuids(list)
  }, [quantity, upper, dashes, braces])

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n')).then(() => {
      setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000)
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
              <Hash size={18} className="text-white" />
            </div>
            <span className="font-semibold">UUID Generator</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />{lang.toUpperCase()}
            </button>
            <button onClick={toggleDark} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/uuid-generator" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Config */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-6">
              <div>
                <h2 className="font-semibold">{t.configTitle}</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.configDesc}</p>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">{t.quantity}</label>
                  <span className="text-sm font-bold text-violet-500 tabular-nums">{quantity} {t.uuids}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">-</button>
                  <input type="range" min={1} max={100} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="h-1.5 w-full cursor-pointer accent-violet-500" />
                  <button onClick={() => setQuantity(q => Math.min(100, q + 1))} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">+</button>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400 px-1"><span>1</span><span>100</span></div>
              </div>

              {/* Format toggles */}
              <div className="space-y-3">
                <p className="text-sm font-medium">{t.format}</p>
                {[
                  { label: upper ? t.uppercase : t.lowercase, state: upper, set: setUpper },
                  { label: dashes ? t.dashes : t.noDashes, state: dashes, set: setDashes },
                  { label: t.braces, state: braces, set: setBraces },
                ].map(({ label, state, set }) => (
                  <label key={label} className="flex cursor-pointer items-center gap-3">
                    <input type="checkbox" checked={state} onChange={e => set(e.target.checked)} className="h-4 w-4 cursor-pointer accent-violet-500 rounded" />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>

              <button onClick={generate} className="w-full flex items-center justify-center gap-2 rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-600 transition-colors">
                <RefreshCw size={15} />
                {uuids.length ? t.regenerate : t.generate}
              </button>
            </div>

            {/* Result */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4 flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold flex items-center gap-2">
                    <ClipboardList size={15} className="text-violet-500" />
                    {t.history}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.historyDesc}</p>
                </div>
                {uuids.length > 0 && (
                  <span className="text-xs text-zinc-400">{uuids.length} {t.total}</span>
                )}
              </div>

              {uuids.length === 0 ? (
                <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 min-h-[200px]">
                  <p className="text-sm text-zinc-400 italic">{t.empty}</p>
                </div>
              ) : (
                <div className="flex-1 space-y-2 max-h-96 overflow-y-auto pr-1">
                  {uuids.map((u, i) => <UuidRow key={i} value={u} t={t} />)}
                </div>
              )}

              {uuids.length > 0 && (
                <div className="flex gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <button onClick={copyAll} className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    {copiedAll ? <Check size={14} className="text-violet-500" /> : <Copy size={14} />}
                    {copiedAll ? t.copiedAll : t.copyAll}
                  </button>
                  <button onClick={() => setUuids([])} className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
                    <Trash2 size={14} />
                    {t.clearHistory}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-violet-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
