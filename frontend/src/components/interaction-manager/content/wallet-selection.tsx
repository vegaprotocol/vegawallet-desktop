import { Intent } from '../../../config/intent'
import { useGlobal } from '../../../contexts/global/global-context'
import { Button } from '../../button'
import { Dialog } from '../../dialog'
import { requestPassphrase } from '../../passphrase-modal'
import { AppToaster } from '../../toaster'
import type { InteractionContentProps, RequestWalletSelection } from '../types'
import { INTERACTION_RESPONSE_TYPE, CONNECTION_RESPONSE } from "../types";

export const WalletSelection = ({
  interaction,
  isResolved,
  setResolved,
}: InteractionContentProps<RequestWalletSelection>) => {
  const { service } = useGlobal()

  const handleApprove = async (wallet: string) => {
    if (!isResolved) {
      const passphrase = await requestPassphrase()

      try {
        await service.RespondToInteraction({
          traceID: interaction.event.traceID,
          name: INTERACTION_RESPONSE_TYPE.SELECTED_WALLET,
          data: {
            wallet,
            passphrase
          }
        })
      } catch (err) {
        AppToaster.show({
          message:
            err instanceof Error
              ? err.message
              : `Error selecting wallet "${wallet}"`,
          intent: Intent.DANGER
        })
      }

      setResolved()
    }
  }

  const handleReject = async () => {
    if (!isResolved) {
      try {
        await service.RespondToInteraction({
          traceID: interaction.event.traceID,
          name: INTERACTION_RESPONSE_TYPE.WALLET_CONNECTION_DECISION,
          data: {
            connectionApproval: CONNECTION_RESPONSE.REJECTED_ONCE,
          }
        })
      } catch (err) {
        AppToaster.show({
          message:
            err instanceof Error
              ? err.message
              : `Error rejecting connection for "${interaction.event.data.hostname}"`,
          intent: Intent.DANGER
        })
      }

      setResolved()
    }
  }

  return (
    <Dialog open={true}>
      <div
        data-testid='wallet-selection-modal'
        style={{ textAlign: 'center', marginBottom: 20 }}
      >
        <div>
          <strong>{interaction.event.data.hostname}</strong>
        </div>
        <div>is requesting access to a wallet</div>
      </div>
      <div>
        Approving a connection allows this site to see your wallet chain ID, and
        may allow access to your public keys and allow you to approve
        transactions depending on your wallet permissions.
      </div>
      <div style={{ marginTop: 20 }}>Select a wallet to connect to:</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginTop: 20
        }}
      >
        {interaction.event.data.availableWallets.map(wallet => (
          <Button
            key={wallet}
            data-testid='wallet-selection-button'
            onClick={() => handleApprove(wallet)}
          >
            {wallet}
          </Button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          marginTop: 28
        }}
      >
        <Button data-testid='wallet-selection-cancel' onClick={() => handleReject()}>
          Cancel
        </Button>
      </div>
    </Dialog>
  )
}
