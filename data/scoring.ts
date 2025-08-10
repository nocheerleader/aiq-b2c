// Scoring constants and archetype mapping derived from docs/questions-new.md

export const OPTION_POINTS: Record<'A' | 'B' | 'C' | 'D', number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
}

// Per-question archetype mapping for A-D. Use null where the table shows "–".
export type Archetype = 'Thinker 🧠' | 'Builder 🔧' | 'Integrator 🤝' | 'Dreamer ✨'

export const ARCHETYPE_BY_QUESTION: Array<{
  q: `q${number}`
  map: Partial<Record<'A' | 'B' | 'C' | 'D', Archetype | null>>
}> = [
  { q: 'q1', map: { A: null, B: 'Thinker 🧠', C: 'Builder 🔧', D: 'Builder 🔧' } },
  { q: 'q2', map: { A: 'Thinker 🧠', B: 'Builder 🔧', C: 'Integrator 🤝', D: 'Dreamer ✨' } },
  { q: 'q3', map: { A: null, B: 'Thinker 🧠', C: 'Builder 🔧', D: 'Dreamer ✨' } },
  { q: 'q4', map: { A: null, B: 'Thinker 🧠', C: 'Builder 🔧', D: 'Dreamer ✨' } },
  { q: 'q5', map: { A: null, B: 'Thinker 🧠', C: 'Dreamer ✨', D: 'Dreamer ✨' } },
  { q: 'q6', map: { A: null, B: 'Thinker 🧠', C: 'Builder 🔧', D: 'Integrator 🤝' } },
  { q: 'q7', map: { A: null, B: 'Builder 🔧', C: 'Builder 🔧', D: 'Integrator 🤝' } },
  { q: 'q8', map: { A: null, B: 'Builder 🔧', C: 'Dreamer ✨', D: 'Dreamer ✨' } },
  { q: 'q9', map: { A: 'Thinker 🧠', B: 'Builder 🔧', C: 'Integrator 🤝', D: 'Integrator 🤝' } },
]


