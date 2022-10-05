import { useGlobal } from '../../../contexts/global/global-context'
import { Intent } from '../../../config/intent'
import { Dialog } from '../../dialog'
import { Button } from '../../button'
import { AppToaster } from '../../toaster'
import { requestPassphrase } from '../../passphrase-modal'
import type { InteractionContentProps, RequestWalletSelection } from '../types'

export const WalletSelection = ({ interaction, onFinish }: InteractionContentProps<RequestWalletSelection>) => {
  const { service } = useGlobal()

  const handleResponse = async (wallet: string) => {
    const passphrase = await requestPassphrase()

    try {
      await service.RespondToInteraction({
        traceId: interaction.event.traceId,
        type: 'SELECTED_WALLET',
        content: {
          wallet,
          passphrase,
        }
      })
    } catch (err) {
      AppToaster.show({
        message: err instanceof Error ? err.message : `Error selecting wallet "${wallet}"`,
        intent: Intent.DANGER,
      })
    }
  }

  return (
    <Dialog open={true}>
      <div data-testid="wallet-selection-modal" style={{ textAlign: 'center', marginBottom: 20 }}>
        <div>
          <strong>{interaction.event.content.hostname}</strong>
        </div>
        <div>is requesting access to a wallet</div>
      </div>
      <div>
        Approving a connection allows this site to see your wallet chain ID, and may allow access to your public keys and allow you to approve transactions depending on your wallet permissions.
      </div>
      <div style={{ marginTop: 20 }}>Select a wallet to connect to:</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        {interaction.event.content.availableWallets.map(wallet => (
          <Button
            key={wallet}
            data-testid="wallet-selection-button"
            onClick={() => handleResponse(wallet)}
          >
            {wallet}
          </Button>
        ))}
      </div>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: 28 }}>
        <Button
          data-testid="wallet-selection-cancel"
          onClick={onFinish}
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  )
}
