import React from 'react'

import { style as defaultStyle } from './style'

export function Lock({ style }: { style?: React.CSSProperties }) {
  return (
		<svg
			style={{ ...defaultStyle, fill: 'currentColor', ...style }}
			viewBox='0 0 16 16'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M13.96,7H12V3.95C12,1.77,10.21,0,8,0S4,1.77,4,3.95V7H1.96C1.41,7,1,7.35,1,7.9v6.91C1,15.35,1.41,16,1.96,16
			h12c0.55,0,1.04-0.65,1.04-1.19V7.9C15,7.35,14.51,7,13.96,7z M6,7V3.95c0-1.09,0.9-1.97,2-1.97s2,0.88,2,1.97V7H6z'
			/>
		</svg>
	)
}
