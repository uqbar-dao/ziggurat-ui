import React from 'react'
import { FormatSettings, prettyPrintJson } from 'pretty-print-json'
import './Json.scss'

interface JsonProps extends React.HTMLAttributes<HTMLPreElement> {
  json: any
  options?: FormatSettings
}

const Json: React.FC<JsonProps> = ({ json, className = '', options, ...props }) => {
  return (
    <pre className={`json-container ${className}`} 
      {...props} 
      dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(json, options)  }} 
    />
  )
}

export default Json