import React from 'react'
import './Text.scss'

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  mono?: boolean,
  breakWord?: boolean,
  bold?: boolean,
  oneLine?: boolean,
  large?: boolean,
  mb1?: boolean,
  ml1?: boolean,
}

const Text: React.FC<TextProps> = ({
  mono,
  bold,
  breakWord,
  oneLine,
  large,
  mb1,
  ml1,
  ...props
}) => {
  return (
    <span {...props} className={`text ${props.className || ''} ${mono ? 'mono' : ''} ${breakWord ? 'break' : ''} ${oneLine? 'one-line' :''} ${bold ? 'bold' : ''} ${large ? 'large' : ''} ${mb1 ? 'mb1' : ''} ${ml1 ? 'ml1' : ''}`} >
      {props.children}
    </span>
  )
}

export default Text
