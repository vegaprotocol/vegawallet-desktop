import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { FormGroup } from '../../components/form-group'
import { Header } from '../../components/header'
import { requestPassphrase } from '../../components/passphrase-modal'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import { createLogger } from '../../lib/logging'
import { Service } from '../../service'

const logger = createLogger('Sign')

interface FormFields {
  message: string
}

const useSign = (pubKey?: string, wallet?: string) => {
  const [signedData, setSignedData] = useState<string>('')
  const sign = React.useCallback(
    async (values: { message: string }) => {
      try {
        if (!pubKey || !wallet) {
          return
        }

        const passphrase = await requestPassphrase()
        const resp = await Service.SignMessage({
          wallet,
          pubKey,
          // @ts-ignore
          message: btoa(values.message),
          passphrase
        })
        // @ts-ignore
        setSignedData(resp.hexSignature)
        AppToaster.show({
          message: `Message signed successfully`,
          intent: Intent.SUCCESS
        })
      } catch (err) {
        AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
        logger.error(err)
      }
    },
    [pubKey, wallet]
  )
  return {
    signedData,
    setSignedData,
    sign
  }
}

export const Sign = () => {
  const { wallet, pubkey } = useParams<{ wallet: string; pubkey: string }>()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  const { sign, signedData, setSignedData } = useSign(pubkey, wallet)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'min-content 1fr min-content',
        height: '100%'
      }}
    >
      <div style={{ padding: 20 }}>
        <Header style={{ margin: 0 }}>Sign</Header>
      </div>
      <div style={{ padding: 20 }}>
        {signedData ? (
          <>
            <h4>Signed message:</h4>
            <CopyWithTooltip text={signedData}>
              <ButtonUnstyled
                style={{
                  textAlign: 'left',
                  wordBreak: 'break-all',
                  color: Colors.TEXT_COLOR_DEEMPHASISE
                }}
              >
                {signedData}
              </ButtonUnstyled>
            </CopyWithTooltip>
            <Button
              data-testid='sign-more'
              style={{ marginTop: 12 }}
              onClick={() => setSignedData('')}
            >
              Sign more
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit(sign)}>
            <FormGroup
              label='Message'
              labelFor='message'
              helperText={errors.message?.message}
            >
              <textarea
                data-testid='message-field'
                {...register('message', { required: 'Required' })}
              ></textarea>
            </FormGroup>
            <Button data-testid='sign' type='submit'>
              Sign
            </Button>
          </form>
        )}
      </div>
      <div style={{ padding: 20 }}>
        <Link to={`/wallet/${wallet}/keypair/${pubkey}`}>
          <Button>Back</Button>
        </Link>
      </div>
    </div>
  )
}
