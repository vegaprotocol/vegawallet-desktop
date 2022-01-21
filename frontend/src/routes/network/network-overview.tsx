import React from 'react'
import { Link } from 'react-router-dom'
import { useNetwork } from '../../contexts/network/network-context'
import { BulletHeader } from '../../components/bullet-header'
import { changeNetworkAction } from '../../contexts/network/network-actions'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { Button } from '../../components/button'
import { DropdownItem, DropdownMenu } from '../../components/dropdown-menu'
import { DropdownArrow } from '../../components/icons/dropdown-arrow'
import { Colors } from '../../config/colors'
import { Paths } from '../router-config'

export function NetworkOverview() {
  const {
    state: { network, networks },
    dispatch
  } = useNetwork()
  return (
    <div>
      <BulletHeader tag='h1'>Network configuration</BulletHeader>
      {network ? (
        <p
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <span>
            Current network:{' '}
            <span style={{ color: Colors.TEXT_COLOR_DEEMPHASISE }}>
              {network}
            </span>
          </span>
          <DropdownMenu
            trigger={
              <Button>
                Change
                <DropdownArrow
                  style={{ width: 13, height: 13, marginLeft: 10 }}
                />
              </Button>
            }
            content={
              <div>
                {networks.map(network => (
                  <DropdownItem key={network}>
                    <ButtonUnstyled
                      style={{
                        width: '100%',
                        padding: '10px 15px',
                        lineHeight: 1,
                        textAlign: 'left'
                      }}
                      onClick={() => dispatch(changeNetworkAction(network))}>
                      {network}
                    </ButtonUnstyled>
                  </DropdownItem>
                ))}
              </div>
            }
          />
        </p>
      ) : (
        <p>No networks</p>
      )}
      <hr style={{ borderColor: Colors.GRAY_2, margin: '15px 0' }} />
      <table>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '5px 5px 5px 0' }}>
              Network
            </th>
            <th style={{ textAlign: 'left', padding: 5 }}>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {networks.map(n => (
            <tr key={n}>
              <td style={{ textAlign: 'left', padding: '5px 5px 5px 0' }}>
                {n}
              </td>
              <td style={{ textAlign: 'left', padding: 5 }}>
                {n === network ? 'X' : '0'}
              </td>
              <td style={{ padding: '5px 0 5px 5px' }}>
                <Link to={`/network/${n}`}>View</Link>{' '}
                <Link to={`/network/${n}/edit`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '15px 0'
        }}>
        <Link to={Paths.NetworkImport}>
          <Button>Import network</Button>
        </Link>
      </div>
    </div>
  )
}
