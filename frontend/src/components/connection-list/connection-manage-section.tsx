import { Controller, useFieldArray } from 'react-hook-form'
import type { Control } from 'react-hook-form'

import startCase from 'lodash/startCase'

import type { WalletModel } from '../../wallet-client'
import type { NormalizedPermissionMap } from './connection-manage'
import { Title } from '../title'
import { ButtonUnstyled } from '../button-unstyled'
import { Checkbox } from '../checkbox'
import { DropdownMenu, DropdownItem } from '../dropdown-menu'
import { DropdownArrow } from '../icons/dropdown-arrow'
import { Colors } from '../../config/colors'
import { truncateMiddle } from '../../lib/truncate-middle'

const AccessModes: Record<string, WalletModel.AccessMode> = {
  Read: 'read',
  None: 'none'
}

const descriptionMapping = {
  publicKeys: 'Determines the permissions the application has in regards your public keys.'
}

const hasDescription = (accessType: string): accessType is keyof typeof descriptionMapping => {
  return Object.keys(descriptionMapping).includes(accessType)
}

const getDescriptor = (accessType: string) => {
  const title = startCase(accessType)
  if (hasDescription(accessType)) {
    return {
      title,
      description: descriptionMapping[accessType]
    }
  }
  return {
    title,
  }
}

type PermissionSectionProps = {
  accessType: keyof WalletModel.Permissions
  control: Control<NormalizedPermissionMap>
}

export const PermissionSection = ({ accessType, control }: PermissionSectionProps) => {
  const { title, description } = getDescriptor(accessType)
  const { fields } = useFieldArray({
    name: `${accessType}.restrictedKeys`,
    control,
  })

  return (
    <div
      style={{
        padding: `20px 0`,
        borderBottom: `1px solid ${Colors.DARK_GRAY_1}`
      }}
    >
      <Controller
        name={`${accessType}.access`}
        control={control}
        render={({ field }) => (
          <>
            <div style={{
              display: 'flex',
              gap: 20,
              margin: '20px 0',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Title style={{ margin: 0 }}>{title}</Title>
              <DropdownMenu
                trigger={(
                  <ButtonUnstyled style={{ padding: '0 12px' }}>
                    {field.value}
                    <DropdownArrow
                      style={{ width: 13, height: 13, marginLeft: 10 }}
                    />
                  </ButtonUnstyled>
                )}
                content={Object.keys(AccessModes).map(key => (
                  <DropdownItem
                    key={key}
                    onClick={() => field.onChange(AccessModes[key])}
                  >
                    {key}
                  </DropdownItem>
                ))}
              />
            </div>
            {description && (
              <p style={{ marginBottom: 20 }}>{description}</p>
            )}
            {field.value !== 'none' && fields.map((field, index) => (
              <Checkbox
                key={field.id}
                name={`${accessType}.restrictedKeys.${index}.value`}
                label={(
                  <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <Title style={{ margin: '0 12px 0 0' }}>{field.name}</Title>
                    (<code>{truncateMiddle(field.key)}</code>)
                  </div>
                )}
                control={control}
              />
            ))}
          </>
        )}
      />
    </div>
  )
}
