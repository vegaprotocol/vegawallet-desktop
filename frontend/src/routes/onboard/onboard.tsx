import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { Title } from '../../components/title'
import { Vega } from '../../components/icons'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { createLogger } from '../../lib/logging'
import { Paths } from '..'

const logger = createLogger('Onboard')

export function Onboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState<
    'create' | 'import' | 'existing' | null
  >(null)
  const defaultVegaHome =
    'Cypress' in window
      ? // @ts-ignore only injected when running in cypress
        window.Cypress.env('vegaHome')
      : ''

  const {
    dispatch,
    actions,
    service,
    state: { version, networks, wallets }
  } = useGlobal()

  const initialiseWithDefaultHome = async () => {
    try {
      await service.InitialiseApp({ vegaHome: defaultVegaHome })
    } catch (err) {
      logger.error(err)
    }
  }

  const handleImportExistingWallet = async () => {
    try {
      setLoading('existing')

      await service.InitialiseApp({ vegaHome: defaultVegaHome })

      // If use doesnt have networks go to the import network section on onboarding
      // otherwise go to home to complete onboarding
      if (networks.length) {
        const config = await service.GetAppConfig()
        const defaultNetwork = config.defaultNetwork
          ? config.defaultNetwork
          : networks[0]
        const defaultNetworkConfig = await service.WalletApi.DescribeNetwork({
          network: defaultNetwork
        })
        dispatch({
          type: 'ADD_NETWORKS',
          networks,
          network: defaultNetwork,
          networkConfig: defaultNetworkConfig
        })
      }

      // Found wallets and networks, go to the main app
      dispatch(actions.completeOnboardAction(() => navigate(Paths.Home)))
    } catch (err) {
      logger.error(err)
    }
  }

  const renderExistingMessage = () => {
    if (!wallets.length) {
      return null
    }

    return (
      <>
        <p style={{ marginBottom: 20 }}>Existing wallets found</p>
        <ButtonGroup>
          <Button
            loading={loading === 'existing'}
            onClick={handleImportExistingWallet}
          >
            Use existing
          </Button>
        </ButtonGroup>
        <p style={{ margin: '20px 0' }}>OR</p>
      </>
    )
  }

  return (
    <div style={{ width: '545px', margin: 'auto', textAlign: 'center', paddingTop: 82 }}>
      <Title style={{ margin: '0 0 30px 0', color: Colors.WHITE }}>
        <Vega />
      </Title>
      {renderExistingMessage()}
      <ButtonGroup orientation='vertical' style={{ marginBottom: 20 }}>
        <Button
          loading={loading === 'create'}
          data-testid='create-new-wallet'
          onClick={async () => {
            setLoading('create')
            await initialiseWithDefaultHome()
            navigate('/wallet-create')
          }}
        >
          Create new wallet
        </Button>
        <Button
          data-testid='import-wallet'
          loading={loading === 'import'}
          onClick={async () => {
            setLoading('import')
            await initialiseWithDefaultHome()
            navigate('/wallet-import')
          }}
        >
          Use recovery phrase
        </Button>
      </ButtonGroup>
      <p>
        <ButtonUnstyled
          data-testid='advanced-options'
          onClick={() => dispatch({ type: 'SET_SETTINGS_MODAL', open: true })}
        >
          App settings
        </ButtonUnstyled>
      </p>
      {version && <p>version {version}</p>}
    </div>
  )
}
