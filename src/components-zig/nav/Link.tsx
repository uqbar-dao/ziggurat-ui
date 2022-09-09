import classNames from 'classnames';
import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import './Link.scss'

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
  type?: string
  external?: boolean
  underline?: boolean
  target?: string
}

const Link: React.FC<LinkProps> = ({
  href,
  external,
  type = '',
  underline = false,
  ...props
}) => {
  const classes = `link ${props.className || ''} ${type} ${classNames(underline)}`

  return (
    external ? <a href={href} {...props} className={classes}>
      {props.children}
    </a>
    : <RouterLink to={href} {...props} className={classes}>
      {props.children}
    </RouterLink>
  )
}

export default Link
