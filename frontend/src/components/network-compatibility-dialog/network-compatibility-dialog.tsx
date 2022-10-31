import { useCallback, useEffect, useMemo, useState } from 'react'

import { Intent } from '../../config/intent'
import { useGlobal } from '../../contexts/global/global-context'
import type {
  backend as BackendModel,
  version as VersionModel
} from '../../wailsjs/go/models'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { ButtonUnstyled } from '../button-unstyled'
import { Dialog } from '../dialog'
import { Warning } from '../icons/warning'
import { AppToaster } from '../toaster'
import { AddNetwork } from './add-network'
import { ChangeNetwork } from './choose-network'

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
    networkData: version.backend.networksCompatibility.find(
      n => n.network === network
    )
  }
}

const addCompatibleNetwork = (
  acc: string[],
  { isCompatible, network }: VersionModel.NetworkCompatibility
) => {
  if (isCompatible) {
    acc.push(network)
  }
  return acc
}

type Subview = 'change' | 'add' | null

const getTitle = (subview: Subview) => {
  switch (subview) {
    case 'add': {
      return 'Add network'
    }
    case 'change': {
      return 'Choose a compatible network'
    }
    default: {
      return (
        <>
          <Warning style={{ width: 20, marginRight: 12 }} />
          Incompatible network
        </>
      )
    }
  }
}

export const NetworkCompatibilityDialog = () => {
  const { state, service, dispatch, actions } = useGlobal()
  const { supportedVersion, networkData } = useMemo(
    () => findNetworkData(state.network, state.version),
    [state.network, state.version]
  )
  const compatibleNetworksList = useMemo(() => {
    return (state.version?.backend?.networksCompatibility || []).reduce<
      string[]
    >(addCompatibleNetwork, [])
  }, [state.version])
  const [isOpen, setOpen] = useState(
    networkData ? networkData.isCompatible : false
  )
  const [subview, setSubview] = useState<Subview>(null)

  useEffect(() => {
    if (networkData && !networkData.isCompatible) {
      setOpen(true)
    }
  }, [supportedVersion, networkData])

  useEffect(() => {
    const interval = setInterval(async () => {
      const version = await service.GetVersion()
      dispatch({
        type: 'SET_VERSION',
        version
      })
    }, ONE_DAY)

    return () => {
      clearInterval(interval)
    }
  }, [service, dispatch])

  const handleChangeNetwork = useCallback(
    async ({ network }: { network?: string }) => {
      if (network) {
        dispatch(actions.changeNetworkAction(network))
        setOpen(false)
        setSubview(null)
      }
    },
    [dispatch, actions, setOpen, setSubview]
  )

  const handleAddNetwork = useCallback(async () => {
    const version = await service.GetVersion()
    const newCompatibleNetworksList = (
      version.backend?.networksCompatibility || []
    ).reduce<string[]>(addCompatibleNetwork, [])

    if (newCompatibleNetworksList.length > 0) {
      setOpen(false)
      setSubview(null)
      dispatch({
        type: 'SET_VERSION',
        version
      })
      dispatch(actions.changeNetworkAction(newCompatibleNetworksList[0]))
    } else {
      AppToaster.show({
        intent: Intent.DANGER,
        message:
          'The network added is not compatible with the app. Try another one.'
      })
    }
  }, [dispatch, actions, service, setOpen, setSubview])

  const title = useMemo(() => getTitle(subview), [subview])

  if (!networkData) {
    return null
  }

  return (
    <Dialog size='lg' open={isOpen} title={title}>
      {subview === null && (
        <div style={{ padding: 20 }}>
          <p style={{ marginBottom: 12 }}>
            Your selected network "<code>{networkData.network}</code>" is
            running on Vega <code>{networkData.retrievedVersion}</code>, however
            this app only supports networks running{' '}
            <code>{supportedVersion}</code>.
          </p>
          {compatibleNetworksList.length > 0 && (
            <p style={{ marginBottom: 12 }}>
              Download a compatible release or change network to continue.
            </p>
          )}
          {compatibleNetworksList.length === 0 && (
            <p style={{ marginBottom: 12 }}>
              Download a compatible release or add a compatible network to
              continue.
            </p>
          )}
          <ButtonGroup inline style={{ padding: `20px 0` }}>
            <Button>Get a compatible release</Button>
            {compatibleNetworksList.length > 0 && (
              <Button onClick={() => setSubview('change')}>
                Change network
              </Button>
            )}
            {compatibleNetworksList.length === 0 && (
              <Button onClick={() => setSubview('add')}>Add network</Button>
            )}
          </ButtonGroup>
          <ButtonGroup inline>
            <ButtonUnstyled onClick={() => setOpen(false)}>
              Continue with existing network
            </ButtonUnstyled>
          </ButtonGroup>
        </div>
      )}
      {subview === 'add' && (
        <AddNetwork
          onSubmit={handleAddNetwork}
          onCancel={() => setSubview(null)}
        />
      )}
      {subview === 'change' && (
        <ChangeNetwork
          networks={compatibleNetworksList}
          onSubmit={handleChangeNetwork}
          onCancel={() => setSubview(null)}
          onAddNetwork={() => setSubview('add')}
        />
      )}
    </Dialog>
  )
}
