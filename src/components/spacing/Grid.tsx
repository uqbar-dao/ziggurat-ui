import React, { HTMLAttributes } from 'react'
import './Grid.scss'

const Grid : React.FC<HTMLAttributes<HTMLDivElement>> = ({ style, children, ...props }) => {
  return (
    <div className='grid' style={style}>
      {children}
    </div>
  )
}

export default Grid