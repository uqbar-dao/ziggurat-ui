import React from 'react'
import './CardHeader.scss'
import Text from '../text/Text'
import Row from '../spacing/Row'

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string,
  title: string
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, title, className, ...rest }) => {
  return (
    <Row className={`header ${className || ''}`} {...rest}>
      <Text large >
        {title}
      </Text>
      {children}
    </Row>
  )
}

export default CardHeader