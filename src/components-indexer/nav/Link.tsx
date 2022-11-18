import React from 'react'
import { Link as CustomLink } from 'react-router-dom'
import './Link.scss'

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
  type?: string
  external?: boolean
  newTab?: boolean
}

const Link: React.FC<LinkProps> = ({
  href,
  type = '',
  external,
  newTab = false,
  ...props
}) => {
  return (
    external ? <a href={href} target={newTab ? '_blank' : undefined} rel='noreferrer' {...props} className={`link ${props.className || ''} ${type}`}>
      {props.children}
    </a>
    : <CustomLink to={href} {...props} className={`link ${props.className || ''} ${type}`}>
    {props.children}
  </CustomLink>
  )
}

export default Link
