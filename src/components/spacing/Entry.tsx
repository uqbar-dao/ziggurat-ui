import classNames from 'classnames';
import React from 'react'
import Col from '../spacing/Col';
import Divider from '../spacing/Divider';
import Row from '../spacing/Row';
import './Entry.scss'

interface EntryProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  divide? : boolean
  title? : string
  center?: boolean
  wrap?: boolean
}

const Entry: React.FC<EntryProps> = ({ className = '', wrap, center, children, title, divide = false, ...rest }) => {
  return (
    <>
      <Col center={center} className={classNames('entry', className, { divide })} {...rest}>
        {title && <h3>{title}</h3>}
        {children}
      </Col>
      { divide && <Divider />}
    </>
  )
}

export default Entry
