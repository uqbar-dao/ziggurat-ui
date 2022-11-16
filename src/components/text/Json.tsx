import React from 'react'
import { FormatSettings, prettyPrintJson } from 'pretty-print-json'
import './Json.scss'

interface JsonProps extends React.HTMLAttributes<HTMLPreElement> {
  json: any
  doNotLinkifyAddresses?: boolean
  options?: FormatSettings
}

const Json: React.FC<JsonProps> = ({ json, doNotLinkifyAddresses, className = '', options, ...props }) => {
  const linkifyHtml = (json: any) => {
    let out = prettyPrintJson.toHtml(json, options)
    const tofrom_re = '(<span class=json-key>(to|from)</span>\
\\n?\\r?\\s*<span class=json-mark>: </span>\
\\n?\\r?\\s*<span class=json-string>")(.+?)("</span>)'
    const item_re = '(<span class=json-key>item</span>\
\\n?\\r?\\s*<span class=json-mark>: </span>\
\\n?\\r?\\s*<span class=json-string>")(.+?)("</span>)'
    out = out.replace(new RegExp(tofrom_re, 'g'), '$1<a href="/apps/ziggurat/indexer/address/$3">$3</a>$4')
      .replace(new RegExp(item_re, 'g'), '$1<a href="/apps/ziggurat/indexer/item/$2">$2</a>')
    return out
  }

  const final = doNotLinkifyAddresses ? prettyPrintJson.toHtml(json, options) 
    : linkifyHtml(json)
  
  return (
    <pre className={`json-container ${className}`} 
      {...props} 
      dangerouslySetInnerHTML={{ __html: final }} 
    />
  )
}

export default Json