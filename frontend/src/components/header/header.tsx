import type { ReactNode } from 'react'

import { Title } from '../../components/title'

interface HeaderProps {
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
}

export function Header({ left, center, right }: HeaderProps) {
  return (
    <Title
      style={{ display: 'flex', alignItems: 'start', margin: 0, padding: 20 }}
    >
      <div style={{ flex: 1, textAlign: 'left' }}>{left}</div>
      <div style={{ flex: 1, textAlign: 'center' }}>{center}</div>
      <div style={{ flex: 1, textAlign: 'right' }}>{right}</div>
    </Title>
  )
}
