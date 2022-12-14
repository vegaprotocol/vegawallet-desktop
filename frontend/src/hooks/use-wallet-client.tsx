import type { WalletAPIRequest } from '@vegaprotocol/wallet-client'
import { WalletClient } from '@vegaprotocol/wallet-client'
import type { Logger } from 'loglevel'
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
  const request: WalletAPIRequest = useCallback(
    async (method, params) => {
      // @TODO: remove this hacky override once the wallet api gets fixed in >v0.64.0
      if (method === 'admin.import_wallet') {
        params = {
          ...params,
          // @ts-ignore
          version: params.keyDerivationVersion
        }
      }

      const response = await SubmitWalletAPIRequest({
        jsonrpc: '2.0',
        id: nanoid(),
        method,
        params
      })

      if (response.error) {
        const error = new JSONRPCError(response.error)
        logger.error(error)
        throw error
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = response.result || {}
      return rest
    },
    [logger]
  )

  return new WalletClient(request)
}
