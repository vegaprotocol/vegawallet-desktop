import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { SignMessage } from '../../api/service'
import { Button } from '../../components/button'
import { FormGroup } from '../../components/form-group'
import { Header } from '../../components/header'
import { requestPassphrase } from '../../components/passphrase-modal'
import { Colors } from '../../config/colors'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { ButtonUnstyled } from '../../components/button-unstyled'

interface FormFields {
  message: string
}

const useSign = (pubKey: string, wallet: string) => {
  const [signedData, setSignedData] = useState<string>('')
  const sign = React.useCallback(
    async (values: { message: string }) => {
      try {
        const passphrase = await requestPassphrase()
        const resp = await SignMessage({
          wallet,
          pubKey,
          message: btoa(values.message),
          passphrase
        })
        setSignedData(resp.hexSignature)
      } catch (e) {
        console.log(e)
      }
    },
    [pubKey, wallet]
  )
  return {
    signedData,
    sign
  }
}

export const Sign = ({
  wallet,
  pubKey
}: {
  wallet: string
  pubKey: string
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  const { sign, signedData } = useSign(pubKey, wallet)
  return (
    <>
      <Header style={{ marginTop: 32, fontSize: 18 }}>Sign</Header>
      <form onSubmit={handleSubmit(sign)}>
        <FormGroup
          label='Message'
          labelFor='message'
          helperText={errors.message?.message}
        >
          <textarea
            {...register('message', { required: 'Required' })}
          />
        </FormGroup>
        <Button type='submit'>Sign</Button>
      </form>
      {signedData && (
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
        </>
      )}
    </>
  )
}
