import type { CSSProperties } from 'react'

import { Colors } from '../../config/colors'

export const defaultStyles: CSSProperties = {
  appearance: 'none',
  display: 'block',
  width: '100%',
  background: 'transparent',
  border: `1px solid ${Colors.WHITE}`,
  padding: '7px 10px'
}
