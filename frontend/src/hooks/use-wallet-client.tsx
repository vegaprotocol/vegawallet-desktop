import type { Logger } from 'loglevel'
import type { WalletAPIRequest } from '@vegaprotocol/wallet-client'
import { WalletClient } from '@vegaprotocol/wallet-client'
import { nanoid } from 'nanoid'
import { useCallback } from 'react'

import { SubmitWalletAPIRequest } from '../wailsjs/go/backend/Handler'
import type { jsonrpc as JSONRPCModel } from '../wailsjs/go/models'

export class JSONRPCError extends Error {
  public code: number

  constructor(rpcErr: JSONRPCModel.ErrorDetails) {
    super(rpcErr.data || rpcErr.message)
    this.code = rpcErr.code
  }
}

export const useWalletClient = (logger: Logger) => {
  const request: WalletAPIRequest = useCallback(async (method, params) => {
    const response = await SubmitWalletAPIRequest({
      jsonrpc: '2.0',
      id: nanoid(),
      method,
      params
    })

    if (response.error) {
      logger.error(response.error)
      throw new Error(response.error.message)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = response.result || {}
    return rest
  }, [])

  return new WalletClient(request)
}
