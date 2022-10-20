import { produce } from 'immer'
import omit from 'lodash/omit'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'

import { EVENTS } from '../../lib/events'
import { EventsOff, EventsOn } from '../../wailsjs/runtime'
import { InteractionFlow } from './interaction-flow'
import type { Interaction, RawInteraction } from './types'

type IndexedInteractions = {
  ids: string[]
  values: Record<string, Interaction[]>
}

/**
 * Handles incoming interactions
 */
export function InteractionManager() {
  const [interactions, setInteractions] = useState<IndexedInteractions>({
    ids: [],
    values: {}
  })
  const traceID = interactions.ids[0]
  const events = traceID ? interactions.values[traceID] : undefined

  // Get any already pending tx on startup
  useEffect(() => {
    // Listen for new incoming transactions
    EventsOn(EVENTS.NEW_INTERACTION_EVENT, (interaction: RawInteraction) => {
      console.log(interaction)
      setInteractions(interactions =>
        produce(interactions, interactions => {
          const wrappedInteraction = {
            meta: {
              id: nanoid()
            },
            event: interaction
          }

          if (
            !interactions.ids.includes(interaction.traceID) ||
            !interactions.values[interaction.traceID]
          ) {
            interactions.ids.push(interaction.traceID)
            interactions.values[interaction.traceID] = [wrappedInteraction]
            return
          }
          interactions.values[interaction.traceID].push(wrappedInteraction)
        })
      )
    })
    return () => {
      EventsOff(EVENTS.NEW_INTERACTION_EVENT)
    }
  }, [])

  if (!events) {
    return null
  }

  return (
    <InteractionFlow
      events={events}
      onFinish={() =>
        setInteractions(interactions => ({
          ids: interactions.ids.slice(1),
          values: omit(interactions.values, interactions.ids.slice(0, 1))
        }))
      }
    />
  )
}
