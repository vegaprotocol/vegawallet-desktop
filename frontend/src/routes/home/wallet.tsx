import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { ListKeys } from '../../api/service'
import { BulletHeader } from '../../components/bullet-header'

export function Wallet() {
  const { wallet } = useParams<{ wallet: string }>()

  React.useEffect(() => {
    async function run() {
      try {
        const keys = await ListKeys({ Name: wallet, Passphrase: '123' })
        console.log(keys)
      } catch (err) {
        console.log(err)
      }
    }

    if (wallet) {
      run()
    }
  }, [wallet])

  return (
    <>
      <BulletHeader tag='h1'>
        {wallet} / <Link to='/'>Back</Link>
      </BulletHeader>
    </>
  )
}
