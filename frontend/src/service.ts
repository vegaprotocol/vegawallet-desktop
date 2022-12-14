import * as UnwrappedService from './wailsjs/go/backend/Handler'

export type ServiceType = Omit<
  typeof UnwrappedService,
  'SubmitWalletAPIRequest'
>

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
  {} as unknown as ServiceType
)
