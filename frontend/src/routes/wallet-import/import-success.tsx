import { Button } from '../../components/button'
import { CodeBlock } from '../../components/code-block'
import { Title } from '../../components/title'

export interface ImportSuccessProps {
  walletPath: string
  onComplete: () => void
}

export function ImportSuccess({ walletPath, onComplete }: ImportSuccessProps) {
  return (
    <>
      <Title style={{ marginTop: 0 }}>Wallet successfully imported</Title>
      <p>Wallet location:</p>
      <p>
        <CodeBlock>{walletPath}</CodeBlock>
      </p>
      <Button onClick={onComplete}>Complete</Button>
    </>
  )
}
