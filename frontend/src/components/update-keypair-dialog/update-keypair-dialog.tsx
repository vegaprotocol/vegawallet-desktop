import { useCallback } from 'react'
import type { DropResult } from 'react-beautiful-dnd'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useFieldArray, useForm } from 'react-hook-form'

import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import { useGlobal } from '../../contexts/global/global-context'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import type { Meta } from '../../hooks/use-keypair-update'
import { useKeypairUpdate } from '../../hooks/use-keypair-update'
import { Validation } from '../../lib/form-validation'
import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { Dialog } from '../dialog'
import { FormGroup } from '../form-group'
import { Input } from '../forms/input'
import { PublicKey } from '../public-key'
import { Title } from '../title'

const notName = (value: string) =>
  value === 'name' ? 'Name is already in use' : true

const rowStyles = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '20px 1fr 1fr auto',
  gap: 12
}

const cellStyles = {
  display: 'flex',
  alignItems: 'center',
  height: 40,
  marginTop: 5
}

const underlined = {
  textDecoration: 'underline'
}

export const UpdateKeypairDialog = () => {
  const { state, actions, dispatch } = useGlobal()
  const { keypair, wallet } = useCurrentKeypair()
  const { loading, update } = useKeypairUpdate(
    dispatch,
    actions,
    keypair?.publicKey,
    wallet?.name
  )
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<{ meta: Meta[] }>({
    defaultValues: {
      meta: keypair?.metadata || []
    }
  })
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'meta'
  })

  const onSubmit = useCallback(
    (result: { meta: Meta[] }) => {
      update(result.meta)
    },
    [update]
  )

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      move(
        result.source.index,
        result.destination?.index ?? result.source.index
      )
    },
    [move]
  )

  if (!keypair) {
    return null
  }

  return (
    <Dialog open={state.updateKeyModalOpen}>
      <div data-testid='keypair-metadata' style={{ padding: 20 }}>
        <Title style={{ marginTop: 0 }}>Update key</Title>
      </div>
      <PublicKey keypair={keypair} />
      <div style={{ padding: '0 20px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId='meta'>
              {provided => (
                <>
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ marginTop: '1rem' }}
                  >
                    <div>
                      <FormGroup
                        helperText={errors.meta?.[0]?.value?.message}
                        intent={
                          errors.meta?.[0]?.value ? Intent.DANGER : Intent.NONE
                        }
                      >
                        <label htmlFor='meta-name'>Name</label>
                        <Input
                          id='meta-name'
                          placeholder='value'
                          data-testid='metadata-value-0'
                          aria-invalid={
                            !!errors.meta?.[0]?.value ? 'true' : 'false'
                          }
                          {...register(`meta.0.value`, {
                            required: Validation.REQUIRED
                          })}
                        />
                      </FormGroup>
                      <span style={{ visibility: 'hidden' }}>Remove</span>
                    </div>
                    {fields
                      .filter(kv => kv.key !== 'name')
                      .map((field, index) => (
                        <Draggable
                          key={field.id}
                          draggableId={field.id}
                          index={index + 1}
                        >
                          {provided => {
                            const draggerBarStyle = {
                              width: 20,
                              height: 1,
                              background: Colors.WHITE,
                              margin: '3px 0'
                            }
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div style={rowStyles}>
                                  <div
                                    data-testid='metadata-row-indicator'
                                    style={{
                                      ...cellStyles,
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <span style={draggerBarStyle}></span>
                                    <span style={draggerBarStyle}></span>
                                    <span style={draggerBarStyle}></span>
                                  </div>
                                  <FormGroup
                                    helperText={
                                      errors.meta?.[index + 1]?.key?.message
                                    }
                                    intent={
                                      errors.meta?.[index + 1]?.key
                                        ? Intent.DANGER
                                        : Intent.NONE
                                    }
                                  >
                                    <Input
                                      placeholder='key'
                                      data-testid='metadata-key'
                                      aria-invalid={
                                        !!errors.meta?.[index + 1]?.key
                                          ? 'true'
                                          : 'false'
                                      }
                                      {...register(`meta.${index + 1}.key`, {
                                        required: Validation.REQUIRED,
                                        validate: notName
                                      })}
                                    />
                                  </FormGroup>
                                  <FormGroup
                                    helperText={
                                      errors.meta?.[index + 1]?.value?.message
                                    }
                                    intent={
                                      errors.meta?.[index + 1]?.value
                                        ? Intent.DANGER
                                        : Intent.NONE
                                    }
                                  >
                                    <Input
                                      placeholder='value'
                                      data-testid='metadata-value'
                                      aria-invalid={
                                        !!errors.meta?.[index + 1]?.value
                                          ? 'true'
                                          : 'false'
                                      }
                                      {...register(`meta.${index + 1}.value`, {
                                        required: Validation.REQUIRED
                                      })}
                                    />
                                  </FormGroup>
                                  <button
                                    data-testid='metadata-remove'
                                    style={{ ...cellStyles, ...underlined }}
                                    onClick={() => remove(index + 1)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            )
                          }}
                        </Draggable>
                      ))}
                  </div>
                  {provided.placeholder}
                </>
              )}
            </Droppable>
          </DragDropContext>
          <div style={{ margin: '1.5rem 0', display: 'none' }}>
            <button
              data-testid='metadata-add'
              style={underlined}
              onClick={() => append({ key: '', value: '' })}
            >
              Add metadata
            </button>
          </div>
          <div style={{ display: 'flex', marginTop: 32, gap: 20 }}>
            <Button
              data-testid='metadata-submit'
              disabled={loading}
              type='submit'
            >
              Update
            </Button>
            <ButtonUnstyled
              onClick={() =>
                dispatch({ type: 'SET_UPDATE_KEY_MODAL', open: false })
              }
            >
              Cancel
            </ButtonUnstyled>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
