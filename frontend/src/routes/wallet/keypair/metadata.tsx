import { useState, useCallback, useEffect } from 'react'
import type { DropResult } from 'react-beautiful-dnd'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useFieldArray, useForm } from 'react-hook-form'

import { Button } from '../../../components/button'
import { Input } from '../../../components/forms/input'
import { FormGroup } from '../../../components/form-group'
import { Header } from '../../../components/header'
import { Kebab } from '../../../components/icons/kebab'
import { AppToaster } from '../../../components/toaster'
import { Intent } from '../../../config/intent'
import { Validation } from '../../../lib/form-validation'
import { requestPassphrase } from '../../../components/passphrase-modal'
import { useGlobal } from '../../../contexts/global/global-context'
import { updateKeyPairAction } from '../../../contexts/global/global-actions'
import { useCurrentKeypair } from '../../../hooks/use-current-keypair'
import { createLogger } from '../../../lib/logging'
import { Colors } from '../../../config/colors'
import { Service } from '../../../service'
import { AnnotateKeyRequest } from '../../../wailsjs/go/models'
import type { GlobalDispatch } from '../../../contexts/global/global-context';
import type { Meta } from '../../../wailsjs/go/models'

const notName = (value: string) => value === 'name' ? 'Name is already in use' : true

const rowStyles = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '20px 1fr 1fr auto',
  gap: 12,
}

const cellStyles = {
  display: 'flex',
  alignItems: 'center',
  height: 40,
  marginTop: 5
}

const underlined = {
  textDecoration: 'underline',
}

const logger = createLogger('Metadata')

const useMetaUpdate = (dispatch: GlobalDispatch, pubKey?: string, wallet?: string) => {
  const [loading, setLoading] = useState(false)

  const update = useCallback(async (metadata: Meta[]) => {
    setLoading(true)
    try {
      if (!pubKey || !wallet) {
        return
      }

      const passphrase = await requestPassphrase()
      await Service.AnnotateKey(new AnnotateKeyRequest({
        wallet,
        pubKey,
        metadata,
        passphrase,
      }))

      const keypair = await Service.DescribeKey({
        wallet,
        passphrase,
        pubKey,
      })

      dispatch(updateKeyPairAction(wallet, keypair));

      AppToaster.show({
        message: `Successfully updated metadata`,
        intent: Intent.SUCCESS
      })
      setLoading(false)
    } catch (err) {
      setLoading(false)
      AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
      logger.error(err)
    }
  }, [])

  return {
    loading,
    update,
  }
}

export const Metadata = () => {
  const { dispatch } = useGlobal()
  const { keypair, wallet } = useCurrentKeypair()
  const { loading, update } = useMetaUpdate(
    dispatch,
    keypair?.publicKey,
    wallet?.name
  )
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      meta: keypair?.meta || [],
    },
  })
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'meta',
  });

  const onSubmit = useCallback((result: { meta: Meta[] }) => {
    update(result.meta)
  }, [update])

  const handleDragEnd = useCallback((result: DropResult) => {
    console.log('DROP EVENT!!!', result.source.index, result.destination)
    move(result.source.index, result.destination?.index ?? result.source.index)
  }, [move])

  if (!keypair) {
    return null
  }

  return (
    <div data-testid='keypair-metadata' style={{ padding: 20 }}>
      <Header style={{ marginTop: 0 }}>Key metadata</Header>
      <p>Metadata</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="meta">
            {(provided) => (
              <>
                <div
                   {...provided.droppableProps}
                   ref={provided.innerRef}
                   style={{ marginTop: '1rem' }}
                >
                  <div style={rowStyles}>
                    <span />
                    <span
                      data-testid="metadata-key-0"
                      style={{
                        ...cellStyles,
                        padding: '0 0.5rem',
                        backgroundColor: Colors.DARK_GRAY_2,
                      }}
                    >
                      name
                    </span>
                    <FormGroup
                      helperText={errors.meta?.[0]?.value?.message}
                      intent={errors.meta?.[0]?.value ? Intent.DANGER : Intent.NONE}
                    >
                      <Input
                        placeholder="value"
                        data-testid="metadata-value-0"
                        aria-invalid={!!errors.meta?.[0]?.value ? 'true' : 'false'}
                        {...register(`meta.0.value`, { required: Validation.REQUIRED })}
                      />
                    </FormGroup>
                    <span style={{ visibility: 'hidden' }}>Remove</span>
                  </div>
                  {fields.filter(kv => kv.key !== 'name').map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index + 1}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div style={rowStyles}>
                            <div data-testid="metadata-row-indicator" style={cellStyles}>
                              <Kebab />
                            </div>
                            <FormGroup
                              helperText={errors.meta?.[index + 1]?.key?.message}
                              intent={errors.meta?.[index + 1]?.key ? Intent.DANGER : Intent.NONE}
                            >
                              <Input
                                placeholder="key"
                                data-testid="metadata-key"
                                aria-invalid={!!errors.meta?.[index + 1]?.key ? 'true' : 'false'}
                                {...register(`meta.${index + 1}.key`, { required: Validation.REQUIRED, validate: notName })}
                              />
                            </FormGroup>
                            <FormGroup
                              helperText={errors.meta?.[index + 1]?.value?.message}
                              intent={errors.meta?.[index + 1]?.value ? Intent.DANGER : Intent.NONE}
                            >
                              <Input
                                placeholder="value"
                                data-testid="metadata-value"
                                aria-invalid={!!errors.meta?.[index + 1]?.value ? 'true' : 'false'}
                                {...register(`meta.${index + 1}.value`, { required: Validation.REQUIRED })}
                              />
                            </FormGroup>
                            <button
                              data-testid="metadata-remove"
                              style={{ ...cellStyles, ...underlined }}
                              onClick={() => remove(index + 1)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
                {provided.placeholder}
              </>
            )}
          </Droppable>
        </DragDropContext>
        <div style={{ margin: '1.5rem 0' }}>
          <button
            data-testid="metadata-add"
            style={underlined} onClick={() => append({ key: '', value: '' })}
          >
            Add metadata
          </button>
        </div>
        <div>
          <Button
            data-testid="metadata-submit"
            disabled={loading}
            style={{ width: '100%' }}
            type="submit"
          >
            Update
          </Button>
        </div>
      </form>
    </div>
  )
}
