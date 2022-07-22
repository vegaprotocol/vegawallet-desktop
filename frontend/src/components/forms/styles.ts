import type { CSSProperties } from 'react'

import { Colors } from '../../config/colors'

export const getDefaultStyles = ({ hasError = false }: { hasError?: boolean }): CSSProperties => ({
  appearance: 'none',
  display: 'block',
  width: '100%',
  background: 'transparent',
  border: `1px solid ${hasError ? Colors.VEGA_RED : Colors.WHITE}`,
  padding: '7px 10px',
  outlineColor: hasError ? Colors.VEGA_RED : Colors.WHITE,
})
