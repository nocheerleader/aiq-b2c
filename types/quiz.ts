export type Step = 'landing' | 'confidence' | 'question' | 'email' | 'results'

export interface QuizState {
  currentStep: Step
  confidence: number | null
  answers: Record<string, string | string[]>
  currentQuestion?: number
  email?: string
  completedAt?: string
}

export interface Question {
  id: string
  text: string
  domain: 'Activation' | 'Technical' | 'Imagination'
  options: { key: 'A' | 'B' | 'C' | 'D'; label: string }[]
  multiSelect?: boolean
} 