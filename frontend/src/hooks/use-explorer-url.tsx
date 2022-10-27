import { useMemo } from 'react'
import { useGlobal } from '../contexts/global/global-context'

export const useExplorerUrl = () => {
  const { state } = useGlobal()

  const url = useMemo(() => {
    const presets = state.presets.concat(state.presetsInternal)
    return presets.find(p => p.name === state.networkConfig?.name)?.explorer
  }, [state.networkConfig, state.presets, state.presetsInternal])

  return url
}
