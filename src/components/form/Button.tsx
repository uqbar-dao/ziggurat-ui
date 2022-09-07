// React.HTMLProps<HTMLButtonElement>
import React from 'react'
import './Button.scss'

export type ButtonVariant = 'dark' | 'unstyled' | undefined

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant 
  icon?: JSX.Element
  iconOnly?: boolean
  dark?: boolean,
  small?: boolean,
  wide?: boolean,
  xwide?: boolean,
  mr1?: boolean
  mb1?: boolean
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
  ...props
}) => {
  return (
    <button
      {...props}
      className={`button ${props.className || ''}
      ${variant || ''} ${dark ? 'dark' : ''} ${small ? 'small' : ''} ${wide ? 'wide' : ''} ${xwide ? 'xwide' : ''} ${mr1 ? 'mr1' : ''} ${mb1 ? 'mb1' : ''}`}
      type={type || "button"}
      style={{ ...style, justifyContent: 'space-evenly' }}
    >
      {icon}
      {!iconOnly && props.children}
    </button>
  )
}

export default Button
