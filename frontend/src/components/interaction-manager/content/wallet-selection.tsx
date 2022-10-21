import { useForm } from 'react-hook-form'

import { Colors } from '../../../config/colors'
import { Intent } from '../../../config/intent'
import { useGlobal } from '../../../contexts/global/global-context'
import { Validation } from '../../../lib/form-validation'
import { Button } from '../../button'
import { ButtonGroup } from '../../button-group'
import { ButtonUnstyled } from '../../button-unstyled'
import { Dialog } from '../../dialog'
import { requestPassphrase } from '../../passphrase-modal'
import { RadioGroup } from '../../radio-group'
import { AppToaster } from '../../toaster'
import type { InteractionContentProps, RequestWalletSelection } from '../types'
import { INTERACTION_RESPONSE_TYPE } from '../types'

export const WalletSelection = ({
  interaction,
  isResolved,
  setResolved
}: InteractionContentProps<RequestWalletSelection>) => {
  const { service } = useGlobal()
  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<{ wallet: string }>({
    mode: 'onChange'
  })

  const handleApprove = async ({ wallet }: { wallet: string }) => {
    if (!isResolved) {
      const passphrase = await requestPassphrase()

      try {
        // @ts-ignore: wails generates the wrong type signature for this handler
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
          message: `${err}`,
          intent: Intent.DANGER
        })
      }

      setResolved(true)
    }
  }

  const handleReject = async () => {
    if (!isResolved) {
      try {
        // @ts-ignore: wails generates the wrong type signature for this handler
        await service.RespondToInteraction({
          traceID: interaction.event.traceID,
          name: INTERACTION_RESPONSE_TYPE.CANCEL_REQUEST,
          data: {}
        })
        AppToaster.show({
          message: `The connection request from "${interaction.event.data.hostname}" has been rejected.`,
          intent: Intent.SUCCESS
        })
      } catch (err) {
        AppToaster.show({
          message: `${err}`,
          intent: Intent.DANGER
        })
      }

      setResolved(true)
    }
  }

  return (
    <Dialog open={true} size='lg' title='Approve connection'>
      <form
        onSubmit={handleSubmit(handleApprove)}
        data-testid='wallet-selection-modal'
        style={{ padding: '0 20px 20px' }}
      >
        <p
          style={{
            marginBottom: 20,
            border: `1px solid ${Colors.VEGA_PINK}`,
            padding: 20,
            textAlign: 'center'
          }}
        >
          <strong>{interaction.event.data.hostname}</strong> is requesting
          access to a wallet
        </p>
        <p>
          Approving a connection allows this site to see your wallet chain ID,
          and may allow access to your public keys and allow you to approve
          transactions depending on your wallet permissions.
        </p>
        <div style={{ marginTop: 20 }}>Select a wallet to connect to:</div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            margin: '20px 0 32px'
          }}
        >
          <RadioGroup
            name='wallet'
            rules={{
              required: Validation.REQUIRED
            }}
            control={control}
            options={interaction.event.data.availableWallets.map(w => ({
              value: w,
              label: w
            }))}
            itemStyle={{
              padding: 10,
              borderTop: `1px solid ${Colors.DARK_GRAY_1}`,
              width: '100%'
            }}
          />
        </div>
        <ButtonGroup inline>
          <Button
            data-testid='wallet-connection-approve'
            type='submit'
            disabled={!isValid}
          >
            Approve
          </Button>
          <ButtonUnstyled
            data-testid='wallet-connection-reject'
            onClick={handleReject}
          >
            Cancel
          </ButtonUnstyled>
        </ButtonGroup>
      </form>
    </Dialog>
  )
}
