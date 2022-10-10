import { useState, useMemo } from 'react'

import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { Button } from '../button'
import { Header } from '../header'
import type { NetworkPreset } from '../../lib/networks'
import { useImportNetwork } from '../../hooks/use-import-network'

const hasImportedTestNetworks = (testPresets: NetworkPreset[], networks: string[]) => {
  return testPresets.reduce<boolean>((acc, preset) => {
    return acc || !!networks.find(n => n === preset.name)
  }, false)
}

const itemStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '12 0',
}

type NetworkPresetItemProps = {
  preset: NetworkPreset
  onEdit: () => void
  onRemove: () => void
}

const NetworkPresetItem = ({ preset, onEdit, onRemove }: NetworkPresetItemProps) => {
  const { state } = useGlobal()
  const { submit } = useImportNetwork()
  const isImported = state.networks.find(n => n === preset.name)

  return (
    <div
      style={itemStyles}
    >
      <div>{preset.name}</div>
      <div style={{ display: 'flex', gap: 12 }}>
        {!isImported && (
          <Button
            data-testid={`import-network-${preset.name}`}
            onClick={() => submit({
              name: preset.name,
              fileOrUrl: preset.configFileUrl,
              network: preset.configFileUrl,
              force: false,
            })}
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
  setEditView: () => void
  setSelectedNetwork: React.Dispatch<React.SetStateAction<string | null>>
}

export function NetworkPresets({
  setEditView,
  setSelectedNetwork
}: NetworkPresetsProps) {
  const {
    actions,
    dispatch,
    state: { networks, presets, presetsInternal }
  } = useGlobal()
  const [showTestNetworks, setShowTestNetworks] = useState(hasImportedTestNetworks(presetsInternal, networks))

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
      <Header>Networks</Header>
      {presets.map(preset => (
        <NetworkPresetItem
          key={preset.name}
          preset={preset}
          onRemove={() => {
            dispatch(actions.removeNetwork(preset.name))
          }}
          onEdit={() => {
            setSelectedNetwork(preset.name)
            setEditView()
          }}
        />
      ))}
      {showTestNetworks && (
        <>
          <Header>Test Networks</Header>
          {presetsInternal.map(preset => (
            <NetworkPresetItem
              key={preset.name}
              preset={preset}
              onRemove={() => {
                dispatch(actions.removeNetwork(preset.name))
              }}
              onEdit={() => {
                setSelectedNetwork(preset.name)
                setEditView()
              }}
            />
          ))}
        </>
      )}
      {!showTestNetworks && (
        <ButtonUnstyled
          data-testid="show-test-networks"
          style={{ margin: '20px 0 0' }}
          onClick={() => setShowTestNetworks(!showTestNetworks)}
        >
          Show test networks
        </ButtonUnstyled>
      )}
      {myNetworks.length > 0 && <Header>My Networks</Header>}
      {myNetworks.map(network => (
        <div
          key={network}
          style={itemStyles}
        >
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
                setSelectedNetwork(network)
                setEditView()
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
