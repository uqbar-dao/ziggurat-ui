import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import './Link.scss'

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  type?: string;
  underline?: boolean
}

const Link: React.FC<LinkProps> = ({
  href,
  type = '',
  underline = false,
  ...props
}) => {
  return (
    <RouterLink to={href} {...props} className={`link ${props.className || ''} ${type} ${underline ? 'underline' : ''}`}>
      {props.children}
    </RouterLink>
  )
}

export default Link
