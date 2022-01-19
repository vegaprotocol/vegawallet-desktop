import React from 'react'
import { AppRouter } from './routes'
// Wails doesn't support BrowserRouter
// See https://wails.app/guides/reactrouter/
import { HashRouter as Router } from 'react-router-dom'
import { Chrome } from './components/chrome'
import { GlobalProvider } from './contexts/global/global-provider'
import { AppStatus, useGlobal } from './contexts/global/global-context'
import { Splash } from './components/splash'
import { SplashLoader } from './components/splash-loader'
import { initAppAction } from './contexts/global/global-actions'
import { ServiceProvider } from './contexts/service/service-provider'
import { PassphraseModal } from './components/passphrase-modal'
import { NetworkProvider } from './contexts/network/network-provider'
import * as Models from './models'
import { BackendProvider } from './contexts/backend/backend-provider'
import { useBackend } from './contexts/backend/backend-context'

export interface Service {
  GetVersion(): Promise<Models.GetVersionResponse>

  GenerateKey(
    request: Models.GenerateKeyRequest
  ): Promise<Models.GenerateKeyResponse>

  DescribeKey(
    request: Models.DescribeKeyRequest
  ): Promise<Models.DescribeKeyResponse>

  AnnotateKey(request: Models.AnnotateKeyRequest): Promise<void>

  TaintKey(request: Models.TaintKeyRequest): Promise<void>

  UntaintKey(request: Models.UntaintKeyRequest): Promise<void>

  IsolateKey(
    request: Models.IsolateKeyRequest
  ): Promise<Models.IsolateKeyResponse>

  ListKeys(request: Models.ListKeysRequest): Promise<Models.ListKeysResponse>

  CreateWallet(
    request: Models.CreateWalletRequest
  ): Promise<Models.CreateWalletResponse>

  ImportWallet(
    request: Models.ImportWalletRequest
  ): Promise<Models.ImportWalletResponse>

  IsAppInitialised(): Promise<boolean>

  InitialiseApp(request: Models.AppConfig): Promise<void>

  ListWallets(): Promise<Models.ListWalletsResponse>

  ImportNetwork(
    request: Models.ImportNetworkRequest
  ): Promise<Models.ImportNetworkResponse>

  GetNetworkConfig(name: string): Promise<Models.Network>

  ListNetworks(): Promise<Models.ListNetworksResponse>

  SaveNetworkConfig(request: Models.SaveNetworkConfigRequest): Promise<boolean>

  StartService(request: Models.StartServiceRequest): Promise<boolean>

  GetServiceState(): Promise<Models.GetServiceStateResponse>

  StopService(): Promise<boolean>
}

interface AppLoaderProps {
  children: React.ReactElement
}

function AppLoader({ children }: AppLoaderProps) {
  const service = useBackend()
  const { state, dispatch } = useGlobal()

  React.useEffect(() => {
    dispatch(initAppAction(service))
  }, [dispatch, service])

  if (state.status === AppStatus.Pending) {
    return (
      <Splash>
        <SplashLoader />
      </Splash>
    )
  }

  if (state.status === AppStatus.Failed) {
    return (
      <Splash>
        <p>Failed to initialise</p>
      </Splash>
    )
  }

  return children
}

interface AppProps {
  service: Service
}

function App({ service }: AppProps) {
  return (
    <Router>
      <BackendProvider service={service}>
        <GlobalProvider>
          <AppLoader>
            <NetworkProvider>
              <ServiceProvider>
                <Chrome>
                  <AppRouter />
                </Chrome>
                <PassphraseModal />
              </ServiceProvider>
            </NetworkProvider>
          </AppLoader>
        </GlobalProvider>
      </BackendProvider>
    </Router>
  )
}

export default App
