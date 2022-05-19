import type { HTMLAttributes, ReactNode } from 'react'

import { Colors } from '../../config/colors'

interface KeyValueTableProps extends HTMLAttributes<HTMLTableElement> {
  rows: Array<{ key: ReactNode; value: ReactNode; dataTestId?: string }>
}

export const KeyValueTable = ({ rows, style }: KeyValueTableProps) => {
  return (
    <table style={{ fontSize: 14, ...style }}>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <th style={{ textAlign: 'left', color: Colors.WHITE }}>
              {row.key}:
            </th>
            <td
              style={{
                textAlign: 'right',
                color: Colors.TEXT_COLOR_DEEMPHASISE
              }}
              data-testid={row.dataTestId}
            >
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
