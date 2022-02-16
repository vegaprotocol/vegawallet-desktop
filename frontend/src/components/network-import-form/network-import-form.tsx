import React from 'react'
import type { FieldError } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { Intent } from '../../config/intent'
import { FormStatus } from '../../hooks/use-form-state'
import { useImportNetwork } from '../../hooks/use-import-network'
import { Validation } from '../../lib/form-validation'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { FormGroup } from '../form-group'

interface FormFields {
  name: string
  fileOrUrl: string
  force: boolean
}

interface NetworkImportFormProps {
  onComplete?: () => void
}

export function NetworkImportForm({ onComplete }: NetworkImportFormProps) {
  const [showOverwriteCheckbox, setShowOverwriteCheckbox] =
    React.useState(false)
  const { status, submit, error } = useImportNetwork()
  const {
    control,
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormFields>({
    defaultValues: {
      name: '',
      fileOrUrl: '',
      force: false
    }
  })

  React.useEffect(() => {
    if (status === FormStatus.Success) {
      reset()
      setShowOverwriteCheckbox(false)
      if (typeof onComplete === 'function') {
        onComplete()
      }
    }
  }, [status, reset, onComplete])

  // If an error is set and its the 'wallet already exists' error, open the advanced fields section
  // set the name
  React.useEffect(() => {
    if (status === FormStatus.Error && error && /already exists/.test(error)) {
      setShowOverwriteCheckbox(true)
      setError(
        'name',
        {
          message:
            'Network with name already exists. Provide a new name or overwrite by checking the box below'
        },
        { shouldFocus: true }
      )
    }
  }, [error, status, setError])

  const renderFileOrUrlHelperText = (error: FieldError | undefined) => {
    if (error) {
      return error.message
    }

    return 'Enter a path to a configuration file for a new network, for example https://mynetwork.com/config.toml or /file/on/mysystem/config.toml'
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <FormGroup
        label='URL or path'
        labelFor='fileOrUrl'
        intent={errors.fileOrUrl?.message ? Intent.DANGER : Intent.NONE}
        helperText={renderFileOrUrlHelperText(errors.fileOrUrl)}
      >
        <input
          data-testid='url-path'
          id='fileOrUrl'
          type='text'
          {...register('fileOrUrl', {
            required: Validation.REQUIRED
          })}
        />
      </FormGroup>
      <FormGroup
        label='Network name'
        labelFor='name'
        intent={errors.name?.message ? Intent.DANGER : Intent.NONE}
        helperText={
          errors.name
            ? errors.name?.message
            : 'Uses name specified in the config by default'
        }
      >
        <input
          data-testid='network-name'
          type='text'
          id='name'
          {...register('name')}
        />
      </FormGroup>
      {showOverwriteCheckbox && (
        <FormGroup helperText='Overwrite existing network configuration'>
          <Checkbox name='force' control={control} label='Overwrite' />
        </FormGroup>
      )}
      <div>
        <Button
          data-testid='import'
          type='submit'
          loading={status === FormStatus.Pending}
        >
          Import
        </Button>
      </div>
    </form>
  )
}
