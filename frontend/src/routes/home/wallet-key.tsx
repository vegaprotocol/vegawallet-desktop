import React from 'react'
import { useParams } from 'react-router'
import { BulletHeader } from '../../components/bullet-header'

export const WalletKey = () => {
  const { wallet, key } = useParams<{ wallet: string; key: string }>()

  return (
    <>
      <BulletHeader tag='h1'>
        {wallet} / {key}
      </BulletHeader>
    </>
  )
}
