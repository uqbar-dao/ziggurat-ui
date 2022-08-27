import React from 'react'
import './Loader.scss'

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  dark?: boolean
  size?: string
}

const Loader: React.FC<LoaderProps> = ({
  dark = false,
  size,
  ...props
}) => {
  return <div className={`lds-ring ${dark?'dark':''} ${size||''}`} {...props}><div></div><div></div><div></div><div></div></div>
}

export default Loader
