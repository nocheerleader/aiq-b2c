import { useEffect, useState } from 'react'
import type { QuizState } from '@/types/quiz'

const STORAGE_KEY = 'aiq-quiz-state'

const defaultState: QuizState = {
  currentStep: 'landing',
  confidence: 50,
  answers: {},
}

export function useQuizState() {
  const [state, setState] = useState<QuizState>(defaultState)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setState(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved state:', e)
      }
    }
  }, [])

  const updateState = (updates: Partial<QuizState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
      return newState
    })
  }

  const restart = () => {
    localStorage.removeItem(STORAGE_KEY)
    setState(defaultState)
  }

  return { state, updateState, restart }
} 