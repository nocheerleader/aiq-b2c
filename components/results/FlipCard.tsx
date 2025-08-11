"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DomainBars } from "./DomainBars"
import { DomainScores } from "@/lib/result"

export function FlipCard({
  imageUrl,
  superpower,
  domainScores,
}: {
  imageUrl: string
  superpower: string
  domainScores: DomainScores
}) {
  const [flipped, setFlipped] = React.useState(false)

  return (
    <div
      className="[perspective:1000px] w-full"
      onClick={() => setFlipped((p) => !p)}
      role="button"
      aria-label="Flip to see chart"
    >
      <div
        className={
          "relative h-80 w-full [transform-style:preserve-3d] transition-transform duration-500" +
          (flipped ? " [transform:rotateY(180deg)]" : "")
        }
      >
        {/* Front */}
        <Card showLogo={false} className="absolute inset-0 [backface-visibility:hidden] flex items-center justify-center">
          <CardContent className="w-full h-full flex flex-col items-center justify-center gap-3">
            <img src={imageUrl} alt="archetype" className="w-40 h-40 object-cover rounded-md" />
            <p className="text-sm text-center text-[var(--brand-text,#1e293b)]">{superpower}</p>
          </CardContent>
        </Card>

        {/* Back */}
        <Card showLogo={false} className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex">
          <CardContent className="w-full h-full flex flex-col justify-center">
            <DomainBars domainScores={domainScores} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


