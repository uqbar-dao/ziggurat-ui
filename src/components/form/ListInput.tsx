import React, { useCallback, useState } from 'react'
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import Button, { ButtonVariant } from './Button'
import Input from './Input'
import './ListInput.scss'

interface ListInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  values: string[]
  setValues: (values: string[]) => void
  hideButton?: boolean
  buttonVariant?: ButtonVariant
  label?: string
  containerStyle?: React.CSSProperties
  textStyle?: React.CSSProperties
}

export const ListInput: React.FC<ListInputProps> = ({
  values,
  setValues,
  hideButton = false,
  buttonVariant = 'dark',
  label,
  containerStyle,
  textStyle,
  ...props
}) => {
  const [value, setValue] = useState('')

  const addValue = useCallback(() => {
    if (!values.includes(value)) {
      setValues(values.concat([value]))
      setValue('')
    } else {
      window.alert(`You already have ${value} in this list.`)
    }
  }, [value, values, setValues])

  const removeValue = useCallback((value: string) => () => {
    setValues(values.filter(v => v !== value))
  }, [values, setValues])

  return (
    <Col className="list-input-container" style={containerStyle}>
      {!!label && <label style={{ fontSize: 14, marginBottom: 0 }}>{label}</label>}
      <Row style={{ width: '100%', flexWrap: 'wrap' }}>
        {values.map(value => (
          <div key={value} onClick={removeValue(value)} className='list-input-item' style={textStyle}>{value}</div>
        ))}
      </Row>
      <Row style={{ width: '100%', marginTop: 6 }}>
        <input {...props} style={{ ...props.style, width: '100%' }} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => {
          console.log(e.key)
          if (e.key === 'Enter' && value) {
            e.preventDefault()
            addValue()
          }
        }}  />
        {!hideButton && <Button style={{ marginLeft: 8, padding: '5px 8px' }} variant={buttonVariant} onClick={addValue}>Add</Button>}
      </Row>
    </Col>
  )
}

export default Input
