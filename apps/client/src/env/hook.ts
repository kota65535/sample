import { useContext} from 'react'
import {EnvContext} from './provider'

export function useEnv() {

  const config = useContext(EnvContext)
  if (!config) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return config
}
