import { useState, useMemo, useEffect } from 'react'

import { Dialog } from '../dialog'
import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { ButtonGroup } from '../button-group'
import { DropdownMenu, DropdownItem } from '../dropdown-menu'
import { Warning } from '../icons/warning'
import { DropdownArrow } from '../icons/dropdown-arrow'
import { useGlobal } from '../../contexts/global/global-context'
import type { backend as BackendModel } from '../../wailsjs/go/models'

const ONE_DAY = 86400000

const findNetworkData = (
  network: string | null,
  version: BackendModel.GetVersionResponse | null
) => {
  if (!network || !version?.backend) {
    return {}
  }

  return {
    supportedVersion: version.backend.version,
    networkData: version.backend.networksCompatibility.find(n => n.network === network),
  }
}

export const NetworkCompatibilityDialog = () => {
  const { state, dispatch, actions } = useGlobal()
  const { supportedVersion, networkData } = useMemo(() => (
    findNetworkData(state.network, state.version)
  ), [state.network, state.version])
  const [isOpen, setOpen] = useState(networkData ? networkData.isCompatible : false)
  const compatibleNetworksList = useMemo(() => {
    return state.version?.backend?.networksCompatibility
      .filter(n => n.isCompatible)
      .map(n => n.network) || []
  }, [state.version])

  useEffect(() => {
    if (networkData && !networkData.isCompatible) {
      setOpen(true)
    }
  }, [supportedVersion, networkData])

  if (!networkData) {
    return null
  }

  return (
    <Dialog
      open={isOpen}
      title={(
        <>
          <Warning style={{ width: 20, marginRight: 12 }}/>
          Warning
        </>
      )}
    >
      <div style={{ padding: 20 }}>
        <p style={{ marginBottom: 12 }}>The selected network <code>{networkData.network}</code> is running on <code>{networkData.retrievedVersion}</code>. This app has support for <code>{supportedVersion}</code>.</p>
        {compatibleNetworksList.length === 0 && (
          <p>To ensure all features are functional, we recommend you to check out our <a href="https://some-link.com" target="_blank" rel="noreferrer noopener">release list</a> and download a version which is compatible with your network.</p>
        )}
        {compatibleNetworksList.length === 1 && (
          <p>To ensure all features are functional, we recommend you to either check out our <a href="https://some-link.com" target="_blank" rel="noreferrer noopener">release list</a> and download a version which is compatible with your network, or <ButtonUnstyled onClick={() => dispatch(actions.changeNetworkAction(compatibleNetworksList[0]))}>switch to the <code>{}</code> network</ButtonUnstyled>, which is suported by this app.</p>
        )}
        {compatibleNetworksList.length > 1 && (
          <>
            <p>To ensure all features are functional, we recommend you to either check out our <a href="https://some-link.com" target="_blank" rel="noreferrer noopener">release list</a> and download a version which is compatible with your network, or switch to one of the networks which this app supports:</p>
            <DropdownMenu
              trigger={(
                <Button>
                  {}
                  <DropdownArrow style={{ width: 12, marginLeft: 6 }} />
                </Button>
              )}
              content={(
                <div>
                  {compatibleNetworksList.map(network => (
                    <DropdownItem key={network}>
                      <ButtonUnstyled
                        style={{
                          width: '100%',
                          padding: '10px 15px',
                        }}
                        onClick={() => {
                          dispatch(actions.changeNetworkAction(network))
                        }}
                      >
                        {network}
                      </ButtonUnstyled>
                    </DropdownItem>
                  ))}
                </div>
              )}
            />
          </>
        )}
      </div>
      <ButtonGroup inline style={{ padding: 20 }}>
        <Button onClick={() => setOpen(false)}>Accept risk and continue</Button>
      </ButtonGroup>
    </Dialog>
  )
}
