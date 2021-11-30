import './dropdown.scss'
import React from 'react'

export function Dropdown({
  target,
  contents,
  isOpen
}: {
  target: React.ReactElement
  contents: React.ReactElement
  isOpen: boolean
}) {
  return (
    <div className='dropdown'>
      <div className='dropdown__target'>{target}</div>
      <div
        className='dropdown__contents'
        style={{ display: isOpen ? 'block' : 'none' }}>
        {contents}
      </div>
    </div>
  )
}
