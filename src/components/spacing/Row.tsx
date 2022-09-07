import React from 'react'
import './Row.scss'

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  between?: boolean,
  evenly?: boolean,
  reverse?: boolean,
}

const Row: React.FC<RowProps> = ( { between, evenly,  reverse, ...props } ) => {
  return (
    <div {...props} className={`row ${props.className || ''} ${ between ? 'between' : ''} ${evenly ? 'evenly' : ''} ${reverse ? 'reverse' : ''}`}>
      {props.children}
    </div>
  )
}

export default Row
