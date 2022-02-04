import React from 'react'
import { Header } from '../../components/header'
import { Button } from '../../components/button'
import { CodeBlock } from '../../components/code-block'

export interface ImportSuccessProps {
  walletPath: string
  onComplete: () => void
}

export function ImportSuccess({ walletPath, onComplete }: ImportSuccessProps) {
  return (
    <>
      <Header style={{ marginTop: 0 }}>Wallet successfully imported</Header>
      <p>Wallet location:</p>
      <p>
        <CodeBlock>{walletPath}</CodeBlock>
      </p>
      <Button onClick={onComplete}>Complete</Button>
    </>
  )
}
