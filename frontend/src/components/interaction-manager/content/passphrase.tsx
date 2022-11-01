import { useEffect } from 'react'

import { Intent } from '../../../config/intent'
import { useGlobal } from '../../../contexts/global/global-context'
import { requestPassphrase } from '../../passphrase-modal'
import { AppToaster } from '../../toaster'
import type { InteractionContentProps, RequestPassphrase } from '../types'
import {
  EVENT_FLOW_TYPE,
  INTERACTION_RESPONSE_TYPE,
  INTERACTION_TYPE
} from '../types'

export const Passphrase = ({
  event,
  flow,
  history,
  isResolved,
  setResolved
}: InteractionContentProps<RequestPassphrase>) => {
  const { service, dispatch } = useGlobal()

  useEffect(() => {
    const handleResponse = async () => {
      try {
        const passphrase = await requestPassphrase()
        // @ts-ignore: wails generates the wrong type signature for this handler
        await service.RespondToInteraction({
          traceID: event.traceID,
          name: INTERACTION_RESPONSE_TYPE.ENTERED_PASSPHRASE,
          data: {
            passphrase
          }
        })

        if (flow === EVENT_FLOW_TYPE.PERMISSION_REQUEST) {
          const source = history.find(
            interaction =>
              interaction.event.name ===
              INTERACTION_TYPE.REQUEST_PERMISSIONS_REVIEW
          )

          if (
            source &&
            source.event.name === INTERACTION_TYPE.REQUEST_PERMISSIONS_REVIEW
          ) {
            const { wallet, hostname } = source?.event.data

            const { permissions } = await service.WalletApi.DescribePermissions(
              {
                wallet,
                passphrase,
                hostname
              }
            )

            dispatch({
              type: 'ADD_CONNECTION',
              wallet,
              connection: {
                hostname,
                active: true,
                permissions
              }
            })
          }
        }
      } catch (err: unknown) {
        if (err === 'dismissed') {
          await service.RespondToInteraction({
            traceID: event.traceID,
            name: INTERACTION_RESPONSE_TYPE.CANCEL_REQUEST,
            data: {}
          })
        } else {
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
  }, [dispatch, flow, history, service, event, isResolved, setResolved])

  return null
}
