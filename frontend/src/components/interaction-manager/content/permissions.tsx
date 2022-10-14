import { useMemo, useEffect } from 'react'
import { Intent } from '../../../config/intent'
import { useGlobal } from '../../../contexts/global/global-context'
import { AppToaster } from '../../toaster'
import { Dialog } from '../../dialog'
import { Button } from '../../button'
import { ButtonUnstyled } from '../../button-unstyled'
import { ButtonGroup } from '../../button-group'
import { ChevronLeft } from '../../icons/chevron-left'
import type {
  InteractionContentProps,
  RequestPermissions,
  RequestPermissionsContent,
} from '../types'
import {
  PermissionTarget,
  PermissionType,
} from '../types'
import { INTERACTION_RESPONSE_TYPE } from '../types'

const getPermissionAction = (data: RequestPermissionsContent, target: PermissionTarget, type: PermissionType) => {
  switch (`${type}:${target}`) {
    case `${PermissionType.READ}:${PermissionTarget.PUBLIC_KEYS}`: {
      return `access to see all your public keys for ${data.wallet}.`
    }
    default: {
      return `to ${type} your ${target.replace('_', ' ')} for ${data.wallet}.`
    }
  }
}

const getDisplayDetails = (data: RequestPermissionsContent) => {
  const targets = Object.keys(data.permissions) as PermissionTarget[]
  const requestText = <><strong>{data.hostname}</strong> is requesting</>

  if (targets.length === 1) {
    return (
      <p style={{ paddingBottom: 20 }}>
        {requestText} {getPermissionAction(data, targets[0], data.permissions[targets[0]])}
      </p>
    )
  }

  return (
    <div style={{ paddingBottom: 20 }}>
      <p>{requestText}</p>
      <ul style={{ margin: '12px 0' }}>
        {targets.map(target => (
          <li key={target} style={{ marginLeft: 12 }}>
            <ChevronLeft style={{ marginRight: 6, width: 13, transform: 'scale(-1, 1)' }} />
            {getPermissionAction(data, target, data.permissions[target])}
          </li>
        ))}
      </ul>
    </div>
  )
}

export const Permissions = ({
  interaction,
}: InteractionContentProps<RequestPermissions>) => {
  const { service } = useGlobal()
  const message = useMemo(() => {
    return getDisplayDetails(interaction.event.data)
  }, [interaction])

  const onAccept = async (decision: boolean) => {
    try {
      // @ts-ignore: wails generates the wrong type signature for this handler
      await service.RespondToInteraction({
        traceID: interaction.event.traceID,
        name: INTERACTION_RESPONSE_TYPE.DECISION,
        data: {
          approved: decision,
        }
      })
    } catch (err: unknown) {
      AppToaster.show({
        message: `${err}`,
        intent: Intent.DANGER
      })
    }
  }

  return (
    <Dialog open={true} title="Wallet permissions">
      <div style={{ padding: '0 20px 20px'}}>
        {message}
        <ButtonGroup inline>
          <Button onClick={() => onAccept(true)}>
            Approve
          </Button>
          <ButtonUnstyled onClick={() => onAccept(false)}>
            Cancel
          </ButtonUnstyled>
        </ButtonGroup>
      </div>
    </Dialog>
  )
}
