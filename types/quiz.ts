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
  options: string[]
  multiSelect?: boolean
} 