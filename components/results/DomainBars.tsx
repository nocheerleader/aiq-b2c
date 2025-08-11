"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { DomainScores } from "@/lib/result"

type DomainRow = { label: keyof DomainScores; score: number }

const chartConfig = {
  score: { label: "Score", color: "var(--chart-1)" },
}

export function DomainBars({ domainScores }: { domainScores: DomainScores }) {
  const chartData: DomainRow[] = [
    { label: "Activation", score: domainScores.Activation },
    { label: "Imagination", score: domainScores.Imagination },
    { label: "Technical", score: domainScores.Technical },
  ]

  return (
    <Card showLogo={false} className="bg-transparent border-0 shadow-none p-0">
      <CardContent className="p-0">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: -10, right: 0, top: 0, bottom: 0 }}
            width={360}
            height={140}
          >
            <XAxis type="number" dataKey="score" hide domain={[0, 9]} />
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tickFormatter={(value: string) => value}
            />
            <ChartTooltip />
            <Bar dataKey="score" name="Score" fill="var(--chart-1)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


