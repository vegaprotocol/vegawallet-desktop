import { Link, Navigate, Outlet } from 'react-router-dom'

import { ButtonUnstyled } from '../../components/button-unstyled'
import { DropdownItem, DropdownMenu } from '../../components/dropdown-menu'
import { Colors } from '../../config/colors'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { Paths } from '../'
import { WalletHeader } from './wallet-header'

export function WalletKeyPair() {
  const { keypair } = useCurrentKeypair()

  if (!keypair) {
    return <Navigate to={Paths.Wallet} />
  }

  return (
    <>
      <WalletHeader
        center={
          keypair && (
            <>
              <div
                style={{
                  color: Colors.WHITE,
                  fontSize: 20
                }}
              >
                {keypair.name}
              </div>
              <div style={{ textTransform: 'initial' }}>
                {keypair.publicKeyShort}
              </div>
            </>
          )
        }
        right={
          keypair && (
            <DropdownMenu
              trigger={
                <ButtonUnstyled
                  data-testid='wallet-actions'
                  style={{ marginRight: 10 }}
                >
                  Menu
                </ButtonUnstyled>
              }
              content={
                <div>
                  {['sign', 'taint', 'metadata'].map(page => (
                    <DropdownItem key={page}>
                      <Link
                        data-testid={`wallet-action-${page}`}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '10px 15px',
                          lineHeight: 1,
                          textAlign: 'left',
                          textTransform: 'capitalize'
                        }}
                        to={page}
                      >
                        {page}
                      </Link>
                    </DropdownItem>
                  ))}
                </div>
              }
            />
          )
        }
      />
      <Outlet />
    </>
  )
}
