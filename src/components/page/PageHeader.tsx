import React from 'react'
import Row from '../spacing/Row'

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string,
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, className, children, ...rest }) => {
  return (
    <Row {...rest} className={className} style={{ alignItems: 'flex-end', ...rest.style }}>
      <h2 style={{ fontWeight: 500, margin: '1em 1em 0 0' }}>{title}</h2>
      {children}
    </Row>

  )
}

export default PageHeader