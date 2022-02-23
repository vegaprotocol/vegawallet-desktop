import type { Handler } from './types/handler'

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

export const Service = Object.entries(window.go.backend.Handler).reduce(
  (prev, [key, value]) => {
    // @ts-ignore
    prev[key] = wrapFn(value)
    return prev
  },
  {}
) as unknown as Handler
