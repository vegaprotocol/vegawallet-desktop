import React from 'react'
import { Outlet } from 'react-router-dom'

export const Wallet = () => {
  // Wallet page doesnt have any consistent UI shared amongs child pages so just render the <Outlet />
  return <Outlet />
}
