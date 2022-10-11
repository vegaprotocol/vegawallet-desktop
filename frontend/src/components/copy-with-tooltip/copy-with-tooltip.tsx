import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Copy } from '../icons/copy'

import { Tooltip } from '../tooltip'

interface CopyWithtooltipProps {
  children?: React.ReactElement
  text: string
}

export function CopyWithTooltip({ children, text }: CopyWithtooltipProps) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    let timeout: any

    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 800)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [copied])

  return (
    <CopyToClipboard text={text} onCopy={() => setCopied(true)}>
      {/* Needs this wrapping div as tooltip component interfers with element used to capture click for copy */}
      <span>
        <Tooltip
          trigger={(
            <span style={{ cursor: 'pointer' }}>
              {children}
              <Copy style={{ width: 13, marginLeft: 6 }} />
            </span>
          )}
          content='Copied'
          isOpen={copied}
        />
      </span>
    </CopyToClipboard>
  )
}
