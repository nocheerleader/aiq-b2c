"use client"

import * as React from "react"
import { TooltipProps } from "recharts"
import { cn } from "@/lib/utils"

export type ChartConfig = Record<string, { label: string; color: string }>

export function ChartContainer({
  children,
  className,
  config,
}: React.PropsWithChildren<{ className?: string; config: ChartConfig }>) {
  return (
    <div
      data-chart-config={JSON.stringify(config)}
      className={cn("w-full", className)}
    >
      {children}
    </div>
  )
}

export function ChartTooltip({ active, payload, label }: TooltipProps<any, any>) {
  if (!active || !payload || payload.length === 0) return null
  const first = payload[0]
  const name = first?.name ?? label
  const value = first?.value
  return (
    <div className="rounded-md border bg-card px-2 py-1 text-xs shadow-sm">
      <div className="font-medium">{String(name)}</div>
      <div className="text-muted-foreground">{String(value)}</div>
    </div>
  )
}

export function ChartTooltipContent({ hideLabel = false }: { hideLabel?: boolean }) {
  // This component exists to match the API from shadcn examples
  return <div className="hidden" aria-hidden />
}


