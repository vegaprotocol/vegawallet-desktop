import { useGlobal } from '../../contexts/global/global-context'
import type { RequestWalletSelection } from '../../wallet-client/interactions'
import type { InteractionContentProps } from '../interaction-manager'
import { Dialog } from '../dialog'
import { Button } from '../button'
import { requestPassphrase } from '../passphrase-modal'

export const ConnectionModal = ({ model, onRespond }: InteractionContentProps<RequestWalletSelection>) => {
  const { service } = useGlobal()

  const handleResponse = async (wallet: string) => {
    const passphrase = await requestPassphrase()

    await service.RespondToInteraction({
      traceId: model.traceId,
      type: model.type,
      content: {
        wallet,
        passphrase,
      }
    })
    
    onRespond()
  }

  return (
    <Dialog open={true}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div>
          <strong>{model.content.hostname}</strong>
        </div>
        <div>is requesting access to a wallet</div>
      </div>
      <div>
        Approving a connection allows this site to see your wallet chain ID, and may allow access to your public keys and allow you to approve transactions depending on your wallet permissions.
      </div>

      <div>Select a wallet to connect to:</div>
      <div>
        {model.content.availableWallets.map((wallet, index) => {
          <Button key={index} onClick={() => handleResponse(wallet)}>{wallet}</Button>
        })}
      </div>
    </Dialog>
  )
}
