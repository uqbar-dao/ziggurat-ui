import React from 'react'
import './Row.scss'
import classNames from 'classnames'

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  between?: boolean,
  evenly?: boolean,
  reverse?: boolean,
}

const Row: React.FC<RowProps> = ( { between, evenly,  reverse, ...props } ) => {
  return (
    <div {...props} className={`row ${props.className || ''} ${classNames({ between, evenly, reverse })}`}>
      {props.children}
    </div>
  )
}

export default Row
