"use client"

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, RotateCcw, Share2, CheckCircle2 } from 'lucide-react'
import { questions } from '@/data/questions'
import { useQuizState } from '@/hooks/useQuizState'
import { computeResult } from '@/lib/result'
import { encodeResults } from '@/lib/share'
import { MovingBorderWrapper } from '@/components/ui/moving-border'

// Confidence slider helpers
const CONFIDENCE_STOPS = [0, 25, 50, 100] as const
const CONFIDENCE_EMOJI: Record<number, { icon: string; label: string }> = {
  0: { icon: '😬', label: 'New' },
  25: { icon: '🌱', label: 'Learning' },
  50: { icon: '🙂', label: 'Comfortable' },
  100: { icon: '💪', label: 'Confident' },
}

const CONFIDENCE_LABELS: Record<number, string> = {
  0: "AI? Never met her.",
  25: "Taken my first AI steps",
  50: "AI's part of my weekly routine",
  100: "Mayor of AI City",
}

function valueToIndex(value: number): number {
  let nearestIndex = 0
  let smallestDiff = Number.POSITIVE_INFINITY
  for (let i = 0; i < CONFIDENCE_STOPS.length; i++) {
    const diff = Math.abs(CONFIDENCE_STOPS[i] - value)
    if (diff < smallestDiff) {
      smallestDiff = diff
      nearestIndex = i
    }
  }
  return nearestIndex
}

function indexToValue(index: number): number {
  const clamped = Math.min(Math.max(index, 0), CONFIDENCE_STOPS.length - 1)
  return CONFIDENCE_STOPS[clamped]
}

// Components
function RestartButton({ onRequestRestart, position = "absolute" }: { onRequestRestart: () => void; position?: "absolute" | "static" }) {
  return (
    <Button
      variant="ghost"
      aria-label="Start over"
      aria-haspopup="dialog"
      onClick={onRequestRestart}
      className={`${position === "absolute" ? "absolute top-2 right-2" : ""} text-muted-foreground flex items-center gap-1 rounded-md h-11 w-11 p-0 sm:h-8 sm:w-auto sm:px-3 sm:py-1 sm:text-xs`}
    >
      <RotateCcw className="h-4 w-4" />
      <span className="hidden sm:inline">Start over</span>
    </Button>
  )
}

function ConfirmStartOver({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const cancelRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!open) return
    const id = window.setTimeout(() => {
      cancelRef.current?.focus()
    }, 0)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-labelledby="start-over-title">
      <div className="fixed inset-0 bg-black/50 z-0" onClick={onCancel} aria-hidden="true" />
      <div className="z-10 fixed inset-x-0 bottom-0 sm:static sm:mx-auto w-full sm:w-full max-w-md bg-white rounded-t-2xl sm:rounded-xl p-4 sm:p-6 shadow-lg">
        <div className="space-y-3">
          <h2 id="start-over-title" className="text-base sm:text-lg font-semibold text-[var(--brand-text,#1e293b)]">Start over?</h2>
          <p className="text-sm text-muted-foreground">You’ll lose your current answers.</p>
          <div className="mt-4 flex gap-2 sm:gap-3 justify-end">
            <Button ref={cancelRef} variant="secondary" onClick={onCancel} className="min-w-24">Cancel</Button>
            <Button onClick={onConfirm} className="min-w-24">Start over</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = (current / total) * 100
  return (
    <div className="w-full">
      <Progress value={progress} className="h-2" />
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
  const [confirmOpen, setConfirmOpen] = useState(false)
  const handleRequestRestart = () => setConfirmOpen(true)
  const handleConfirmRestart = () => {
    setConfirmOpen(false)
    restart()
  }

  // Landing Screen
  if (state.currentStep === "landing") {
    return (
      <>
      <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
        {/* Wrapper to stack cards vertically with consistent width */}
        <div className="w-full max-w-md flex flex-col gap-4">
          {/* Primary landing card */}
          <Card className="relative w-full max-w-md bg-[var(--brand-card,white)]">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center items-center w-full">
                <CardTitle className="text-2xl font-bold text-[var(--brand-text,#1e293b)]">AI Readiness Scorecard</CardTitle>
              </div>
              <p className="text-[var(--brand-text,#64748b)]">
              Are You AI-Ready? <br /> Find Out in 3 Minutes
              </p>
              <p className="text-[var(--brand-text,#64748b)]">Get a score, see your gaps and get a path to level up.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <MovingBorderWrapper className="w-full">
                <Button
                  onClick={() => updateState({ currentStep: "confidence" })}
                  className="w-full bg-[var(--brand-accent)] text-white hover:bg-[color-mix(in_oklch, var(--brand-accent) 90%, white)] hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out"
                  size="lg"
                >
                  Get My AI Readiness Score
                </Button>
                </MovingBorderWrapper>
                <p className="text-center text-xs space-y-4">Join 2,000+ professionals becoming AI-first</p>
            
            </CardContent>
          </Card>

          {/* Secondary information card: What you get */}
          <Card className="relative w-full max-w-md bg-[var(--brand-card,white)]" showLogo={false}>
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-xl font-semibold text-[var(--brand-text,#1e293b)]">What you get</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--brand-accent)] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--brand-text,#1e293b)]">Your AI Readiness Score (and what it means).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--brand-accent)] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--brand-text,#1e293b)]">Top 3 habits to adopt this week.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--brand-accent)] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--brand-text,#1e293b)]">A track from our Foundations course to close your gaps.</span>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground text-center">No spam. We’ll send your score and we never share your responses.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <ConfirmStartOver open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={handleConfirmRestart} />
      </>
    )
  }

  // Confidence Slider Screen
  if (state.currentStep === "confidence") {
    return (
      <>
      <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
        <Card className="relative w-full max-w-md bg-[var(--brand-card,white)]">
          <CardHeader className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Step 1 of 10</p>
              <RestartButton onRequestRestart={handleRequestRestart} position="static" />
            </div>
            {/* Progress bar intentionally omitted on confidence screen */}
            <CardTitle className="text-xl text-[var(--brand-text,#1e293b)] text-center">Confidence Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-lg font-medium text-[var(--brand-text,#1e293b)]">
                How confident do you feel using AI tools?
              </Label>
              <p className="text-xs italic text-[var(--brand-text,#64748b)]">Pick the statement that fits you best.</p>
              <div className="space-y-4 mt-2">
                {(() => {
                  // Work internally with 0..3 for even spacing and convert to 0/25/50/100 for storage
                  const hasSelection = state.confidence !== null && state.confidence !== undefined
                  const currentIndex = hasSelection ? valueToIndex(state.confidence as number) : -1
                  const currentValue = hasSelection ? indexToValue(currentIndex) : null
                  const label = currentValue !== null ? CONFIDENCE_LABELS[currentValue] : ''

                  return (
                    <>
                      <Slider
                        value={[Math.max(currentIndex, 0)]}
                        onValueChange={([idx]) => {
                          const snappedValue = indexToValue(idx)
                          updateState({ confidence: snappedValue })
                        }}
                        onValueCommit={([idx]) => {
                          const snappedValue = indexToValue(idx)
                          updateState({ confidence: snappedValue }, { immediate: true })
                        }}
                        min={0}
                        max={3}
                        step={1}
                        className="w-full"
                      />

                      {/* Tick marks with emoji and small labels */}
                      <div className="relative mt-3">
                        <div className="h-0.5 bg-muted-foreground/30 absolute left-0 right-0 top-0" />
                        <div className="flex justify-between">
                          {CONFIDENCE_STOPS.map((stop, idx) => {
                            const isActive = hasSelection && indexToValue(valueToIndex(state.confidence as number)) === stop
                            const meta = CONFIDENCE_EMOJI[stop]
                            return (
                              <button
                                key={stop}
                                type="button"
                                onClick={() => updateState({ confidence: stop }, { immediate: true })}
                                className="flex flex-col items-center group"
                                aria-label={`${meta.label}`}
                              >
                                <span
                                  className={`block h-3 w-0.5 rounded-sm transition-colors ${
                                    isActive
                                      ? 'bg-[var(--brand-accent,#ef4444)]'
                                      : 'bg-muted-foreground/50 group-hover:bg-muted-foreground'
                                  }`}
                                />
                                <span className={`mt-1 text-base ${isActive ? 'text-[var(--brand-text,#1e293b)]' : 'text-[var(--brand-text,#64748b)]'}`}>
                                  {meta.icon}
                                </span>
                                <span className={`mt-0.5 text-[10px] ${isActive ? 'text-[var(--brand-accent,#ef4444)] font-medium' : 'text-[var(--brand-text,#64748b)]'}`}>
                                  {meta.label}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Selected phrase */}
                      <div className="text-center mt-3 min-h-[1.5rem]">
                        {hasSelection ? (
                          <span className="text-base font-medium text-[var(--brand-text,#1e293b)]">
                            {label}
                          </span>
                        ) : (
                          <span className="text-sm text-[var(--brand-text,#64748b)]">Select one to continue</span>
                        )}
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
            <NavButtons
              onBack={() => updateState({ currentStep: "landing" })}
              onNext={() => updateState({ currentStep: "question", currentQuestion: 1 })}
              canGoNext={state.confidence !== null}
            />
          </CardContent>
        </Card>
      </div>
      <ConfirmStartOver open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={handleConfirmRestart} />
      </>
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
      if (questionIndex < 9) {
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
      <>
      <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
        <Card className="relative w-full max-w-md bg-[var(--brand-card,white)]">
          <CardHeader className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Step {questionIndex + 1} of 10</p>
              <RestartButton onRequestRestart={handleRequestRestart} position="static" />
            </div>
            <div className="mb-3">
              <ProgressBar current={questionIndex + 1} total={10} />
            </div>
            <CardTitle className="text-xl text-[var(--brand-text,#1e293b)] text-center">Question {questionIndex} of 9</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-medium text-[var(--brand-text,#1e293b)]">{question.text}</Label>

              {question.multiSelect ? (
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <div key={option.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${question.id}-${option.key}`}
                        checked={((currentAnswer as string[]) || []).includes(option.key)}
                        onCheckedChange={(checked) => {
                          const current = (currentAnswer as string[]) || []
                          if (checked) {
                            handleAnswerChange([...current, option.key])
                          } else {
                            handleAnswerChange(current.filter((item) => item !== option.key))
                          }
                        }}
                      />
                      <Label htmlFor={`${question.id}-${option.key}`} className="text-sm font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <RadioGroup value={(currentAnswer as string) || ""} onValueChange={handleAnswerChange}>
                  {question.options.map((option) => (
                    <div key={option.key} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.key} id={`${question.id}-${option.key}`} />
                      <Label htmlFor={`${question.id}-${option.key}`} className="text-sm font-normal">
                        {option.label}
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
      <ConfirmStartOver open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={handleConfirmRestart} />
      </>
    )
  }

  // Email Capture Screen
  if (state.currentStep === "email") {
    return (
      <>
      <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
        <Card className="relative w-full max-w-md bg-[var(--brand-card,white)]">
          <CardHeader className="relative">
            <RestartButton onRequestRestart={handleRequestRestart} />
            <div className="mb-4">
              <CardTitle className="text-xl text-[var(--brand-text,#1e293b)] text-center">Almost Done!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-medium text-[var(--brand-text,#1e293b)]">
                Get your personalized results
              </Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={state.email || ""}
                onChange={(e) => updateState({ email: e.target.value })}
                onBlur={(e) => updateState({ email: e.target.value }, { immediate: true })}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() =>
                  updateState(
                    {
                      currentStep: "results",
                      completedAt: new Date().toISOString(),
                    },
                    { immediate: true },
                  )
                }
                className="w-full bg-[var(--brand-accent)] text-white hover:bg-[color-mix(in_oklch, var(--brand-accent) 90%, white)]"
              >
                View Results
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  updateState(
                    {
                      currentStep: "results",
                      completedAt: new Date().toISOString(),
                    },
                    { immediate: true },
                  )
                }
                className="w-full"
              >
                Skip for now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <ConfirmStartOver open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={handleConfirmRestart} />
      </>
    )
  }

  // Results Screen
  if (state.currentStep === "results") {
    const result = computeResult(state.confidence, state.answers)

    return (
      <>
      <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[var(--brand-card,white)]">
          <CardHeader className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Step 10 of 10</p>
              <RestartButton onRequestRestart={handleRequestRestart} position="static" />
            </div>
            <div className="mb-3">
              <ProgressBar current={10} total={10} />
            </div>
            <CardTitle className="text-xl text-[var(--brand-text,#1e293b)] text-center">Your Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--brand-accent)]">{result.recommendation}</h2>
            <p className="text-sm text-[var(--brand-text,#64748b)]">
              Confidence Level: {state.confidence !== null ? `${state.confidence}%` : 'Not provided'}
            </p>
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
      <ConfirmStartOver open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={handleConfirmRestart} />
      </>
    )
  }

  return null
}
