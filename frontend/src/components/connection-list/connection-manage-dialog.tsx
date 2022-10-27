import { useMemo, useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { Intent } from '../../config/intent'
import type { Wallet } from '../../contexts/global/global-context'
import { useGlobal } from '../../contexts/global/global-context'
import { Dialog } from '../dialog'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { ButtonUnstyled } from '../button-unstyled'
import { AppToaster } from '../toaster'
import { PermissionSection } from './connection-manage-section'
import { requestPassphrase } from '../passphrase-modal'

type ManageDialogProps = {
  isOpen: boolean
  wallet: Wallet
  hostname: string
  onClose: () => void
}

export const ManageDialog = ({
  isOpen,
  wallet,
  hostname,
  onClose
}: ManageDialogProps) => {
  const { service, dispatch } = useGlobal()
  const permissions = useMemo(() => (
    wallet.connections?.[hostname].permissions
  ), [wallet.connections])
  const { control, handleSubmit } = useForm({
    defaultValues: permissions || {},
  })

  const onUpdate = useCallback(() => async () => {
    try {
      const passphrase = await requestPassphrase()

      const { permissions } = await service.WalletApi.UpdatePermissions({
        wallet: wallet.name,
        passphrase,
        hostname,
        permissions: {
          publicKeys: {
            access: 'read',
            restrictedKeys: []
          }
        }
      })

      dispatch({
        type: 'SET_PERMISSONS',
        wallet: wallet.name,
        hostname,
        permissions,
      })
    } catch (err) {
      if (err !== 'dismissed') {
        AppToaster.show({
          message: `${err}`,
          intent: Intent.DANGER
        })
      }
    }
  }, [service, dispatch])

  return (
    <Dialog open={isOpen} title='Update permissions' onChange={onClose}>
      <form onSubmit={handleSubmit(onUpdate)}>
        <div style={{ padding: 20 }}>
          <p>
            <code>{hostname}</code> has access to the following operations in the
            wallet <code>{wallet.name}</code>:
          </p>
          <div>
            {Object.keys(permissions || {}).map(key => (
              <PermissionSection
                key={key}
                type={key}
                wallet={wallet}
                control={control}
              />
            ))}
          </div>
        </div>
        <ButtonGroup inline style={{ padding: 20 }}>
          <Button type="submit">Update</Button>
          <ButtonUnstyled onClick={onClose}>Cancel</ButtonUnstyled>
        </ButtonGroup>
      </form>
    </Dialog>
  )
}
