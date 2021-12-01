import React from 'react'
import { Link } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
import { CodeBlock } from '../../components/code-block'

export interface ImportSuccessProps {
  walletPath: string
}

export function ImportSuccess({ walletPath }: ImportSuccessProps) {
  return (
    <>
      <BulletHeader tag='h1'>Wallet successfully imported at:</BulletHeader>
      <p>
        <CodeBlock>{walletPath}</CodeBlock>
      </p>
      <Link to='/'>
        <button>Go to wallets</button>
      </Link>
    </>
  )
}
