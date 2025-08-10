import { QuizState } from '@/types/quiz'

export interface QuizResult {
  recommendation: string
  reasons: string[]
  nextSteps: string[]
}

export function computeResult(confidence: number | null, answers: QuizState['answers']): QuizResult {
  const tools = answers.q2 as string[] | undefined
  const frequency = answers.q3 as string | undefined

  let recommendation = 'AI Beginner'
  let reasons: string[] = ['Starting AI journey', 'Need foundational training', 'Great potential for improvement']

  if ((confidence ?? 0) >= 80 && frequency === 'Daily') {
    recommendation = 'AI Power User'
    reasons = [
      'High confidence with daily AI usage',
      'Ready for advanced AI workflows',
      'Can mentor others in AI adoption',
    ]
  } else if ((confidence ?? 0) >= 60 && (tools?.length || 0) > 2) {
    recommendation = 'AI Practitioner'
    reasons = [
      'Good confidence with multiple tools',
      'Actively using AI in workflow',
      'Ready to expand AI capabilities',
    ]
  } else if ((confidence ?? 0) >= 40) {
    recommendation = 'AI Learner'
    reasons = ['Building confidence with AI tools', 'Ready for structured learning', 'Good foundation for growth']
  }

  return {
    recommendation,
    reasons,
    nextSteps: [
      'Complete an AI fundamentals course',
      'Start with one AI tool daily',
      'Join an AI community',
      'Set measurable AI goals',
    ],
  }
} 