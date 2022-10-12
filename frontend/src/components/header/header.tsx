import type { ReactNode } from 'react'

import { ChevronLeft } from '../../components/icons/chevron-left'
import { Title } from '../../components/title'
import { Colors } from '../../config/colors'

interface HeaderProps {
  breadcrumb?: ReactNode
  title?: string
  subtitle?: string
  onBack?: () => void
}

export function Header({ breadcrumb, title, subtitle, onBack }: HeaderProps) {
  return (
    <div style={{ padding: 20 }}>
      {breadcrumb && onBack && (
        <div
          onClick={onBack}
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <ChevronLeft style={{ width: 14 }} />
          <Title style={{ color: Colors.WHITE, margin: 0 }}>{breadcrumb}</Title>
        </div>
      )}
      <div>
        <Title
          element='h1'
          style={{
            color: Colors.WHITE,
            fontSize: 32,
            textTransform: 'none',
            letterSpacing: 0
          }}
        >
          {title}
        </Title>
        <Title>{subtitle}</Title>
      </div>
    </div>
  )
}
