import React from 'react'

interface NodeListProps {
  items: string[]
}

export function NodeList({ items }: NodeListProps) {
  return (
    <ul
      data-testid='node-table'
      style={{ listStyle: 'none', margin: 0, padding: 0 }}
    >
      {items.map((item, i) => (
        <li
          data-testid='nodes-list'
          key={i}
          style={{ marginBottom: 5 }}
          className='text-muted'
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
