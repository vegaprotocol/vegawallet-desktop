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

type NetworkPresetItemProps = {
  preset: NetworkPreset
  onEdit: () => void
}

const NetworkPresetItem = ({ preset, onEdit }: NetworkPresetItemProps) => {
  const { state } = useGlobal()
  const { submit } = useImportNetwork()
  const isImported = state.networks.find(n => n === preset.name)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>{preset.name}</div>
      <div style={{ display: 'flex', gap: 12 }}>
        {!isImported && (
          <Button
            onClick={() => submit({
              name: preset.name,
              fileOrUrl: preset.configFileUrl,
              network: preset.name,
              force: false,
            })}
          >
            Import
          </Button>
        )}
        <Button
          data-testid='edit'
          disabled={!isImported}
          onClick={onEdit}
        >
          Edit
        </Button>
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
              onEdit={() => {
                setSelectedNetwork(preset.name)
                setEditView()
              }}
            />
          ))}
        </>
      )}
      <ButtonUnstyled
        style={{ margin: '20px 0 0' }}
        onClick={() => setShowTestNetworks(!showTestNetworks)}
      >
        {showTestNetworks ? 'Hide test networks' : 'Show test networks'}
      </ButtonUnstyled>
      {myNetworks.length && <Header>My Networks</Header>}
      {myNetworks.map(network => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>{network}</div>
          <Button
            data-testid='edit'
            onClick={() => {
              setSelectedNetwork(network)
              setEditView()
            }}
          >
            Edit
          </Button>
        </div>
      ))}
    </>
  )
}
