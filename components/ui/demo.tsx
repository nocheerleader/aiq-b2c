import { StarBorder } from "@/components/ui/star-border"

export function StarBorderDemo() {
  return (
    <div className="space-y-8">
      <StarBorder color="hsl(var(--primary))" speed="3s">
        Theme-aware Border
      </StarBorder>
    </div>
  )
} 