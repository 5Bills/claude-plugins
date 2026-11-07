import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionContextUsage, SessionCost, SessionRateLimit } from 'claude-code'

import type { Limit, Vitals } from '../types'

// Colours are Claude Code theme keys, not hex, so the band follows whatever
// theme is active and repaints when it changes: `text` below 50%, `warning`
// from 50%, `claude` (the accent) from 80%.
// The weekly window is hidden by default; remove it from HIDDEN to show it.
const HIDDEN = new Set(['seven_day'])
const LABELS: Record<string, string> = { five_hour: '5H', seven_day: '7D', spend_limit: 'SPEND' }

const vitals = atom({ plugin: 'vitals', key: 'vitals' } as const, null)
const tick = atom({ plugin: 'vitals', key: 'tick' } as const, 0)

function snapshot(u: { context: SessionContextUsage; rateLimits: SessionRateLimit[]; cost?: SessionCost }): Vitals {
  return {
    tokens: u.context.tokens,
    window: u.context.window,
    percent: u.context.percent,
    limits: u.rateLimits.map(l => ({ kind: l.kind, percentUsed: l.percentUsed, resetsAt: l.resetsAt })),
    usd: u.cost?.usd,
  }
}

export function compact(n: number): string {
  if (n >= 1e6) return `${+(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M`
  if (n >= 1e3) return `${Math.round(n / 1e3)}k`
  return `${n}`
}

export function until(iso: string | undefined, now: number): string {
  if (!iso) return ''
  const mins = Math.max(0, Math.round((Date.parse(iso) - now) / 60000))
  const d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60
  return d > 0 ? `${d}d${h}h` : h > 0 ? `${h}h${String(m).padStart(2, '0')}m` : `${m}m`
}

export function bar(percent: number, cells: number): [string, string] {
  const filled = Math.min(cells, Math.round((Math.min(percent, 100) / 100) * cells))
  return ['━'.repeat(filled), '─'.repeat(cells - filled)]
}

export function heat(percent: number): string {
  return percent >= 80 ? 'claude' : percent >= 50 ? 'warning' : 'text'
}

export type Item = { key: string; label: string; value: string; percent?: number; extra: string }
export type Plan = { cells: number; tokens: boolean; resets: boolean; gap: number }

export function describe(v: Vitals, now: number): Item[] {
  const items: Item[] = []
  const p = v.percent ?? 0
  items.push({
    key: 'ctx', label: 'CTX', value: `${Math.round(p)}%`, percent: p,
    extra: v.tokens !== undefined ? `${compact(v.tokens)}/${compact(v.window)}` : '',
  })
  for (const l of v.limits as Limit[]) {
    if (HIDDEN.has(l.kind)) continue
    const reset = until(l.resetsAt, now)
    items.push({
      key: l.kind, label: LABELS[l.kind] ?? l.kind.toUpperCase(),
      value: `${Math.round(l.percentUsed)}%`, percent: l.percentUsed, extra: reset ? `↻ ${reset}` : '',
    })
  }
  if (v.usd !== undefined) items.push({ key: 'usd', label: '$', value: v.usd.toFixed(2), extra: '' })
  return items
}

// The row never wraps (a wrapped chip sits flush under the one above and the
// backgrounds merge): shed detail, least useful first, until it fits. The
// bars are what the band is for, so they go last.
const PLANS: Plan[] = [
  { cells: 12, tokens: true, resets: true, gap: 3 },
  { cells: 8, tokens: true, resets: true, gap: 3 },
  { cells: 8, tokens: false, resets: true, gap: 3 },
  { cells: 6, tokens: false, resets: true, gap: 3 },
  { cells: 6, tokens: false, resets: false, gap: 3 },
  { cells: 6, tokens: false, resets: false, gap: 2 },
  { cells: 4, tokens: false, resets: false, gap: 2 },
  { cells: 0, tokens: false, resets: false, gap: 2 },
  { cells: 0, tokens: false, resets: false, gap: 1 },
]

export function width(items: Item[], plan: Plan): number {
  let total = plan.gap * Math.max(0, items.length - 1)
  for (const it of items) {
    total += it.label.length + 2 + 1 + it.value.length
    if (it.percent === undefined) continue
    if (plan.cells > 0) total += plan.cells + 1
    const extra = it.key === 'ctx' ? (plan.tokens ? it.extra : '') : plan.resets ? it.extra : ''
    if (extra) total += 1 + extra.length
  }
  return total
}

export function fit(items: Item[], cols: number): Plan {
  return PLANS.find(plan => width(items, plan) <= cols) ?? PLANS[PLANS.length - 1]!
}

// Re-read the session's figures; cheap (no breakdown), so it can run per tool call.
async function pull($: EngineInterface) {
  const u = await $.session.usage().catch(() => undefined)
  if (u) await update($, vitals, () => snapshot(u))
}

async function refresh($: EngineInterface) {
  const now = await $.clock.now()
  await update($, tick, () => now)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    await update($, vitals, () => null)
    await pull($)
    await refresh($)
    $.clock.every(30_000, () => void refresh($))
    return result
  })

  on('session.measure', async ($, e, next) => {
    await update($, vitals, () => snapshot(e))
    return next(e)
  })

  // Mid-turn: each finished tool call means a model request has reported its
  // usage, so the band climbs while Claude works instead of jumping at the end.
  on('tool.call', async ($, e, next) => {
    const result = await next(e)
    await pull($).catch(() => undefined)
    return result
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    // The stored figures are the session's, and session.start fires once per
    // process: after /resume or /clear the process goes on under a session
    // whose state is empty. Draw from a live read then (a draw may not write);
    // the next tool call or turn end fills the state.
    const v = (await read($, vitals)) ?? (await $.session.usage().then(snapshot, () => null))
    if (v === null) return next(e)

    const now = (await read($, tick)) || (await $.clock.now())
    const { Box, Text } = $.ui.resolve(e)

    const items = describe(v, now)
    // the border and padding take 4 columns of the band
    const plan = fit(items, e.props.bodyColumns - 4)

    const chip = (label: string, color: string) => (
      <Text backgroundColor={color} color="inverseText" bold>{` ${label} `}</Text>
    )

    const parts = items.map(it => {
      if (it.percent === undefined) {
        return (
          <Box key={it.key} flexShrink={0}>
            {chip(it.label, 'text')}
            <Text color="text" bold>{` ${it.value}`}</Text>
          </Box>
        )
      }
      const color = heat(it.percent)
      const [lit, unlit] = bar(it.percent, plan.cells)
      const extra = it.key === 'ctx' ? (plan.tokens ? it.extra : '') : plan.resets ? it.extra : ''
      return (
        <Box key={it.key} flexShrink={0}>
          {chip(it.label, color)}
          <Text>
            {' '}
            {plan.cells > 0 ? <Text color={color}>{lit}</Text> : null}
            {plan.cells > 0 ? <Text color="subtle">{unlit}</Text> : null}
            {plan.cells > 0 ? ' ' : ''}
            <Text color={color} bold>{it.value}</Text>
            {extra ? <Text color="inactive">{` ${extra}`}</Text> : null}
          </Text>
        </Box>
      )
    })

    return (
      <Box borderStyle="round" borderColor="promptBorder" paddingX={1}
        flexDirection="row" flexWrap="nowrap" columnGap={plan.gap}>
        {parts}
      </Box>
    )
  })
}
