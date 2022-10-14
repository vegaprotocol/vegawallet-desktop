import { useEffect } from 'react'

import { Intent } from '../../../config/intent'
import { useGlobal } from '../../../contexts/global/global-context'
import { requestPassphrase } from '../../passphrase-modal'
import { AppToaster } from '../../toaster'
import type { InteractionContentProps, RequestPassphrase } from '../types'
import { INTERACTION_RESPONSE_TYPE } from '../types'

export const Passphrase = ({
  interaction,
  isResolved,
  setResolved
}: InteractionContentProps<RequestPassphrase>) => {
  const { service } = useGlobal()

  useEffect(() => {
    const handleResponse = async () => {
      try {
        const passphrase = await requestPassphrase()
        // @ts-ignore: wails generates the wrong type signature for this handler
        await service.RespondToInteraction({
          traceID: interaction.event.traceID,
          name: INTERACTION_RESPONSE_TYPE.ENTERED_PASSPHRASE,
          data: {
            passphrase
          }
        })
      } catch (err: unknown) {
        if (err === 'dismissed') {
          await service.RespondToInteraction({
            traceID: interaction.event.traceID,
            name: INTERACTION_RESPONSE_TYPE.CANCEL_REQUEST,
            data: {}
          })
        } else {
          console.log('INFINITE LOOP :scream:')
          AppToaster.show({
            message: `${err}`,
            intent: Intent.DANGER
          })
        }
      }

      setResolved(true)
    }

    if (!isResolved) {
      handleResponse()
    }
}, [interaction, isResolved, setResolved])

  return null
}
