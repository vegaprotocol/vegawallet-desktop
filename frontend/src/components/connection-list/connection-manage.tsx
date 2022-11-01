import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { Intent } from '../../config/intent'
import type { Wallet } from '../../contexts/global/global-context'
import { useGlobal } from '../../contexts/global/global-context'
import type { WalletModel } from '../../wallet-client'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { ButtonUnstyled } from '../button-unstyled'
import { requestPassphrase } from '../passphrase-modal'
import { AppToaster } from '../toaster'
import { PermissionSection } from './connection-manage-section'

type KeyItem = {
  key: string
  name: string
  value: boolean
}

export type NormalizedPermission = {
  access: WalletModel.AccessMode
  restrictedKeys: KeyItem[]
}

export type NormalizedPermissionMap = Record<
  keyof WalletModel.Permissions,
  NormalizedPermission
>

type CompileResult = {
  permissions: NormalizedPermissionMap
  permissionAccessKeys: Array<keyof WalletModel.Permissions>
}

const compileDefaultValues = (
  wallet: Wallet,
  walletPermissions?: WalletModel.Permissions
): CompileResult => {
  if (!walletPermissions) {
    throw new Error(`Missing permissions for wallet ${wallet.name}.`)
  }

  const permissionAccessKeys = Object.keys(walletPermissions) as Array<
    keyof WalletModel.Permissions
  >
  const keyList = Object.keys(wallet.keypairs)

  const permissions = permissionAccessKeys.reduce<NormalizedPermissionMap>(
    (acc, key) => {
      const p = walletPermissions[key]
      return {
        ...acc,
        [key]: {
          access: p.access,
          restrictedKeys: keyList.reduce<KeyItem[]>((acc, key) => {
            const keypair = wallet.keypairs[key]
            if (!keypair.isTainted) {
              acc.push({
                key,
                name: keypair.name,
                value: p.restrictedKeys?.includes(key) ? false : true
              })
            }
            return acc
          }, [])
        }
      }
    },
    {} as NormalizedPermissionMap
  )

  return {
    permissions,
    permissionAccessKeys
  }
}

const compileSubmissionData = (
  formData: NormalizedPermissionMap
): WalletModel.Permissions => {
  const dataKeys = Object.keys(formData) as Array<keyof WalletModel.Permissions>
  return dataKeys.reduce<WalletModel.Permissions>((acc, key) => {
    const p = formData[key]
    return {
      ...acc,
      [key]: {
        access: p.access,
        restrictedKeys: p.restrictedKeys.reduce<string[]>((acc, item) => {
          if (!item.value) {
            acc.push(item.key)
          }
          return acc
        }, [])
      }
    }
  }, {} as WalletModel.Permissions)
}

type ManageDialogProps = {
  wallet: Wallet
  hostname: string
  onClose: () => void
}

export const ManagePermissions = ({
  wallet,
  hostname,
  onClose
}: ManageDialogProps) => {
  const { service, dispatch } = useGlobal()
  const { permissions, permissionAccessKeys } = useMemo(
    () =>
      compileDefaultValues(wallet, wallet.connections?.[hostname]?.permissions),
    [wallet, hostname]
  )
  const { control, handleSubmit } = useForm({
    defaultValues: {
      ...permissions
    }
  })

  const onUpdate = useCallback(
    async (formData: NormalizedPermissionMap) => {
      try {
        const permissions = compileSubmissionData(formData)
        const passphrase = await requestPassphrase()

        const { permissions: result } =
          await service.WalletApi.UpdatePermissions({
            wallet: wallet.name,
            passphrase,
            hostname,
            permissions
          })

        dispatch({
          type: 'SET_PERMISSONS',
          wallet: wallet.name,
          hostname,
          permissions: result
        })

        onClose()
      } catch (err) {
        if (err !== 'dismissed') {
          AppToaster.show({
            message: `${err}`,
            intent: Intent.DANGER
          })
        }
      }
    },
    [service, dispatch, wallet.name, hostname, onClose]
  )

  return (
    <form onSubmit={handleSubmit(onUpdate)}>
      <div style={{ padding: 20 }}>
        <p>
          <code>{hostname}</code> has access to the following operations in the
          wallet <code>{wallet.name}</code>:
        </p>
        <div>
          {permissionAccessKeys.map(key => (
            <PermissionSection key={key} accessType={key} control={control} />
          ))}
        </div>
      </div>
      <ButtonGroup inline style={{ padding: `0 20px 20px` }}>
        <Button type='submit'>Update</Button>
        <ButtonUnstyled onClick={onClose}>Cancel</ButtonUnstyled>
      </ButtonGroup>
    </form>
  )
}
