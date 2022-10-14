import type { ReactNode } from 'react'

import { ChevronLeft } from '../../components/icons/chevron-left'
import { Title } from '../../components/title'
import { ButtonUnstyled } from '../../components/button-unstyled'
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
        <ButtonUnstyled
          data-testid='back'
          onClick={onBack}
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <ChevronLeft style={{ width: 14 }} />
          <Title style={{ color: Colors.WHITE, margin: 0 }}>{breadcrumb}</Title>
        </ButtonUnstyled>
      )}
      <div>
        <Title
          element='h1'
          data-testid='header-title'
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
