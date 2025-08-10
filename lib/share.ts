import { QuizState } from '@/types/quiz'

function toBase64Url(input: string): string {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (input.length % 4)) % 4)
  return atob(padded)
}

export function encodeResults(confidence: number | null, answers: QuizState['answers']): string {
  const data = { confidence, answers }
  return toBase64Url(JSON.stringify(data))
}

export function decodeResults(encoded: string): { confidence: number | null; answers: QuizState['answers'] } | null {
  try {
    return JSON.parse(fromBase64Url(encoded))
  } catch {
    return null
  }
} 