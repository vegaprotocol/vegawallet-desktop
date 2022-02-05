import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { BreakText } from '../../components/break-text'
import { Button } from '../../components/button'
import { FormGroup } from '../../components/form-group'
import { Header } from '../../components/header'
import { requestPassphrase } from '../../components/passphrase-modal'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../'

interface FormFields {
  message: string
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

  const [signedData, setSignedData] = useState<string>('')
  const submit = React.useCallback(
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
  return (
    <>
      <Header style={{ marginTop: 32, fontSize: 18 }}>Sign</Header>
      <form onSubmit={handleSubmit(submit)}>
        <FormGroup
          label='Message'
          labelFor='message'
          helperText={errors.message?.message}
        >
          <textarea
            {...register('message', { required: 'Required' })}
          ></textarea>
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
              {signedData} <Copy style={{ width: 13, height: 13 }} />
            </ButtonUnstyled>
          </CopyWithTooltip>
        </>
      )}
    </>
  )
}

export function WalletKeyPair() {
  const {
    state: { wallet }
  } = useGlobal()
  const { pubkey } = useParams<{ pubkey: string }>()
  const keypair = wallet?.keypairs?.find(kp => kp.publicKey === pubkey)

  if (!keypair) {
    return <Navigate to={Paths.Wallet} />
  }

  return (
    <div style={{ padding: 20 }}>
      <Header style={{ marginTop: 0 }}>
        Keypair name:{' '}
        <span style={{ color: Colors.TEXT_COLOR_DEEMPHASISE }}>
          {keypair.name}
        </span>
      </Header>
      <Header style={{ marginTop: 0, fontSize: 18 }}>Details</Header>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <td data-testid='keypair-name'>{keypair.name}</td>
          </tr>
          <tr>
            <th>Public key</th>
            <td data-testid='public-key'>
              <BreakText>{keypair.publicKey}</BreakText>
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: 20 }}>
        <Link to={Paths.Wallet}>
          <Button>Back</Button>
        </Link>
      </div>
      <Sign wallet={wallet.name} pubKey={keypair.publicKey} />
    </div>
  )
}
