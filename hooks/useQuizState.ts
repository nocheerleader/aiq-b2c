import { useEffect, useMemo, useRef, useState } from 'react'
import type { QuizState } from '@/types/quiz'

const STORAGE_KEY = 'aiq-quiz-state'

const defaultState: QuizState = {
  currentStep: 'landing',
  confidence: 50,
  answers: {},
}

export function useQuizState() {
  const [state, setState] = useState<QuizState>(defaultState)
  const saveTimeoutRef = useRef<number | null>(null)

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

  const persist = (value: QuizState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  }

  const updateState = (updates: Partial<QuizState>, options?: { immediate?: boolean }) => {
    setState(prev => {
      const newState = { ...prev, ...updates }
      // Throttle writes to localStorage to avoid excessive churn on sliders/typing
      if (options?.immediate) {
        if (saveTimeoutRef.current) {
          window.clearTimeout(saveTimeoutRef.current)
          saveTimeoutRef.current = null
        }
        persist(newState)
      } else {
        if (saveTimeoutRef.current) {
          window.clearTimeout(saveTimeoutRef.current)
        }
        saveTimeoutRef.current = window.setTimeout(() => {
          persist(newState)
          saveTimeoutRef.current = null
        }, 250)
      }
      return newState
    })
  }

  const restart = () => {
    localStorage.removeItem(STORAGE_KEY)
    setState(defaultState)
  }

  return { state, updateState, restart }
} 