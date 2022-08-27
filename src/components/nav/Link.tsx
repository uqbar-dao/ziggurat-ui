import React from 'react'
import { Link } from 'react-router-dom';
import './Link.scss'

interface NavLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  type?: string;
  underline?: boolean
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  type = '',
  underline = false,
  ...props
}) => {
  return (
    <Link to={href} {...props} className={`link ${props.className || ''} ${type} ${underline ? 'underline' : ''}`}>
      {props.children}
    </Link>
  )
}

export default NavLink
