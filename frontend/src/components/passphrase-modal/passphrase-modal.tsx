import React from 'react'
import { Overlay } from '@blueprintjs/core'
import { useGlobal } from '../../contexts/global/global-context'
import { setPassphraseModalAction } from '../../contexts/global/global-actions'
import { useForm } from 'react-hook-form'
import { FormGroup } from '../form-group'

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
  const { state, dispatch } = useGlobal()

  // Register handler.open to open the passphrase modal
  React.useEffect(() => {
    handler.open = () => {
      dispatch(setPassphraseModalAction(true))
    }
  }, [dispatch])

  function onSubmit(passphrase: string) {
    handler.resolve(passphrase)
    dispatch(setPassphraseModalAction(false))
  }

  function close() {
    handler.close()
    dispatch(setPassphraseModalAction(false))
  }

  return (
    <Overlay
      isOpen={state.passphraseModalOpen}
      transitionDuration={0}
      onClose={close}>
      <div
        style={{
          padding: 20,
          background: 'black',
          width: 250,
          position: 'fixed',
          top: 30,
          left: 'calc(50% - 125px)'
        }}>
        <PassphraseModalForm onSubmit={onSubmit} onCancel={close} />
      </div>
    </Overlay>
  )
}

interface PassphraseModalFormProps {
  onSubmit: (passphrase: string) => void
  onCancel: () => void
}

function PassphraseModalForm({ onSubmit, onCancel }: PassphraseModalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  return (
    <form onSubmit={handleSubmit(values => onSubmit(values.passphrase))}>
      <FormGroup
        label='* Passphrase'
        labelFor='passphrase'
        errorText={errors.passphrase?.message}>
        <input
          type='password'
          autoComplete='off'
          autoFocus={true}
          {...register('passphrase', { required: 'Required' })}
        />
      </FormGroup>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type='submit'>Submit</button>
        <button type='button' onClick={onCancel}>
          Cancel
        </button>
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
