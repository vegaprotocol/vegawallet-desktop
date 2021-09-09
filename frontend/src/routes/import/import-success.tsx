import React from 'react'
import { Link } from 'react-router-dom'

export interface ImportSuccessProps {
  walletPath: string
}

export function ImportSuccess({ walletPath }: ImportSuccessProps) {
  return (
    <>
      <p>Wallet successfully imported at:</p>
      <pre className='wallet-creator__mnemonic'>{walletPath}</pre>
      <Link to='/'>
        <button>Go to wallets</button>
      </Link>
    </>
  )
}
