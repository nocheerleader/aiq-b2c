"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, RotateCcw, Share2 } from "lucide-react"

// Types
interface QuizState {
  currentStep: string
  confidence: number
  answers: Record<string, string | string[]>
  currentQuestion?: number
  email?: string
  completedAt?: string
}

interface Question {
  id: string
  text: string
  options: string[]
  multiSelect?: boolean
}

// Quiz data
const questions: Question[] = [
  {
    id: "q1",
    text: "What is your primary role or industry?",
    options: ["Technology/Software", "Marketing/Sales", "Finance/Accounting", "Healthcare", "Education", "Other"],
  },
  {
    id: "q2",
    text: "Which AI tools have you used before?",
    options: ["ChatGPT", "Claude", "GitHub Copilot", "Midjourney/DALL-E", "Google Bard", "None"],
    multiSelect: true,
  },
  {
    id: "q3",
    text: "How often do you currently use AI tools?",
    options: ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
  },
  {
    id: "q4",
    text: "What is your biggest challenge with AI adoption?",
    options: [
      "Not knowing which tools to use",
      "Lack of training",
      "Cost concerns",
      "Security/Privacy concerns",
      "Integration complexity",
    ],
  },
  {
    id: "q5",
    text: "What type of tasks would you most like AI to help with?",
    options: [
      "Writing and content creation",
      "Data analysis",
      "Code development",
      "Creative design",
      "Process automation",
    ],
    multiSelect: true,
  },
  {
    id: "q6",
    text: "How important is data privacy in your AI tool selection?",
    options: [
      "Extremely important",
      "Very important",
      "Somewhat important",
      "Not very important",
      "Not important at all",
    ],
  },
  {
    id: "q7",
    text: "What is your organization's current AI maturity level?",
    options: [
      "Just getting started",
      "Experimenting with tools",
      "Some tools in production",
      "Mature AI strategy",
      "AI-first organization",
    ],
  },
  {
    id: "q8",
    text: "What would success with AI look like for you?",
    options: [
      "Increased productivity",
      "Cost savings",
      "Better decision making",
      "Competitive advantage",
      "Innovation enablement",
    ],
  },
]

// State management
const STORAGE_KEY = "aiq-quiz-state"

const defaultState: QuizState = {
  currentStep: "landing",
  confidence: 50,
  answers: {},
}

function useQuizState() {
  const [state, setState] = useState<QuizState>(defaultState)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setState(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse saved state:", e)
      }
    }
  }, [])

  const updateState = (updates: Partial<QuizState>) => {
    setState((prev) => {
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

// Results computation
function computeResult(confidence: number, answers: Record<string, string | string[]>) {
  // Simple deterministic logic based on confidence and key answers
  const role = answers.q1 as string
  const tools = answers.q2 as string[]
  const frequency = answers.q3 as string
  const maturity = answers.q7 as string

  let recommendation = "AI Explorer"
  let reasons = []

  if (confidence >= 80 && frequency === "Daily") {
    recommendation = "AI Power User"
    reasons = [
      "High confidence with daily AI usage",
      "Ready for advanced AI workflows",
      "Can mentor others in AI adoption",
    ]
  } else if (confidence >= 60 && tools?.length > 2) {
    recommendation = "AI Practitioner"
    reasons = [
      "Good confidence with multiple tools",
      "Actively using AI in workflow",
      "Ready to expand AI capabilities",
    ]
  } else if (confidence >= 40) {
    recommendation = "AI Learner"
    reasons = ["Building confidence with AI tools", "Ready for structured learning", "Good foundation for growth"]
  } else {
    recommendation = "AI Beginner"
    reasons = ["Starting AI journey", "Need foundational training", "Great potential for improvement"]
  }

  return {
    recommendation,
    reasons,
    nextSteps: [
      "Complete an AI fundamentals course",
      "Start with one AI tool daily",
      "Join an AI community",
      "Set measurable AI goals",
    ],
  }
}

// Share functionality
function encodeResults(confidence: number, answers: Record<string, string | string[]>) {
  const data = { confidence, answers }
  return btoa(JSON.stringify(data))
}

function decodeResults(encoded: string) {
  try {
    return JSON.parse(atob(encoded))
  } catch {
    return null
  }
}

// Components
function RestartButton({ onRestart }: { onRestart: () => void }) {
  return (
    <Button variant="outline" size="sm" onClick={onRestart} className="flex items-center gap-2 bg-transparent">
      <RotateCcw className="h-4 w-4" />
      Restart
    </Button>
  )
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = (current / total) * 100
  return (
    <div className="w-full">
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-muted-foreground mt-2">
        Step {current} of {total}
      </p>
    </div>
  )
}

function NavButtons({
  onBack,
  onNext,
  canGoNext = true,
  nextLabel = "Next",
  showBack = true,
}: {
  onBack?: () => void
  onNext: () => void
  canGoNext?: boolean
  nextLabel?: string
  showBack?: boolean
}) {
  return (
    <div className="flex justify-between items-center">
      {showBack && onBack ? (
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      ) : (
        <div />
      )}
      <Button onClick={onNext} disabled={!canGoNext} className="flex items-center gap-2">
        {nextLabel}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Main App Component
export default function AIQReadinessQuiz() {
  const { state, updateState, restart } = useQuizState()
  const [shareId, setShareId] = useState<string>("")

  // Handle URL-based sharing
  useEffect(() => {
    const url = new URL(window.location.href)
    const pathParts = url.pathname.split("/")
    if (pathParts[1] === "r" && pathParts[2]) {
      setShareId(pathParts[2])
    }
  }, [])

  // Landing Screen
  if (state.currentStep === "landing") {
    return (
      <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[var(--brand-card,white)]">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-[var(--brand-text,#1e293b)]">AIQ Readiness Quiz</CardTitle>
              <RestartButton onRestart={restart} />
            </div>
            <p className="text-[var(--brand-text,#64748b)]">
              Discover your AI readiness level and get personalized recommendations
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={() => updateState({ currentStep: "confidence" })}
              className="w-full bg-[var(--brand-accent)] text-white hover:bg-[color-mix(in_oklch, var(--brand-accent) 90%, white)]"
              size="lg"
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Confidence Slider Screen
  if (state.currentStep === "confidence") {
    return (
      <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[var(--brand-card,white)]">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-xl text-[var(--brand-text,#1e293b)]">Confidence Assessment</CardTitle>
              <RestartButton onRestart={restart} />
            </div>
            <ProgressBar current={1} total={9} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-medium text-[var(--brand-text,#1e293b)]">
                How confident do you feel using AI tools today?
              </Label>
              <div className="space-y-4">
                <Slider
                  value={[state.confidence]}
                  onValueChange={([value]) => updateState({ confidence: value })}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-center">
                  <span className="text-2xl font-bold text-[var(--brand-accent)]">{state.confidence}%</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--brand-text,#64748b)]">
                  <span>Not confident</span>
                  <span>Very confident</span>
                </div>
              </div>
            </div>
            <NavButtons
              onBack={() => updateState({ currentStep: "landing" })}
              onNext={() => updateState({ currentStep: "question", currentQuestion: 1 })}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Question Screen
  if (state.currentStep === "question") {
    const questionIndex = (state as any).currentQuestion || 1
    const question = questions[questionIndex - 1]
    const currentAnswer = state.answers[question.id]

    const handleAnswerChange = (value: string | string[]) => {
      updateState({
        answers: { ...state.answers, [question.id]: value },
      })
    }

    const canProceed =
      currentAnswer !== undefined && (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : currentAnswer !== "")

    const handleNext = () => {
      if (questionIndex < 8) {
        updateState({ currentQuestion: questionIndex + 1 })
      } else {
        updateState({ currentStep: "email" })
      }
    }

    const handleBack = () => {
      if (questionIndex > 1) {
        updateState({ currentQuestion: questionIndex - 1 })
      } else {
        updateState({ currentStep: "confidence" })
      }
    }

    return (
      <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[var(--brand-card,white)]">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-xl text-[var(--brand-text,#1e293b)]">Question {questionIndex} of 8</CardTitle>
              <RestartButton onRestart={restart} />
            </div>
            <ProgressBar current={questionIndex + 1} total={9} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-medium text-[var(--brand-text,#1e293b)]">{question.text}</Label>

              {question.multiSelect ? (
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={((currentAnswer as string[]) || []).includes(option)}
                        onCheckedChange={(checked) => {
                          const current = (currentAnswer as string[]) || []
                          if (checked) {
                            handleAnswerChange([...current, option])
                          } else {
                            handleAnswerChange(current.filter((item) => item !== option))
                          }
                        }}
                      />
                      <Label htmlFor={option} className="text-sm font-normal">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <RadioGroup value={(currentAnswer as string) || ""} onValueChange={handleAnswerChange}>
                  {question.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="text-sm font-normal">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>

            <NavButtons onBack={handleBack} onNext={handleNext} canGoNext={canProceed} />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Email Capture Screen
  if (state.currentStep === "email") {
    return (
      <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[var(--brand-card,white)]">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-xl text-[var(--brand-text,#1e293b)]">Almost Done!</CardTitle>
              <RestartButton onRestart={restart} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-medium text-[var(--brand-text,#1e293b)]">
                Get your personalized results
              </Label>
              <p className="text-sm text-[var(--brand-text,#64748b)]">
                Local prototype — your email stays on this device.
              </p>
              <Input
                type="email"
                placeholder="Enter your email (optional)"
                value={state.email || ""}
                onChange={(e) => updateState({ email: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() =>
                  updateState({
                    currentStep: "results",
                    completedAt: new Date().toISOString(),
                  })
                }
                className="w-full bg-[var(--brand-accent)] text-white hover:bg-[color-mix(in_oklch, var(--brand-accent) 90%, white)]"
              >
                View Results
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  updateState({
                    currentStep: "results",
                    completedAt: new Date().toISOString(),
                  })
                }
                className="w-full"
              >
                Skip for now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Results Screen
  if (state.currentStep === "results") {
    const result = computeResult(state.confidence, state.answers)

    return (
      <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[var(--brand-card,white)]">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-xl text-[var(--brand-text,#1e293b)]">Your Results</CardTitle>
              <RestartButton onRestart={restart} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--brand-accent)]">{result.recommendation}</h2>
            <p className="text-sm text-[var(--brand-text,#64748b)]">Confidence Level: {state.confidence}%</p>
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--brand-text,#1e293b)] mb-2">Why this fits you:</h3>
              <ul className="list-none space-y-1">
                {result.reasons.map((item, index) => (
                  <li key={index} className="text-sm text-[var(--brand-text,#64748b)] flex items-start">
                    <span className="text-[var(--brand-accent)] mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <h3 className="font-semibold text-[var(--brand-text,#1e293b)] mb-2">What to do next:</h3>
              <ul className="list-none space-y-1">
                {result.nextSteps.map((item, index) => (
                  <li key={index} className="text-sm text-[var(--brand-text,#64748b)] flex items-start">
                    <span className="text-[var(--brand-accent)] mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={() => {
                const shareUrl = `${window.location.origin}/r/${encodeResults(state.confidence, state.answers)}`
                navigator.clipboard.writeText(shareUrl)
                // Could add toast notification here
              }}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share Results
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Public Share Screen
  if (shareId) {
    const decoded = decodeResults(shareId)
    if (!decoded) {
      return (
        <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-[var(--brand-card,white)]">
            <CardContent className="text-center py-8">
              <p className="text-[var(--brand-text,#64748b)]">Invalid share link</p>
              <Button onClick={() => (window.location.href = "/")} className="mt-4">
                Take Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    const result = computeResult(decoded.confidence, decoded.answers)

    return (
      <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[var(--brand-card,white)]">
          <CardHeader>
            <CardTitle className="text-xl text-center text-[var(--brand-text,#1e293b)]">Shared AIQ Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--brand-accent)]">{result.recommendation}</h2>
            <p className="text-sm text-[var(--brand-text,#64748b)]">Confidence Level: {decoded.confidence}%</p>
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--brand-text,#1e293b)] mb-2">Key insights:</h3>
              <ul className="list-none space-y-1">
                {result.reasons.map((item, index) => (
                  <li key={index} className="text-sm text-[var(--brand-text,#64748b)] flex items-start">
                    <span className="text-[var(--brand-accent)] mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Button onClick={() => (window.location.href = "/")} className="w-full bg-[var(--brand-accent)] text-white hover:bg-[color-mix(in_oklch, var(--brand-accent) 90%, white)]">
              Take Your Own Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
