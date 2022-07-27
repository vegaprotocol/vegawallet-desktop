import { useState } from 'react'

export enum FormStatus {
  Default = 'Default',
  Pending = 'Pending',
  Success = 'Success',
  Error = 'Error'
}

export function useFormState(initialStatus = FormStatus.Default) {
  return useState(initialStatus)
}
