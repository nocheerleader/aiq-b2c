"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, RotateCcw, Share2 } from 'lucide-react'
import { questions } from '@/data/questions'
import { useQuizState } from '@/hooks/useQuizState'
import { computeResult } from '@/lib/result'
import { encodeResults } from '@/lib/share'
import { MovingBorderWrapper } from '@/components/ui/moving-border'

// Confidence slider helpers
const CONFIDENCE_STOPS = [0, 25, 50, 100] as const

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
function RestartButton({ onRestart }: { onRestart: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      aria-label="Restart"
      onClick={onRestart}
      className="absolute top-2 right-2 flex items-center gap-1 bg-transparent h-6 px-2 text-xs"
    >
      <RotateCcw className="h-3 w-3" />
      <span className="hidden sm:inline">Restart</span>
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

  // Landing Screen
  if (state.currentStep === "landing") {
    return (
      <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
        <Card className="relative w-full max-w-md bg-[var(--brand-card,white)]">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center items-center w-full">
              <CardTitle className="text-2xl font-bold text-[var(--brand-text,#1e293b)]">AIQ Readiness Quiz</CardTitle>
            </div>
            <p className="text-[var(--brand-text,#64748b)]">
            Find out if you're AI-ready in 3 minutes
            </p>
            <p className="text-[var(--brand-text,#64748b)]">Only 12% score as AI-ready</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <MovingBorderWrapper className="w-full">
              <Button
                onClick={() => updateState({ currentStep: "confidence" })}
                className="w-full bg-[var(--brand-accent)] text-white hover:bg-[color-mix(in_oklch, var(--brand-accent) 90%, white)] hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out"
                size="lg"
              >
                Discover Your AI Readiness Level
              </Button>
              </MovingBorderWrapper>
              <p className="text-center text-xs space-y-4">Join 2,000+ professionals becoming AI-first</p>
          
          </CardContent>
        </Card>
      </div>
    )
  }

  // Confidence Slider Screen
  if (state.currentStep === "confidence") {
    return (
      <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
        <Card className="relative w-full max-w-md bg-[var(--brand-card,white)]">
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
                {(() => {
                  // Work internally with 0..3 for even spacing and convert to 0/25/50/100 for storage
                  const currentIndex = valueToIndex(state.confidence)
                  const currentValue = indexToValue(currentIndex)
                  const label = CONFIDENCE_LABELS[currentValue]

                  return (
                    <>
                      <Slider
                        value={[currentIndex]}
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

                      {/* Tick marks with labels */}
                      <div className="relative mt-2">
                        <div className="h-0.5 bg-muted-foreground/30 absolute left-0 right-0 top-0" />
                        <div className="flex justify-between">
                          {CONFIDENCE_STOPS.map((stop, idx) => (
                            <button
                              key={stop}
                              type="button"
                              onClick={() => updateState({ confidence: stop }, { immediate: true })}
                              className="flex flex-col items-center group"
                              aria-label={`${stop}%`}
                            >
                              <span
                                className={`block h-3 w-0.5 rounded-sm transition-colors ${
                                  idx === currentIndex
                                    ? 'bg-[var(--brand-accent,#ef4444)]'
                                    : 'bg-muted-foreground/50 group-hover:bg-muted-foreground'
                                }`}
                              />
                              <span className={`mt-1 text-xs ${idx === currentIndex ? 'text-[var(--brand-accent,#ef4444)] font-medium' : 'text-[var(--brand-text,#64748b)]'}`}>
                                {stop}%
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Selected phrase */}
                      <div className="text-center">
                        <span className="text-base font-medium text-[var(--brand-text,#1e293b)]">
                          {label}
                        </span>
                      </div>
                    </>
                  )
                })()}
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
        <Card className="relative w-full max-w-md bg-[var(--brand-card,white)]">
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
        <Card className="relative w-full max-w-md bg-[var(--brand-card,white)]">
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

  return null
}
