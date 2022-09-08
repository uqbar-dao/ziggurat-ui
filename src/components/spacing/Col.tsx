import React from 'react'
import './Col.scss'

interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  innerRef?: any
  center?: boolean
}

const Col: React.FC<ColProps> = ({ innerRef, center, ...props }: ColProps) => {
  return (
    <div ref={innerRef} {...props} className={`col ${props.className || ''} ${center ? 'center' : ''}`}>
      {props.children}
    </div>
  )
}

export default Col
