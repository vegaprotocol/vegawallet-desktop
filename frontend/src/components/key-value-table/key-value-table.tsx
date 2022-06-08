import type { HTMLAttributes, ReactNode } from 'react'

import { Colors } from '../../config/colors'

interface KeyValueTableProps extends HTMLAttributes<HTMLTableElement> {
  rows: Array<{ key: ReactNode; value: ReactNode; dataTestId?: string }>
}

export const KeyValueTable = ({ rows, style }: KeyValueTableProps) => {
  return (
    <dl
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: 10,
        fontSize: 14,
        ...style
      }}
    >
      {rows.map(row => (
        <>
          <dt style={{ textAlign: 'left', color: Colors.WHITE }}>{row.key}:</dt>
          <dd
            style={{
              textAlign: 'right',
              color: Colors.TEXT_COLOR_DEEMPHASISE
            }}
            data-testid={row.dataTestId}
          >
            {row.value}
          </dd>
        </>
      ))}
    </dl>
  )
}
