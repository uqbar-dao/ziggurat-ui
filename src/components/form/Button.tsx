// React.HTMLProps<HTMLButtonElement>
import React from 'react'
import './Button.scss'
import classNames from 'classnames'

export type ButtonVariant = 'dark' | 'unstyled' | undefined

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant 
  icon?: JSX.Element
  iconOnly?: boolean
  dark?: boolean
  small?: boolean
  wide?: boolean
  xwide?: boolean
  mr1?: boolean
  mb1?: boolean
  mt1?: boolean
  expander?: boolean
}

const Button: React.FC<ButtonProps> = ({
  variant,
  icon,
  iconOnly = false,
  type,
  dark,
  small,
  wide,
  xwide,
  style,
  mr1,
  mb1,
  mt1,
  expander,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`button ${variant || ''} ${classNames( {
        dark, small, wide, xwide, mr1, mt1, mb1, expander, iconOnly
      })} ${props.className || ''}`}
      type={type || "button"}
      style={{ ...style, justifyContent: 'space-evenly' }}
    >
      {icon}
      {!iconOnly && props.children}
    </button>
  )
}

export default Button
