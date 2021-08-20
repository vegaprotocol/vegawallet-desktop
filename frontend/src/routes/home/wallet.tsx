import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'

export function Wallet() {
  const { wallet } = useParams<{ wallet: string }>()
  return (
    <>
      <BulletHeader tag='h1'>
        {wallet} / <Link to='/'>Back</Link>
      </BulletHeader>
    </>
  )
}
