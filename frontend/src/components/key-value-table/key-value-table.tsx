import type { HTMLAttributes, ReactNode } from 'react'
import { Fragment } from 'react'

import { Colors } from '../../config/colors'

interface KeyValueTableProps extends HTMLAttributes<HTMLDListElement> {
  rows: Array<{ key: ReactNode; value: ReactNode; dataTestId?: string }>
}

export const KeyValueTable = ({
  rows,
  style,
  ...props
}: KeyValueTableProps) => {
  return (
    <dl
      style={{
        display: 'grid',
        gridTemplateColumns: 'min-content 1fr',
        gridGap: 10,
        fontSize: 14,
        ...style
      }}
      {...props}
    >
      {rows.map((row, i) => (
        <Fragment key={i}>
          <dt style={{ textAlign: 'left', color: Colors.WHITE, minWidth: 145 }}>
            {row.key}:
          </dt>
          <dd
            style={{
              textAlign: 'right',
              color: Colors.TEXT_COLOR_DEEMPHASISE
            }}
            data-testid={row.dataTestId}
          >
            {row.value}
          </dd>
        </Fragment>
      ))}
    </dl>
  )
}
