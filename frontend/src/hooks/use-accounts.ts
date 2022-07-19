import { gql, useQuery } from '@apollo/client'
import groupBy from 'lodash/groupBy'

export interface Account {
  type: string
  balance: string
  market: { id: string; name: string }
  asset: { id: string; name: string; symbol: string; decimals: number }
}

const ACCOUNTS_FRAGMENT = gql`
  fragment AccountFields on Account {
    type
    balance
    market {
      id
      name
    }
    asset {
      id
      name
      symbol
      decimals
    }
  }
`

const ACCOUNTS_QUERY = gql`
  ${ACCOUNTS_FRAGMENT}
  query Accounts($partyId: ID!) {
    party(id: $partyId) {
      id
      accounts {
        ...AccountFields
      }
    }
  }
`

export function useAccounts(publicKey?: string) {
  const { data, loading, error } = useQuery(ACCOUNTS_QUERY, {
    variables: { partyId: publicKey || '' },
    skip: !publicKey
  })

  const accounts = groupBy(data?.party?.accounts as Account[], 'asset.id')

  return {
    accounts,
    data,
    loading,
    error
  }
}
