import React from 'react'
import './Row.scss'
import classNames from 'classnames'

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  between?: boolean
  evenly?: boolean
  reverse?: boolean
  fullWidth?: boolean
  wrap?: boolean
}

const Row: React.FC<RowProps> = ( { between, evenly,  reverse, fullWidth, wrap, ...props } ) => {
  return (
    <div {...props} className={`row ${props.className || ''} ${classNames({ between, evenly, reverse, wrap, w100: fullWidth })}`}>
      {props.children}
    </div>
  )
}

export default Row
