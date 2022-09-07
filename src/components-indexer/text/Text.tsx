import React from 'react'
import './Text.scss'

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  mono?: boolean,
  breakWord?: boolean,
  bold?: boolean,
  oneLine?: boolean,
  large?: boolean,
}

const Text: React.FC<TextProps> = ({
  mono,
  bold,
  breakWord,
  oneLine,
  large,
  ...props
}) => {
  return (
    <span {...props} className={`text ${props.className || ''} ${mono ? 'mono' : ''} ${breakWord ? 'break' : ''} ${oneLine? 'one-line' :''} ${bold ? 'bold' : ''} ${large ? 'large' : ''}`} >
      {props.children}
    </span>
  )
}

export default Text
