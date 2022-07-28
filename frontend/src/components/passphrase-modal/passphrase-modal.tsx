import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Intent } from '../../config/intent'
import { setPassphraseModalAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { Validation } from '../../lib/form-validation'
import { Button } from '../button'
import { Dialog } from '../dialog'
import { FormGroup } from '../form-group'
import { Input } from '../forms/input'

interface ModalHandler {
  open: Function
  resolve: Function
  close: Function
}

const handler: ModalHandler = {
  open: () => undefined,
  resolve: () => undefined,
  close: () => undefined
}

interface FormFields {
  passphrase: string
}

export function PassphraseModal() {
  const [loading, setLoading] = useState(false)
  const { state, dispatch } = useGlobal()

  // Register handler.open to open the passphrase modal
  useEffect(() => {
    handler.open = () => {
      dispatch(setPassphraseModalAction(true))
    }
  }, [dispatch])

  function onSubmit(passphrase: string) {
    setLoading(true)
    handler.resolve(passphrase)

    // Show spinner and prevent modal closing before route change which causes
    // causes some slight jankiness.
    dispatch(setPassphraseModalAction(false))
    setLoading(false)
  }

  function close() {
    handler.close()
    dispatch(setPassphraseModalAction(false))
    setLoading(false)
  }

  return (
    <Dialog open={state.passphraseModalOpen}>
      <PassphraseModalForm
        onSubmit={onSubmit}
        onCancel={close}
        loading={loading}
      />
    </Dialog>
  )
}

interface PassphraseModalFormProps {
  onSubmit: (passphrase: string) => void
  onCancel: () => void
  loading: boolean
}

function PassphraseModalForm({
  onSubmit,
  onCancel,
  loading
}: PassphraseModalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  return (
    <form
      onSubmit={handleSubmit(values => onSubmit(values.passphrase))}
      data-testid='passphrase-form'
    >
      <FormGroup
        label='Passphrase'
        labelFor='passphrase'
        helperText={errors.passphrase?.message}
        intent={errors.passphrase?.message ? Intent.DANGER : Intent.NONE}
      >
        <Input
          data-testid='input-passphrase'
          type='password'
          autoComplete='off'
          autoFocus={true}
          {...register('passphrase', { required: Validation.REQUIRED })}
        />
      </FormGroup>
      <div style={{ display: 'flex', gap: 10 }}>
        <Button data-testid='input-submit' type='submit' loading={loading}>
          Submit
        </Button>
        <Button data-testid='input-cancel' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export function requestPassphrase(): Promise<string> {
  return new Promise((resolve, reject) => {
    handler.open()
    handler.resolve = (passphrase: string) => {
      resolve(passphrase)
    }
    handler.close = () => {
      reject('dismissed')
    }
  })
}
