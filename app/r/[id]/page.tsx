"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { computeResult } from '@/lib/result'
import { ARCHETYPES } from '@/data/archetypes'
import { FlipCard } from '@/components/results/FlipCard'
import { decodeResults } from '@/lib/share'
import { useParams } from 'next/navigation'

export default function SharedResultPage() {
  const params = useParams() as { id?: string }
  const id = params?.id ?? ''
  const decoded = decodeResults(id)

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
  const content = ARCHETYPES[result.archetype]

  return (
    <div className="min-h-screen bg-[var(--brand-bg,#f8fafc)] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-[var(--brand-card,white)]">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-[var(--brand-text,#1e293b)]">Your Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-[var(--brand-accent)]">{content.name}</h2>
            <p className="text-xs text-muted-foreground">Confidence Level: {decoded.confidence !== null ? `${decoded.confidence}%` : 'Not provided'}</p>
          </div>

          <FlipCard imageUrl={content.imageUrl} superpower={content.superpower} domainScores={result.domainScores} />
          <p className="text-center text-xs text-muted-foreground">Click card to see more</p>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Card showLogo={false}>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--brand-text,#1e293b)]">{content.profile}</p>
              </CardContent>
            </Card>

            <Card showLogo={false}>
              <CardHeader>
                <CardTitle>Growth Opportunity & Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-[var(--brand-text,#1e293b)]">{content.growthOpportunity}</p>
                <p className="text-sm text-[var(--brand-text,#1e293b)]">Next Steps: {content.nextSteps}</p>
              </CardContent>
            </Card>
          </div>

          <Button onClick={() => (window.location.href = '/')} className="w-full bg-[var(--brand-accent)] text-white hover:bg-[color-mix(in_oklch, var(--brand-accent) 90%, white)]">
            Take Your Own Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 