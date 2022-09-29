import * as UnwrappedService from './wailsjs/go/backend/Handler'
import { WalletClient } from './wallet-client'

export type ServiceType = Omit<
  typeof UnwrappedService,
  'SubmitWalletAPIRequest'
> & {
  WalletApi: WalletClient
}

/**
 * Wrap function to return consistent type and throw consistent error
 * @param fn
 * @returns
 */
const wrapFn = function <S, T>(
  fn: (args?: S) => Promise<T>
): (args?: S) => Promise<T> {
  return (args?: S) => {
    if (args) {
      return fn(args)
        .then((res: T | Error) => {
          if (res instanceof Error) throw res
          return res
        })
        .catch((res: Error | string) => {
          if (typeof res === 'string') {
            res = new Error(res)
          }
          throw res
        })
    } else {
      return fn()
        .then((res: T | Error) => {
          if (res instanceof Error) throw res
          return res
        })
        .catch((res: Error | string) => {
          if (typeof res === 'string') {
            res = new Error(res)
          }
          throw res
        })
    }
  }
}

export const Service = Object.entries(UnwrappedService).reduce(
  (prev, [key, value]) => {
    if (key !== 'SubmitWalletAPIRequest') {
      // @ts-ignore
      prev[key] = wrapFn(value)
    }
    return prev
  },
  {
    WalletApi: new WalletClient()
  } as unknown as ServiceType
)
