import React from 'react'
import Row from '../spacing/Row'
import Text from '../text/Text'
import './Field.scss'

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string,
  name: string,
}

const Field : React.FC<FieldProps> = ({ className = '', children, name, ...rest }) => {
  return (
    <Row className={`field ${className}`} {...rest}>
      <Text bold className='label'>{name}</Text>
      <Row className='content'>
        {children}
      </Row>
    </Row>
  )
}

export default Field