import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Tooltip } from '../popovers/tooltip'

interface CopyWithtooltipProps {
  children: React.ReactElement
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
        <Tooltip content='Copied' isOpen={copied}>
          {children}
        </Tooltip>
      </span>
    </CopyToClipboard>
  )
}
