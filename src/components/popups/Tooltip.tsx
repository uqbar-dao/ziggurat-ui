import React, { useState } from 'react'

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  tip: string
  right?: boolean
  tipStyle?: any
}

export const Tooltip = ({ tip, right = false, children, tipStyle = {}, ...props }: TooltipProps) => {
  const [show, setShow] = useState(false)

  return (
    <div {...props} style={{ ...props.style }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <div style={{ position: 'relative' }}>
        {children}
        {show && <span className='tooltip' style={{ fontSize: 12,
          position: 'absolute',
          zIndex: 3,
          background: 'white',
          right: right ? 0 : undefined,
          left: right ? undefined: 0,
          color: 'gray',
          whiteSpace: 'nowrap',
          padding: '2px 6px',
          borderRadius: 4,
        ...tipStyle }}
        >
          {tip}
        </span>}
      </div>
    </div>
  )
}
