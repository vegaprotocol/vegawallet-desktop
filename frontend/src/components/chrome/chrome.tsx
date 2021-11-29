import './chrome.scss'
import React from 'react'
import { Switcher } from '../switcher'
import { Vega } from '../icons'

export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div className='chrome'>
      <div className='chrome__topbar'>
        <div>
          <Vega style={{ width: 30, height: 30 }} />
        </div>
        <Switcher />
      </div>
      <main className='chrome__main'>{children}</main>
    </div>
  )
}
