import React from 'react'
import Text from '../text/Text'
import './Card.scss'
import CardHeader from './CardHeader'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string,
}

const Card: React.FC<CardProps> = ({ className, title, children, ...rest }) => {
  return (
    <div {...rest} 
         className={`card ${title ? 'title' : ''} ${className || ''}`}>
      {title && <CardHeader title={title} />}
      {children}
    </div>
  )
}

export default Card
