import React from 'react'
import Col from '../spacing/Col'
import './TextArea.scss'

interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  ref?: any
  value?: string
  label?: string
  containerStyle?: React.CSSProperties
}

const TextArea: React.FC<TextAreaProps> = ({ label, containerStyle, ...props }: TextAreaProps) => {
  return (
    <Col className="text-area-container" style={containerStyle}>
      {!!label && <label style={{ fontSize: 14, marginBottom: 4 }}>{label}</label>}
      <textarea {...props} className={`text-area ${props.className || ''}`} />
    </Col>
  )
}

export default TextArea
