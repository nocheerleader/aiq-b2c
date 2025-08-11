import React from 'react'

interface CircularTextProps {
  text: string
  radius?: number
  className?: string
  characterClassName?: string
}

export function CircularText({ text, radius = 80, className, characterClassName = 'text-xs' }: CircularTextProps) {
  const characters = Array.from(text)
  const size = radius * 2
  const center = radius

  return (
    <div
      className={"relative select-none" + (className ? ` ${className}` : '')}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {characters.map((char, index) => {
        const angle = (index / characters.length) * 360
        const radians = (angle * Math.PI) / 180
        const x = center + radius * Math.cos(radians)
        const y = center + radius * Math.sin(radians)
        return (
          <span
            key={`${char}-${index}`}
            className={`absolute ${characterClassName} font-semibold tracking-widest`}
            style={{
              left: x,
              top: y,
              transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
              transformOrigin: 'center',
              whiteSpace: 'pre',
            }}
          >
            {char}
          </span>
        )
      })}
    </div>
  )
}


