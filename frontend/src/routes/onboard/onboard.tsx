import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { Vega } from '../../components/icons'
import { Title } from '../../components/title'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { useVegaHome } from '../../hooks/use-vega-home'
import { createLogger } from '../../lib/logging'
import { Paths } from '..'

const logger = createLogger('Onboard')

export function Onboard() {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)
  const vegaHome = useVegaHome()

  const {
    dispatch,
    actions,
    service,
    state: { networks, wallets }
  } = useGlobal()

  const handleImportExistingWallet = async () => {
    try {
      setLoading(true)

      await service.InitialiseApp({ vegaHome })

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
    if (!Object.keys(wallets).length) {
      return null
    }

    return (
      <>
        <p style={{ marginBottom: 20 }}>Existing wallets found</p>
        <ButtonGroup>
          <Button loading={isLoading} onClick={handleImportExistingWallet}>
            Use existing
          </Button>
        </ButtonGroup>
        <p style={{ margin: '20px 0' }}>OR</p>
      </>
    )
  }

  return (
    <div
      style={{
        width: '545px',
        margin: 'auto',
        textAlign: 'center',
        paddingTop: 82
      }}
    >
      <Title style={{ margin: '0 0 30px 0', color: Colors.WHITE }}>
        <Vega />
      </Title>
      {renderExistingMessage()}
      <ButtonGroup orientation='vertical' style={{ marginBottom: 20 }}>
        <Button
          data-testid='create-new-wallet'
          onClick={() => navigate('/wallet-create')}
        >
          Create new wallet
        </Button>
        <Button
          data-testid='import-wallet'
          onClick={() => navigate('/wallet-import')}
        >
          Use recovery phrase
        </Button>
      </ButtonGroup>
    </div>
  )
}
