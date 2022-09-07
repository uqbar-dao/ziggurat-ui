import React from 'react'
import Col from '../spacing/Col'
import './TextArea.scss'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: any
  label?: string
  containerStyle?: React.CSSProperties
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  containerStyle,
  ...props
}) => {
  return (
    <Col className="input-container" style={containerStyle}>
      {!!label && <label style={{ fontSize: 14, marginBottom: 0 }}>{label}</label>}
      <textarea {...props} className={`text-area ${props.className || ''}`} />
    </Col>
  )
}

export default TextArea
