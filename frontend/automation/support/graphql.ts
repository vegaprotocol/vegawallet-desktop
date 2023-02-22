import type { CyHttpMessages } from 'cypress/types/net-stubbing'

export const hasOperationName = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string
) => {
  const { body } = req
  return 'operationName' in body && body.operationName === operationName
}
