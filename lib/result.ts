import { QuizState } from '@/types/quiz'
import { OPTION_POINTS } from '@/data/scoring'

export type ArchetypeName = 'The Thinker' | 'The Builder' | 'The Dreamer'

export interface DomainScores {
  Activation: number
  Technical: number
  Imagination: number
}

export interface QuizResult {
  archetype: ArchetypeName
  profile: string
  confidence: number | null
  // Keeping these for future iteration/visuals (not displayed yet)
  totalScore: number
  domainScores: DomainScores
}

// Profile copy sourced from docs/archetypes.md
const ARCHETYPE_PROFILE: Record<ArchetypeName, string> = {
  'The Thinker':
    "You’re fueled by curiosity and systems thinking. You’re the kind of person who actually reads the documentation and then builds something even better. You love understanding the inner workings of AI and finding ways to optimize, improve, or explain it to others.",
  'The Dreamer':
    "You use AI as a co-creator. You’re constantly exploring what’s possible, pushing boundaries, and using AI to dream bigger, design bolder, and imagine beyond today’s limits.",
  'The Builder':
    "You’re hands-on, action-oriented, and results-driven. You’re all about doing: automating tasks, solving real problems, and making AI work in practical, measurable ways.",
}

// Map questions to domains
const DOMAIN_BY_QUESTION: Record<string, keyof DomainScores> = {
  q1: 'Activation',
  q2: 'Activation',
  q6: 'Activation',
  q3: 'Technical',
  q7: 'Technical',
  q8: 'Technical',
  q4: 'Imagination',
  q5: 'Imagination',
  q9: 'Imagination',
}

function computeDomainScores(answers: QuizState['answers']): { domainScores: DomainScores; totalScore: number; dCounts: DomainScores; cCounts: DomainScores } {
  const initial: DomainScores = { Activation: 0, Technical: 0, Imagination: 0 }
  const dCounts: DomainScores = { Activation: 0, Technical: 0, Imagination: 0 }
  const cCounts: DomainScores = { Activation: 0, Technical: 0, Imagination: 0 }

  let total = 0

  for (const [qid, raw] of Object.entries(answers)) {
    const domain = DOMAIN_BY_QUESTION[qid]
    if (!domain) continue

    const value = Array.isArray(raw) ? raw[0] : raw
    if (typeof value !== 'string') continue

    const letter = value as 'A' | 'B' | 'C' | 'D'
    const points = OPTION_POINTS[letter] ?? 0

    initial[domain] += points
    total += points

    if (letter === 'D') dCounts[domain] += 1
    if (letter === 'C') cCounts[domain] += 1
  }

  return { domainScores: initial, totalScore: total, dCounts, cCounts }
}

function pickArchetypeFromDomains(domainScores: DomainScores, dCounts: DomainScores, cCounts: DomainScores): ArchetypeName {
  const entries = Object.entries(domainScores) as Array<[keyof DomainScores, number]>
  // Sort by score desc, then D-count desc, then C-count desc, then fixed priority Activation > Technical > Imagination
  const priority: Array<keyof DomainScores> = ['Activation', 'Technical', 'Imagination']
  entries.sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1]
    if (dCounts[b[0]] !== dCounts[a[0]]) return dCounts[b[0]] - dCounts[a[0]]
    if (cCounts[b[0]] !== cCounts[a[0]]) return cCounts[b[0]] - cCounts[a[0]]
    return priority.indexOf(a[0]) - priority.indexOf(b[0])
  })

  const topDomain = entries[0][0]
  if (topDomain === 'Activation') return 'The Thinker'
  if (topDomain === 'Technical') return 'The Builder'
  return 'The Dreamer'
}

export function computeResult(confidence: number | null, answers: QuizState['answers']): QuizResult {
  const { domainScores, totalScore, dCounts, cCounts } = computeDomainScores(answers)
  const archetype = pickArchetypeFromDomains(domainScores, dCounts, cCounts)

  return {
    archetype,
    profile: ARCHETYPE_PROFILE[archetype],
    confidence: confidence ?? null,
    totalScore,
    domainScores,
  }
}