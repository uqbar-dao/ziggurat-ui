import React from 'react'
import './Button.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  dark?: boolean,
  small?: boolean,
  wide?: boolean,
  xwide?: boolean,
  mr1?: boolean,
  mb1?: boolean,
}

const Button: React.FC<ButtonProps> = ({
  dark,
  small,
  wide,
  xwide,
  mr1,
  mb1,
  ...props
}) => {
  return (
    <button {...props} className={`button ${props.className || ''} ${dark ? 'dark' : ''} ${small ? 'small' : ''} ${wide ? 'wide' : ''} ${xwide ? 'xwide' : ''} ${mr1 ? 'mr1' : ''} ${mb1 ? 'mb1' : ''}`}>
      {props.children}
    </button>
  )
}

export default Button
