import React from 'react'
import './Text.scss'
import classNames from 'classnames'

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  mono?: boolean
  breakWord?: boolean
  breakAll?:boolean
  bold?: boolean
  oneLine?: boolean
  large?: boolean
  mb1?: boolean
  ml1?: boolean
  mr1?: boolean
}

const Text: React.FC<TextProps> = ({
  mono,
  bold,
  breakWord,
  breakAll,
  oneLine,
  large,
  mb1,
  ml1,
  mr1,
  ...props
}) => {
  return (
    <span {...props} className={`text ${props.className || ''} ${classNames({ mono, bold, breakWord, breakAll, oneLine, large, mb1, ml1, mr1, })}`} >
      {props.children}
    </span>
  )
}

export default Text
