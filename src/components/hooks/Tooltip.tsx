import React, { useState } from 'react'

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  tip: string
}

export const Tooltip = ({ tip, children, ...props }: TooltipProps) => {
  const [show, setShow] = useState(false)

  return (
    <div {...props} style={{ ...props.style, position: 'relative' }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && <div style={{ position: 'absolute', zIndex: 3, background: 'white', overflow: 'visible', left: 0, color: 'gray' }}>{tip}</div>}
    </div>
  )
}
