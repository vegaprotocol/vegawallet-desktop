import type { LiHTMLAttributes, OlHTMLAttributes } from 'react'
import React from 'react'

type BulletListProps = OlHTMLAttributes<HTMLUListElement>

export function BulletList(props: BulletListProps) {
  return <ul {...props} />
}

type BulletListItemProps = LiHTMLAttributes<HTMLLIElement>

export function BulletListItem({ children, ...props }: BulletListItemProps) {
  return (
    <li {...props}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <svg
          width='11'
          height='11'
          viewBox='0 0 11 11'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          style={{
            position: 'relative',
            top: 7,
            display: 'inline-block',
            marginRight: 10
          }}
        >
          <rect width='11' height='11' fill='currentColor'></rect>
        </svg>
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </li>
  )
}
