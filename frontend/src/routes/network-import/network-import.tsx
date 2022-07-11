import { useNavigate } from 'react-router-dom'

import { Header } from '../../components/header'
import { NetworkImportForm } from '../../components/network-import-form'
import { Splash } from '../../components/splash'
import { Colors } from '../../config/colors'
import { Paths } from '..'

export const NetworkImport = () => {
  const navigate = useNavigate()
  return (
    <Splash>
      <Header
        style={{ marginTop: 0, color: Colors.WHITE, textAlign: 'center' }}
      >
        Import network
      </Header>
      <NetworkImportForm onComplete={() => navigate(Paths.Home)} />
    </Splash>
  )
}
