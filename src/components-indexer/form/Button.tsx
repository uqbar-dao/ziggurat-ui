// React.HTMLProps<HTMLButtonElement>
import React from 'react'
import './Button.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string
}

const Button: React.FC<ButtonProps> = ({
  variant,
  ...props
}) => {
  return (
    <button {...props} className={`button ${props.className || ''} ${variant || ''}`}>
      {props.children}
    </button>
  )
}

export default Button
