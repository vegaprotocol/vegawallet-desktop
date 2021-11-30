import React from 'react'
import { CreateWallet } from '../../api/service'
import { FormGroup } from '../../components/form-group'
import { useForm, useWatch } from 'react-hook-form'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import {
  CreateWalletRequest,
  CreateWalletResponse
} from '../../models/create-wallet'
import { Link } from 'react-router-dom'
import { Styles } from './styles'

interface FormFields {
  vegaHome: string
  name: string
  passphrase: string
  confirmPassphrase: string
}

export interface WalletCreatorProps {
  request: CreateWalletRequest
}

export const WalletCreator = ({ request }: WalletCreatorProps) => {
  const [advancedOpen, setAdvancedOpen] = React.useState(false)
  const [response, setResponse] = React.useState<CreateWalletResponse | null>(
    null
  )

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>({
    defaultValues: {
      vegaHome: request.VegaHome,
      name: request.Name,
      passphrase: request.Passphrase
    }
  })
  const passphrase = useWatch({ control, name: 'passphrase' })

  const onSubmit = async (values: FormFields) => {
    try {
      const resp = await CreateWallet({
        VegaHome: values.vegaHome,
        Name: values.name,
        Passphrase: values.passphrase
      })
      if (resp) {
        setResponse(resp)
        AppToaster.show({
          message: 'Wallet created!',
          color: Colors.GREEN
        })
      } else {
        AppToaster.show({ message: 'Error: Unknown', color: Colors.RED })
      }
    } catch (err) {
      AppToaster.show({ message: `Error: ${err}`, color: Colors.RED })
    }
  }

  return response ? (
    <>
      <p>
        Here is your mnemonic phrase. Please take note of the words below as you
        will need these to restore your wallet!
      </p>
      <pre style={Styles.mnemonic}>{response.Mnemonic}</pre>
      <Link to='/'>
        <button>View wallets</button>
      </Link>
    </>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup
        label='* Name'
        labelFor='name'
        errorText={errors.name?.message}>
        <input type='text' {...register('name', { required: 'Required' })} />
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
      <FormGroup>
        <button
          type='button'
          onClick={() => setAdvancedOpen(x => !x)}
          className='link'>
          {advancedOpen ? 'Hide advanced options' : 'Show advanced options'}
        </button>
      </FormGroup>
      {advancedOpen && (
        <FormGroup
          label='Vega home (leave blank for defaults)'
          labelFor='vegaHome'
          errorText={errors.vegaHome?.message}>
          <input type='text' {...register('vegaHome')} />
        </FormGroup>
      )}
      <div>
        <button type='submit'>Submit</button>
      </div>
    </form>
  )
}
