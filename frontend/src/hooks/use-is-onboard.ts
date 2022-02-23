import { useMatch } from 'react-router-dom'

import { Paths } from '../routes'

export function useIsOnboard() {
  const match = useMatch(`${Paths.Onboard}/*`)
  return Boolean(match)
}
