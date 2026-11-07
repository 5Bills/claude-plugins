export type Limit = { kind: string; percentUsed: number; resetsAt?: string }

export type Vitals = {
  tokens?: number
  window: number
  percent?: number
  limits: Limit[]
  usd?: number
}

declare module 'claude-code' {
  interface PluginState {
    vitals: { vitals: Vitals | null; tick: number }
  }
}
