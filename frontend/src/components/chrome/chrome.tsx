import './chrome.scss'
import React from 'react'
import { Switcher } from '../switcher'

export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div className='chrome'>
      <div className='chrome__topbar'>
        <Switcher />
      </div>
      <main className='chrome__main'>{children}</main>
    </div>
  )
}
