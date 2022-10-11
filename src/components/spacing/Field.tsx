import classNames from 'classnames'
import React from 'react'
import Row from '../spacing/Row'
import Text from '../text/Text'
import './Field.scss'

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string,
  name: string,
  center?: boolean,
  mono?: boolean,
}

const Field : React.FC<FieldProps> = ({ className = '', children, mono, name, ...rest }) => {
  return (
    <Row className={`field ${className}`} {...rest}>
      <Text bold className='label'>{name}</Text>
      <Row className={classNames('content', { monospace: mono })}>
        {children}
      </Row>
    </Row>
  )
}

export default Field