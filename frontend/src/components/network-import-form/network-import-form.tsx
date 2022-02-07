import React from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { FormGroup } from '../form-group'
import { Intent } from '../../config/intent'
import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { Checkbox } from '../checkbox'
import { useImportNetwork } from '../../hooks/use-import-network'
import { FormStatus } from '../../hooks/use-form-state'
import { Validation } from '../../lib/form-validation'

interface FormFields {
  name: string
  fileOrUrl: string
  force: boolean
}

export function NetworkImportForm({ onComplete }: { onComplete?: () => void }) {
  const [showOverwriteCheckbox, setShowOverwriteCheckbox] =
    React.useState(false)
  const { status, response, submit, error } = useImportNetwork()
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
    if (response) {
      reset()
      setShowOverwriteCheckbox(false)
      if (typeof onComplete === 'function') {
        onComplete()
      }
    }
  }, [response, reset, onComplete])

  // If an error is set and its the 'wallet already exists' error, open the advanced fields section
  // set the namee
  React.useEffect(() => {
    if (error && /already exists/.test(error)) {
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
  }, [error, setError])

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
        <input type='text' id='name' {...register('name')} />
      </FormGroup>
      {showOverwriteCheckbox && (
        <FormGroup helperText='Overwrite existing network configuration'>
          <Checkbox name='force' control={control} label='Overwrite' />
        </FormGroup>
      )}
      <div>
        <Button type='submit' loading={status === FormStatus.Pending}>
          Import
        </Button>
      </div>
    </form>
  )
}
