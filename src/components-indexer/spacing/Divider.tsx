import React from 'react'
import './Divider.scss'

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {

}

const Divider: React.FC<DividerProps> = (props) => {
  return (
    <div {...props} className={`divider ${props.className || ''}`} />
  )
}

export default Divider
