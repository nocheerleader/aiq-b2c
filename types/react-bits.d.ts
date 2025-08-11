declare module 'react-bits' {
  import * as React from 'react'

  export interface CircularTextProps {
    text: string
    radius?: number
    className?: string
    style?: React.CSSProperties
  }

  export const CircularText: React.FC<CircularTextProps>
}


