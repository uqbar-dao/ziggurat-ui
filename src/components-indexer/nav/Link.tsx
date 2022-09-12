import React from 'react'
import { Link as CustomLink } from 'react-router-dom'
import './Link.scss'

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
  type?: string
  external?: boolean
}

const Link: React.FC<LinkProps> = ({
  href,
  type = '',
  external,
  ...props
}) => {
  return (
    external ? <a href={href} {...props} className={`link ${props.className || ''} ${type}`}>
      {props.children}
    </a>
    : <CustomLink to={href} {...props} className={`link ${props.className || ''} ${type}`}>
    {props.children}
  </CustomLink>
  )
}

export default Link
