"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
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
          <div className="w-full h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{ left: 16, right: 16, top: 8, bottom: 8 }}
                barCategoryGap={14}
              >
                <XAxis type="number" dataKey="score" hide domain={[0, 9]} />
                <YAxis
                  dataKey="label"
                  type="category"
                  tickLine={false}
                  tickMargin={12}
                  axisLine={false}
                  width={110}
                  tickFormatter={(value: string) => value}
                />
                <ChartTooltip />
                <Bar dataKey="score" name="Score" fill="var(--chart-1)" radius={5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


