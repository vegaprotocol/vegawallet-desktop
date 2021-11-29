import './chrome.scss'
import React from 'react'
import { Switcher } from '../switcher'
import { Vega } from '../icons'
import { Link } from 'react-router-dom'

export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div className='chrome'>
      <div className='chrome__topbar'>
        <Link to='/'>
          <Vega style={{ width: 30, height: 30 }} />
        </Link>
        <Switcher />
      </div>
      <main className='chrome__main'>{children}</main>
    </div>
  )
}
