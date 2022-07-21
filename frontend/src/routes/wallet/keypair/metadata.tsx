import { useState, useCallback } from 'react'
import type { DropResult } from 'react-beautiful-dnd'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useFieldArray, useForm } from 'react-hook-form'

import { Button } from '../../../components/button'
import { Input } from '../../../components/forms/input'
import { Header } from '../../../components/header'
import { Kebab } from '../../../components/icons/kebab'
import { AppToaster } from '../../../components/toaster'
import { Intent } from '../../../config/intent'
import { useGlobal } from '../../../contexts/global/global-context'
import { useCurrentKeypair } from '../../../hooks/use-current-keypair'
import { createLogger } from '../../../lib/logging'
import { Service } from '../../../service'
import type { GlobalDispatch } from '../../../contexts/global/global-context';
import type { Meta } from '../../../wailsjs/go/models'

const rowStyles = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '20px 1fr 1fr auto',
  gap: 12,
  margin: '1rem 0',
}

const underlined = {
  textDecoration: 'underline',
}

const logger = createLogger('Metadata')

const useMetaUpdate = (dispatch: GlobalDispatch, pubKey?: string, wallet?: string) => {
  const [loading, setLoading] = useState(false)

  const update = useCallback(async (meta: Meta[]) => {
    setLoading(true)
    try {
      if (!pubKey || !wallet) {
        return
      }

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
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      meta: keypair?.meta || [],
    },
  })

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'meta',
  });

  const onSubmit = (result: { meta: Meta[] }) => {
    update(result.meta)
  }

  const handleDragEnd = useCallback((result: DropResult) => {
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
                >
                  <div style={rowStyles}>
                    <span />
                    <span>name</span>
                    <Input placeholder="value" {...register(`meta.0.value`)} />
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
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Kebab />
                            </div>
                            <Input placeholder="key" {...register(`meta.${index + 1}.key`)} />
                            <Input placeholder="value" {...register(`meta.${index + 1}.value`)} />
                            <button style={underlined} onClick={() => remove(index + 1)}>Remove</button>
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
          <button style={underlined} onClick={() => append({ key: '', value: '' })}>Add metadata</button>
        </div>
        <div>
          <Button
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
