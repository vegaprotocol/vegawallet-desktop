import { useState, useEffect } from 'react'
import type { FieldError } from 'react-hook-form'
import { useForm, useWatch, Controller } from 'react-hook-form'

import { Intent } from '../../config/intent'
import { useGlobal } from '../../contexts/global/global-context'
import { FormStatus } from '../../hooks/use-form-state'
import { useImportNetwork } from '../../hooks/use-import-network'
import { Validation } from '../../lib/form-validation'
import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { Checkbox } from '../checkbox'
import { FormGroup } from '../form-group'
import { DropdownMenu, DropdownItem } from '../dropdown-menu'
import { DropdownArrow } from '../icons/dropdown-arrow'
import { Input } from '../forms/input'

interface FormFields {
  name: string
  network: string
  fileOrUrl: string
  force: boolean
}

interface NetworkImportFormProps {
  onComplete?: () => void
}

export function NetworkImportForm({ onComplete }: NetworkImportFormProps) {
  const [showTestNetworks, setShowTestNetworks] = useState(false)
  const [showOverwriteCheckbox, setShowOverwriteCheckbox] = useState(false)
  const {
    state: { networks, presets, presetsInternal }
  } = useGlobal()
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
      network: '',
      fileOrUrl: '',
      force: false
    }
  })

  const presetNetwork = useWatch({ name: 'network', control })

  useEffect(() => {
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
  useEffect(() => {
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
        label='Network'
        labelFor='network'
        intent={errors.network?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.network?.message}
      >
        <Controller
          name="network"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <DropdownMenu
              trigger={
                <Button
                  data-testid='network-select'
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 5,
                    minWidth: 75
                  }}
                >
                  <span>{field.value || 'Please select'}</span>
                  <DropdownArrow
                    style={{ width: 13, height: 13, marginLeft: 10 }}
                  />
                </Button>
              }
              content={
                <div>
                  {presets.map(preset => {
                    const isAlreadyImported = Boolean(networks.find(n => n === preset.name))
                    return (
                      <DropdownItem key={preset.name}>
                        <ButtonUnstyled
                          data-testid={`select-${preset.name}`}
                          disabled={isAlreadyImported}
                          style={{
                            width: '100%',
                            padding: '10px 15px',
                            lineHeight: 1,
                            textAlign: 'left'
                          }}
                          onClick={() => field.onChange(preset.name)}
                        >
                          {preset.name.toUpperCase()}{isAlreadyImported ? ' (already imported)' : ''}
                        </ButtonUnstyled>
                      </DropdownItem>
                    )
                  })}
                  {showTestNetworks && presetsInternal.map(preset => {
                    const isAlreadyImported = Boolean(networks.find(n => n === preset.name))
                    return (
                      <DropdownItem key={preset.name}>
                        <ButtonUnstyled
                          data-testid={`select-${preset.name}`}
                          disabled={isAlreadyImported}
                          style={{
                            width: '100%',
                            padding: '10px 15px',
                            lineHeight: 1,
                            textAlign: 'left'
                          }}
                          onClick={() => field.onChange(preset.name)}
                        >
                          {preset.name.toUpperCase()}{isAlreadyImported ? ' (already imported)' : ''}
                        </ButtonUnstyled>
                      </DropdownItem>
                    )
                  })}
                  <hr style={{ margin: '10px 15px' }}/>
                  <DropdownItem>
                    <ButtonUnstyled
                      style={{
                        width: '100%',
                        padding: '10px 15px',
                        lineHeight: 1,
                        textAlign: 'left'
                      }}
                      onClick={() => field.onChange('other')}
                    >
                      Other
                    </ButtonUnstyled>
                  </DropdownItem>
                  <hr style={{ margin: '10px 15px' }}/>
                  <ButtonUnstyled
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      lineHeight: 1,
                      textAlign: 'left'
                    }}
                    onClick={() => setShowTestNetworks(!showTestNetworks)}
                  >
                    {showTestNetworks ? 'Hide test networks' : 'Show test networks'}
                  </ButtonUnstyled>
                </div>
              }
            />
          )}
        />
      </FormGroup>
      {presetNetwork === 'other' && (
        <>
          <FormGroup
            label='URL or path'
            labelFor='fileOrUrl'
            intent={errors.fileOrUrl?.message ? Intent.DANGER : Intent.NONE}
            helperText={renderFileOrUrlHelperText(errors.fileOrUrl)}
          >
            <Input
              id='fileOrUrl'
              type='text'
              data-testid='url-path'
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
            <Input
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
        </>
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
