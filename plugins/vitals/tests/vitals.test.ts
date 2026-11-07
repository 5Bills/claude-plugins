import { describe, expect, mock, test } from 'claude-code/testing'

import { bar, compact, describe as describeVitals, fit, heat, until, width } from '../hooks/register'

const props = (bodyColumns: number) => ({
  hasSurvey: false,
  isWorking: false,
  maxRows: 10,
  bodyColumns,
  scroll: { offset: 0, bodyRows: 9 },
  view: {},
})

const measure = {
  context: { tokens: 96_000, window: 200_000, percent: 48 },
  rateLimits: [
    { kind: 'five_hour', percentUsed: 92 },
    { kind: 'seven_day', percentUsed: 9 },
  ],
  cost: { usd: 1.4234 },
  changed: ['context', 'rateLimits', 'cost'] as const,
}

describe('helpers', () => {
  test('format', async () => {
    expect(compact(96_000)).toBe('96k')
    expect(compact(1_000_000)).toBe('1M')
    expect(bar(50, 10)).toEqual(['━━━━━', '─────'])
    expect(bar(140, 4)).toEqual(['━━━━', ''])
    expect(until(new Date(Date.UTC(2026, 0, 1, 2, 14)).toISOString(), Date.UTC(2026, 0, 1))).toBe('2h14m')
    expect(heat(92)).toBe('claude')
    expect(heat(60)).toBe('warning')
    expect(heat(10)).toBe('text')
  })
})

for (const surface of ['terminal', 'desktop'] as const) {
  test(`band draws the vitals on ${surface}`, async ($, on) => {
    mock.clock(on)
    on('session.measure', ($, e) => ({ changed: e.changed }))
    await $.session.measure({ ...measure, changed: [...measure.changed] })
    const ui = await $.ui.mount({ plugin: 'vitals', surface, component: 'AbovePrompt', props: props(130) })

    expect(await ui.find({ text: ' CTX ' })).toBeDefined()
    expect(await ui.find({ text: '48%' })).toBeDefined()
    expect(await ui.find({ text: ' 96k/200k' })).toBeDefined()
    expect(await ui.find({ text: ' 5H ' })).toBeDefined()
    expect(await ui.find({ text: '92%' })).toBeDefined()
    expect(await ui.find({ text: ' 1.42' })).toBeDefined()
  })
}

test('a tool call mid-turn refreshes the band', async ($, on) => {
  mock.clock(on)
  let percent = 10
  on('session.usage', () => ({
    value: {
      startedAt: 0,
      context: { tokens: percent * 2000, window: 200_000, percent },
      rateLimits: [],
      cost: { usd: percent / 10 },
    },
  }))
  on('tool.call', () => ({ result: 'ok' }) as never)
  percent = 63
  await $.tool.call({ tool: 'Bash', input: { command: 'true' } } as never)
  const ui = await $.ui.mount({ plugin: 'vitals', surface: 'terminal', component: 'AbovePrompt', props: props(130) })

  expect(await ui.find({ text: '63%' })).toBeDefined()
  expect(await ui.find({ text: ' 6.30' })).toBeDefined()
})

describe('fit', () => {
  const v = {
    tokens: 96_000, window: 200_000, percent: 48, usd: 1.42,
    limits: [
      { kind: 'five_hour', percentUsed: 92, resetsAt: new Date(Date.UTC(2026, 0, 1, 2, 14)).toISOString() },
      { kind: 'seven_day', percentUsed: 9, resetsAt: new Date(Date.UTC(2026, 0, 4, 4)).toISOString() },
    ],
  }
  const items = describeVitals(v, Date.UTC(2026, 0, 1))

  test('keeps everything when wide', async () => {
    expect(fit(items, 200)).toEqual({ cells: 12, tokens: true, resets: true, gap: 3 })
  })

  test('never needs more columns than it has, down to the floor', async () => {
    for (let cols = 200; cols >= 50; cols--) {
      expect(width(items, fit(items, cols))).toBeLessThanOrEqual(cols)
    }
  })

  test('hides the weekly window', async () => {
    expect(items.map(i => i.key)).toEqual(['ctx', 'five_hour', 'usd'])
  })

  test('keeps bars at an 80-column terminal', async () => {
    expect(fit(items, 76).cells).toBeGreaterThan(0)
  })

  test('drops reset times and tokens before the bars', async () => {
    let cols = 200
    while (fit(items, cols).cells > 0) cols--
    expect(fit(items, cols + 1)).toMatchObject({ tokens: false, resets: false })
  })
})

test('the band draws with no stored figures, as after /resume or /clear', async ($, on) => {
  mock.clock(on)
  on('session.usage', () => ({
    value: {
      startedAt: 0,
      context: { tokens: 62_000, window: 200_000, percent: 31 },
      rateLimits: [{ kind: 'five_hour', percentUsed: 12 }],
    },
  }))
  const ui = await $.ui.mount({ plugin: 'vitals', surface: 'terminal', component: 'AbovePrompt', props: props(130) })

  expect(await ui.find({ text: ' CTX ' })).toBeDefined()
  expect(await ui.find({ text: '31%' })).toBeDefined()
  expect(await ui.find({ text: ' 5H ' })).toBeDefined()
})
