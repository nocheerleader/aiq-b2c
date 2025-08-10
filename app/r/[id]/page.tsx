"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { computeResult } from '@/lib/result'
import { decodeResults } from '@/lib/share'

export default function SharedResultPage({ params }: { params: { id: string } }) {
  const decoded = decodeResults(params.id)

  if (!decoded) {
    return (
      <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[var(--brand-card,white)]">
          <CardContent className="text-center py-8">
            <p className="text-[var(--brand-text,#64748b)]">Invalid share link</p>
            <Button onClick={() => (window.location.href = '/')} className="mt-4">
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
          <p className="text-sm text-[var(--brand-text,#64748b)]">
            Confidence Level: {decoded.confidence !== null ? `${decoded.confidence}%` : 'Not provided'}
          </p>
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

          <Button onClick={() => (window.location.href = '/')} className="w-full bg-[var(--brand-accent)] text-white hover:bg-[color-mix(in_oklch, var(--brand-accent) 90%, white)]">
            Take Your Own Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 