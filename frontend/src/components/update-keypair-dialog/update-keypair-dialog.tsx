import { useCallback } from 'react'
import type { DropResult } from 'react-beautiful-dnd'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useFieldArray, useForm } from 'react-hook-form'

import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import type { KeyPair, Wallet } from '../../contexts/global/global-context'
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

export function UpdateKeypairDialog() {
  const { state } = useGlobal()
  const { keypair, wallet } = useCurrentKeypair()

  if (!keypair || !wallet) {
    return null
  }

  return (
    <Dialog open={state.updateKeyModalOpen} title='Update key'>
      <PublicKey keypair={keypair} />
      <div style={{ padding: '0 20px 20px' }}>
        <UpdateKeyForm keypair={keypair} wallet={wallet} />
      </div>
    </Dialog>
  )
}

type UpdateKeyFormProps = {
  keypair: KeyPair
  wallet: Wallet
}

function UpdateKeyForm({ keypair, wallet }: UpdateKeyFormProps) {
  const { actions, dispatch } = useGlobal()

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
      meta: (keypair?.meta || []).filter(kp => kp.key === 'name')
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

  const nameError = errors.meta?.[0]?.value

  return (
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
                    helperText={nameError?.message}
                    intent={nameError ? Intent.DANGER : Intent.NONE}
                  >
                    <label data-testid='metadata-key-0' htmlFor='meta-name'>
                      Name
                    </label>
                    <Input
                      id='meta-name'
                      placeholder='value'
                      data-testid='metadata-value-0'
                      aria-invalid={nameError ? 'true' : 'false'}
                      {...register(`meta.0.value`, {
                        required: Validation.REQUIRED
                      })}
                    />
                  </FormGroup>
                  {fields.length > 1 && (
                    <span style={{ visibility: 'hidden' }}>Remove</span>
                  )}
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
                                {Array(3)
                                  .fill(0)
                                  .map((_, i) => (
                                    <span
                                      key={i}
                                      style={draggerBarStyle}
                                    ></span>
                                  ))}
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
      <div style={{ display: 'flex', marginTop: 0, gap: 20 }}>
        <Button data-testid='metadata-submit' disabled={loading} type='submit'>
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
  )
}
