import React from 'react'
import { Link } from 'react-router-dom';
import './Link.scss'

interface CustomLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  type?: string;
  target?: string;
  external?: boolean
}

const CustomLink: React.FC<CustomLinkProps> = ({
  href,
  type = '',
  external,
  ...props
}) => {
  return (
    external ? <a href={href} className={`link ${props.className || ''} ${type}`}>{props.children}</a> 
    : <Link to={href} {...props} className={`link ${props.className || ''} ${type}`}>
      {props.children}
    </Link>
  )
}

export default CustomLink
