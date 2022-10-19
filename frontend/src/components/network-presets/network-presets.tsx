import { useMemo, useState } from 'react'

import { useGlobal } from '../../contexts/global/global-context'
import { useImportNetwork } from '../../hooks/use-import-network'
import type { NetworkPreset } from '../../lib/networks'
import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { Title } from '../title'

const hasImportedTestNetworks = (
  testPresets: NetworkPreset[],
  networks: string[]
) => {
  return testPresets.reduce<boolean>((acc, preset) => {
    return acc || !!networks.find(n => n === preset.name)
  }, false)
}

const itemStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '12px 0'
}

type NetworkPresetItemProps = {
  preset: NetworkPreset
  onEdit: () => void
  onRemove: () => void
}

const NetworkPresetItem = ({
  preset,
  onEdit,
  onRemove
}: NetworkPresetItemProps) => {
  const { state } = useGlobal()
  const { submit } = useImportNetwork()
  const isImported = state.networks.find(n => n === preset.name)

  return (
    <div style={itemStyles}>
      <div>{preset.name}</div>
      <div style={{ display: 'flex', gap: 12 }}>
        {!isImported && (
          <Button
            data-testid={`import-network-${preset.name}`}
            onClick={() =>
              submit({
                name: preset.name,
                fileOrUrl: preset.configFileUrl,
                network: preset.configFileUrl,
                force: false
              })
            }
          >
            Import
          </Button>
        )}
        {isImported && (
          <Button
            data-testid={`remove-network-${preset.name}`}
            disabled={!isImported}
            onClick={onRemove}
          >
            Remove
          </Button>
        )}
        {isImported && (
          <Button
            data-testid={`edit-network-${preset.name}`}
            disabled={!isImported}
            onClick={onEdit}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  )
}

interface NetworkPresetsProps {
  setEditView: (network: string) => void
}

export function NetworkPresets({
  setEditView
}: NetworkPresetsProps) {
  const {
    actions,
    dispatch,
    state: { networks, presets, presetsInternal }
  } = useGlobal()
  const [showTestNetworks, setShowTestNetworks] = useState(
    hasImportedTestNetworks(presetsInternal, networks)
  )

  const myNetworks = useMemo(() => {
    return networks.reduce<string[]>((acc, network) => {
      const isPreset = !!presets.find(p => p.name === network)
      const isPresetInternal = !!presetsInternal.find(p => p.name === network)

      if (!isPreset && !isPresetInternal) {
        acc.push(network)
      }

      return acc
    }, [])
  }, [networks, presets, presetsInternal])

  return (
    <>
      <Title>Networks</Title>
      {presets.map(preset => (
        <NetworkPresetItem
          key={preset.name}
          preset={preset}
          onRemove={() => {
            dispatch(actions.removeNetwork(preset.name))
          }}
          onEdit={() => {
            setEditView(preset.name)
          }}
        />
      ))}
      {showTestNetworks && (
        <>
          <Title>Test Networks</Title>
          {presetsInternal.map(preset => (
            <NetworkPresetItem
              key={preset.name}
              preset={preset}
              onRemove={() => {
                dispatch(actions.removeNetwork(preset.name))
              }}
              onEdit={() => {
                setEditView(preset.name)
              }}
            />
          ))}
        </>
      )}
      {!showTestNetworks && (
        <ButtonUnstyled
          data-testid='show-test-networks'
          style={{ margin: '20px 0 0' }}
          onClick={() => setShowTestNetworks(!showTestNetworks)}
        >
          Show test networks
        </ButtonUnstyled>
      )}
      {myNetworks.length > 0 && <Title>My Networks</Title>}
      {myNetworks.map(network => (
        <div key={network} style={itemStyles}>
          <div>{network}</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button
              data-testid={`remove-network-${network}`}
              onClick={() => {
                dispatch(actions.removeNetwork(network))
              }}
            >
              Remove
            </Button>
            <Button
              data-testid={`edit-network-${network}`}
              onClick={() => {
                setEditView(network)
              }}
            >
              Edit
            </Button>
          </div>
        </div>
      ))}
    </>
  )
}
