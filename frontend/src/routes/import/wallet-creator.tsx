import React from 'react'
import { CreateWallet } from '../../api/service'
import { FormGroup } from '../../components/form-group'
import { useForm, useWatch } from 'react-hook-form'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { CreateWalletResponse } from '../../models/create-wallet'
import { Link } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
import { CodeBlock } from '../../components/code-block'
import { useGlobal } from '../../contexts/global/global-context'
import { addWalletAction } from '../../contexts/global/global-actions'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { Copy } from '../../components/icons/copy'
import { Paths } from '../router-config'

interface FormFields {
  name: string
  passphrase: string
  confirmPassphrase: string
}

export const WalletCreator = () => {
  const { dispatch } = useGlobal()
  const [response, setResponse] = React.useState<CreateWalletResponse | null>(
    null
  )

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  const passphrase = useWatch({ control, name: 'passphrase' })

  const onSubmit = async (values: FormFields) => {
    try {
      const resp = await CreateWallet({
        Name: values.name,
        Passphrase: values.passphrase
      })
      if (resp) {
        setResponse(resp)
        AppToaster.show({
          message: 'Wallet created!',
          color: Colors.GREEN
        })
        dispatch(addWalletAction(values.name))
      } else {
        AppToaster.show({ message: 'Error: Unknown', color: Colors.RED })
      }
    } catch (err) {
      AppToaster.show({ message: `Error: ${err}`, color: Colors.RED })
    }
  }

  return response ? (
    <>
      <BulletHeader tag='h1'>Wallet created</BulletHeader>
      <p>
        Here is your recovery phrase phrase. Please take note of the words below as you
        will need these to restore your wallet!
      </p>
      <p style={{ position: 'relative' }}>
        <CodeBlock>{response.RecoveryPhrase}</CodeBlock>
        <div style={{ position: 'absolute', top: 7, right: 10 }}>
          <CopyWithTooltip text={response.RecoveryPhrase}>
            <ButtonUnstyled>
              <Copy style={{ width: 13, height: 13 }} />
            </ButtonUnstyled>
          </CopyWithTooltip>
        </div>
      </p>
      <Link to={Paths.Home}>
        <button>View wallets</button>
      </Link>
    </>
  ) : (
    <>
      <BulletHeader tag='h1'>Create wallet</BulletHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          label='* Name'
          labelFor='name'
          errorText={errors.name?.message}>
          <input
            type='text'
            {...register('name', { required: 'Required' })}
            autoComplete='off'
          />
        </FormGroup>
        <FormGroup
          label='* Passphrase'
          labelFor='passphrase'
          errorText={errors.passphrase?.message}>
          <input
            type='password'
            {...register('passphrase', { required: 'Required' })}
          />
        </FormGroup>
        <FormGroup
          label='* Confirm passphrase'
          labelFor='confirmPassphrase'
          errorText={errors.confirmPassphrase?.message}>
          <input
            type='password'
            {...register('confirmPassphrase', {
              required: 'Required',
              pattern: {
                message: 'Password does not match',
                value: new RegExp(`^${passphrase}$`)
              }
            })}
          />
        </FormGroup>
        <div>
          <button type='submit'>Submit</button>
        </div>
      </form>
    </>
  )
}
