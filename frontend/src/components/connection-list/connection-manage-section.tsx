import startCase from 'lodash/startCase'
import type { Control } from 'react-hook-form'
import { Controller, useFieldArray } from 'react-hook-form'

import { truncateMiddle } from '../../lib/truncate-middle'
import type { WalletModel } from '../../wallet-client'
import { Checkbox } from '../checkbox'
import { RadioGroup } from '../radio-group'
import { Title } from '../title'
import type { NormalizedPermissionMap } from './connection-manage'

const AccessModes: Record<string, WalletModel.AccessMode> = {
  Read: 'read',
  None: 'none'
}

type PermissionSectionProps = {
  accessType: keyof WalletModel.Permissions
  control: Control<NormalizedPermissionMap>
}

export const PermissionSection = ({
  accessType,
  control
}: PermissionSectionProps) => {
  const title = startCase(accessType)
  const { fields } = useFieldArray({
    name: `${accessType}.restrictedKeys`,
    control
  })

  return (
    <div
      style={{
        padding: `20px 0`
      }}
    >
      <Controller
        name={`${accessType}.access`}
        control={control}
        render={({ field }) => (
          <>
            <Title style={{ margin: '20px 0' }}>{title}</Title>
            <RadioGroup
              name={`${accessType}.access`}
              control={control}
              options={Object.keys(AccessModes).map(label => ({
                label,
                value: AccessModes[label]
              }))}
            />
            {field.value !== 'none' && <Title>Key pairs</Title>}
            {field.value !== 'none' &&
              fields.map((field, index) => (
                <Checkbox
                  key={field.id}
                  name={`${accessType}.restrictedKeys.${index}.value`}
                  label={
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Title style={{ margin: '0 12px 0 0' }}>
                        {field.name}
                      </Title>
                      (<code>{truncateMiddle(field.key)}</code>)
                    </div>
                  }
                  control={control}
                />
              ))}
          </>
        )}
      />
    </div>
  )
}
