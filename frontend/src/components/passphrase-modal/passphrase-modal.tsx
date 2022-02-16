import './passphrase-modal.css'

import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'
import { useForm } from 'react-hook-form'

import { Intent } from '../../config/intent'
import { setPassphraseModalAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { Validation } from '../../lib/form-validation'
import { Button } from '../button'
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
    <Dialog.Root open={state.passphraseModalOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            height: '100%',
            background: 'rgba(54, 54, 54 ,0.8)',
            animation: 'fade-in .2s ease',
            animationFillMode: 'forwards'
          }}
        />
        <Dialog.Content
          onPointerDownOutside={close}
          style={{
            padding: 20,
            background: 'black',
            width: 340,
            position: 'fixed',
            top: 30,
            left: 'calc(50% - 170px)',
            boxShadow: '3px 3px 5px rgb(0,0,0,0.3)',
            animation: 'fade-in .2s ease',
            animationFillMode: 'forwards'
          }}
        >
          <PassphraseModalForm onSubmit={onSubmit} onCancel={close} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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
        label='Passphrase'
        labelFor='passphrase'
        helperText={errors.passphrase?.message}
        intent={errors.passphrase?.message ? Intent.DANGER : Intent.NONE}
      >
        <input
          data-testid='input-passphrase'
          type='password'
          autoComplete='off'
          autoFocus={true}
          {...register('passphrase', { required: Validation.REQUIRED })}
        />
      </FormGroup>
      <div style={{ display: 'flex', gap: 10 }}>
        <Button data-testid='input-submit' type='submit'>Submit</Button>
        <Button data-testid='input-cancel' onClick={onCancel}>Cancel</Button>
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
