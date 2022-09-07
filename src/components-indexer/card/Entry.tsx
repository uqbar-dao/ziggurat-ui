import React from 'react'
import Col from '../spacing/Col';
import Divider from '../spacing/Divider';
import Row from '../spacing/Row';
import './Entry.scss'

interface EntryProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  divide? : boolean
  title? : string
}

const Entry: React.FC<EntryProps> = ({ className = '', children, title, divide = true, ...rest }) => {
  return (
    <>
      <Col className={`entry ${divide ? 'divide' : ''} ${className}`} {...rest}>
        {title && <h3>{title}</h3>}
        {children}
      </Col>
      { divide && <Divider />}
    </>
  )
}

export default Entry
