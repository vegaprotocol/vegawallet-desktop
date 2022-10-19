import type { ReactNode } from 'react'

import { ButtonGroup } from '../button-group'
import { Warning } from '../icons/warning'
import { Splash } from '../splash'
import { Title } from '../title'

type SplashErrorProps = {
  title?: string
  message: ReactNode
  actions: ReactNode
}

export const SplashError = ({ title, message, actions }: SplashErrorProps) => {
  return (
    <Splash>
      <div style={{ textAlign: 'center' }}>
        <Warning style={{ margin: 20, width: 28 }} />
        <Title variant='main'>{title || 'Error'}</Title>
      </div>
      <p style={{ margin: 20 }}>{message}</p>
      <ButtonGroup style={{ margin: 20 }}>{actions}</ButtonGroup>
    </Splash>
  )
}
