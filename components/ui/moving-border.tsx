"use client"

import React, { useRef } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion"
import { cn } from "@/lib/utils"

type MovingBorderWrapperProps = {
  children: React.ReactNode
  className?: string
  borderRadius?: string
  duration?: number
  glowClassName?: string
}

// Wrapper that draws an animated red glow moving around the border of its children
export function MovingBorderWrapper({
  children,
  className,
  borderRadius = "var(--radius-md)",
  duration = 2000,
  glowClassName,
}: MovingBorderWrapperProps) {
  return (
    <div className={cn("relative p-px overflow-hidden", className)} style={{ borderRadius }}>
      {/* Animated border path layer (non-interactive) */}
      <div className="absolute inset-0" aria-hidden="true">
        <MovingBorder rx="var(--radius-md)" ry="var(--radius-md)" duration={duration}>
          <div
            className={cn(
              "size-20 opacity-80 pointer-events-none",
              // Red glow using Tailwind arbitrary value
              "bg-[radial-gradient(#ef4444_35%,transparent_60%)]",
              glowClassName,
            )}
          />
        </MovingBorder>
      </div>

      {/* Content stays fully clickable */}
      <div className="relative z-[1]" style={{ borderRadius }}>
        {children}
      </div>
    </div>
  )
}

type MovingBorderProps = {
  children: React.ReactNode
  duration?: number
  rx?: number | string
  ry?: number | string
  className?: string
}

// Low-level animator that moves children around the SVG rect path
export function MovingBorder({
  children,
  duration = 2000,
  rx = "var(--radius-md)",
  ry = "var(--radius-md)",
  className,
}: MovingBorderProps) {
  const pathRef = useRef<SVGRectElement | null>(null)
  const progress = useMotionValue(0)

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength?.()
    if (!length) return
    const pxPerMs = length / duration
    progress.set((time * pxPerMs) % length)
  })

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x ?? 0)
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y ?? 0)
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`

  return (
    <div className={cn("absolute inset-0", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        {/* Path the glow travels on */}
        <rect ref={pathRef} fill="none" width="100%" height="100%" rx={rx as any} ry={ry as any} />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}


