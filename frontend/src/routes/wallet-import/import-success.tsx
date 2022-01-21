import React from 'react'
import { Link } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
import { Button } from '../../components/button'
import { CodeBlock } from '../../components/code-block'
import { Paths } from '../router-config'

export interface ImportSuccessProps {
  walletPath: string
}

export function ImportSuccess({ walletPath }: ImportSuccessProps) {
  return (
    <>
      <BulletHeader tag='h1'>Wallet successfully imported</BulletHeader>
      <p>Wallet location:</p>
      <p>
        <CodeBlock>{walletPath}</CodeBlock>
      </p>
      <Link to={Paths.Wallet}>
        <Button>Go to wallets</Button>
      </Link>
    </>
  )
}
