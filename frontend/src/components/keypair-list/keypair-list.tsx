import { ButtonUnstyled } from '../../components/button-unstyled'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { EyeOff } from '../../components/icons/eye-off'
import { Colors } from '../../config/colors'
import type { Wallet } from '../../contexts/global/global-context'

type KeypairList = {
  wallet: Wallet
  onClick: (publicKey: string) => void
}

export const KeypairList = ({ wallet, onClick }: KeypairList) => {

  return (
    <div
      style={{
        borderBottom: wallet.keypairs ? `1px solid ${Colors.BLACK}` : ''
      }}
    >
      {Object.keys(wallet.keypairs || {}).map(key => {
        if (!wallet.keypairs) {
          return null
        }
        const { name, publicKey, publicKeyShort, isTainted } =
          wallet.keypairs[key] || {}
        return (
          <div
            data-testid='wallet-keypair'
            key={publicKey}
            style={{
              borderTop: `1px solid ${Colors.BLACK}`,
              padding: '20px 0'
            }}
          >
            <div>
              <ButtonUnstyled
                data-testid={`wallet-keypair-${publicKey}`}
                onClick={() => onClick(publicKey)}
              >
                {isTainted && (
                  <EyeOff style={{ width: 13, marginRight: 6 }} />
                )}
                {name}
              </ButtonUnstyled>
            </div>
            <div style={{ color: Colors.TEXT_COLOR_DEEMPHASISE }}>
              <CopyWithTooltip text={publicKey ?? ''}>
                <span>{publicKeyShort}</span>
              </CopyWithTooltip>
            </div>
          </div>
        )
      })}
    </div>
  )
}
