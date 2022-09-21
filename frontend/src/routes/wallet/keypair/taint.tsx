import { useCallback, useState } from 'react'

import { BreakText } from '../../../components/break-text'
import { Button } from '../../../components/button'
import { Header } from '../../../components/header'
import { KeyValueTable } from '../../../components/key-value-table'
import { requestPassphrase } from '../../../components/passphrase-modal'
import { AppToaster } from '../../../components/toaster'
import { Intent } from '../../../config/intent'
import type { GlobalActions } from '../../../contexts/global/global-actions'
import type { GlobalDispatch } from '../../../contexts/global/global-context'
import { useGlobal } from '../../../contexts/global/global-context'
import { useCurrentKeypair } from '../../../hooks/use-current-keypair'
import { createLogger } from '../../../lib/logging'

const logger = createLogger('Taint')

const useTaint = (
  dispatch: GlobalDispatch,
  actions: GlobalActions,
  pubKey?: string,
  wallet?: string
) => {
  const { service } = useGlobal()
  const [loading, setLoading] = useState(false)

  const taint = useCallback(async () => {
    setLoading(true)
    try {
      if (!pubKey || !wallet) {
        return
      }

      const passphrase = await requestPassphrase()
      await service.WalletApi.TaintKey(
        wallet,
        passphrase,
        pubKey,
      )

      const keypair = await service.WalletApi.DescribeKey(
        wallet,
        passphrase,
        pubKey,
      )

      dispatch(actions.updateKeyPairAction(wallet, keypair))

      setLoading(false)
      AppToaster.show({
        message: `This key has been tainted`,
        intent: Intent.SUCCESS
      })
    } catch (err) {
      setLoading(false)
      AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
      logger.error(err)
    }
  }, [dispatch, service, actions, pubKey, wallet])

  const untaint = useCallback(async () => {
    setLoading(true)
    try {
      if (!pubKey || !wallet) {
        return
      }

      const passphrase = await requestPassphrase()
      await service.WalletApi.UntaintKey(
        wallet,
        passphrase,
        pubKey,
      )

      const keypair = await service.WalletApi.DescribeKey(
        wallet,
        passphrase,
        pubKey,
      )

      dispatch(actions.updateKeyPairAction(wallet, keypair))

      setLoading(false)
      AppToaster.show({
        message: `This key has been untainted`,
        intent: Intent.SUCCESS
      })
    } catch (err) {
      setLoading(false)
      AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
      logger.error(err)
    }
  }, [dispatch, service, actions, pubKey, wallet])

  return {
    loading,
    taint,
    untaint
  }
}

export const Taint = () => {
  const { actions, dispatch } = useGlobal()
  const { keypair, wallet } = useCurrentKeypair()
  const { loading, taint, untaint } = useTaint(
    dispatch,
    actions,
    keypair?.publicKey,
    wallet?.name
  )

  if (!keypair) {
    return null
  }

  return (
    <div data-testid='keypair-taint' style={{ padding: 20 }}>
      <Header style={{ marginTop: 0 }}>Taint key</Header>
      {keypair.isTainted && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ marginBottom: 10 }}>
            This key has been marked as tainted.
          </p>
          <p>
            You may have tained a key pair by mistake but if you tained a key
            for secuirty reasons, you should not untaint it.
          </p>
        </div>
      )}
      {!keypair.isTainted && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ marginBottom: 10 }}>
            Tainting a key pair marks it as unsafe to use and ensures it will
            not be used to sign transactions while it is tainted. You can choose
            to un-taint a key whenever you want.
          </p>
          <p>
            This mechanism is useful when the key pair has been compromised.
          </p>
        </div>
      )}
      <KeyValueTable
        style={{ marginBottom: 20 }}
        rows={[
          {
            key: 'Public key',
            value: <BreakText>{keypair.publicKey}</BreakText>,
            dataTestId: 'public-key'
          }
        ]}
      />
      <Button
        data-testid='taint-action'
        disabled={loading}
        onClick={() => {
          if (keypair.isTainted) {
            untaint()
          } else {
            taint()
          }
        }}
      >
        {keypair.isTainted ? 'Untaint this key' : 'Taint this key'}
      </Button>
    </div>
  )
}
