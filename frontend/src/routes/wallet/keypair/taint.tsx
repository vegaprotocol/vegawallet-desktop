import { useCallback,useState } from 'react'

import { BreakText } from '../../../components/break-text'
import { Button } from '../../../components/button'
import { Header } from '../../../components/header'
import { KeyValueTable } from '../../../components/key-value-table'
import { requestPassphrase } from '../../../components/passphrase-modal'
import { AppToaster } from '../../../components/toaster'
import { Intent } from '../../../config/intent'
import { updateKeyPairAction } from '../../../contexts/global/global-actions'
import type { GlobalDispatch } from '../../../contexts/global/global-context';
import { useGlobal } from '../../../contexts/global/global-context'
import { useCurrentKeypair } from '../../../hooks/use-current-keypair'
import { createLogger } from '../../../lib/logging'
import { Service } from '../../../service'

const logger = createLogger('Taint')

const useTaint = (dispatch: GlobalDispatch, pubKey?: string, wallet?: string) => {
  const [loading, setLoading] = useState(false);

  const taint = useCallback(
    async () => {
      setLoading(true);
      try {
        if (!pubKey || !wallet) {
          return
        }

        const passphrase = await requestPassphrase()
        await Service.TaintKey({
          wallet,
          pubKey,
          passphrase
        });

        const keypair = await Service.DescribeKey({
          wallet,
          pubKey,
          passphrase
        });

        dispatch(updateKeyPairAction(wallet, keypair));

        setLoading(false);
        AppToaster.show({
          message: `This key has been tainted`,
          intent: Intent.SUCCESS
        })
      } catch (err) {
        setLoading(false);
        AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
        logger.error(err)
      }
    },
    [dispatch, pubKey, wallet]
  )

  const untaint = useCallback(
    async () => {
      setLoading(true);
      try {
        if (!pubKey || !wallet) {
          return
        }

        const passphrase = await requestPassphrase()
        await Service.UntaintKey({
          wallet,
          pubKey,
          passphrase
        });

        const keypair = await Service.DescribeKey({
          wallet,
          pubKey,
          passphrase
        });

        dispatch(updateKeyPairAction(wallet, keypair));

        setLoading(false);
        AppToaster.show({
          message: `This key has been untainted`,
          intent: Intent.SUCCESS
        })
      } catch (err) {
        setLoading(false);
        AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
        logger.error(err)
      }
    },
    [dispatch, pubKey, wallet]
  )
  return {
    loading,
    taint,
    untaint,
  }
}

export const Taint = () => {
  const { dispatch } = useGlobal()
  const { keypair, wallet } = useCurrentKeypair()
  const { loading, taint, untaint } = useTaint(
    dispatch,
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
          <p>This key has been marked as tainted.</p>
          <p>You may have tained a key pair by mistake but if you tained a key for secuirty reasons, you should not untaint it.</p>
        </div>
      )}
      {!keypair.isTainted && (
        <div style={{ marginBottom: 20 }}>
          <p>Tainting a key pair marks it as unsafe to use and ensures it will not be used to sign transactions while it is tainted. You can choose to un-taint a key whenever you want.</p>
          <p>This mechanism is useful when the key pair has been compromised.</p>
        </div>
      )}
      <KeyValueTable rows={[
        {
            key: 'Public key',
            value: <BreakText>{keypair.publicKey}</BreakText>,
            dataTestId: 'public-key'
          }
      ]}/>
      <Button
        data-testid="taint-action"
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
