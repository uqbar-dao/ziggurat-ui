import classNames from 'classnames'
import React from 'react'
import Row from '../spacing/Row'
import Text from '../text/Text'
import './Pill.scss'

interface PillProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  label: string
  color?: string
}

const Pill: React.FC<PillProps> = ({ value, label, color, ...props }) => {
  return (
    <Row {...props} className={'pill'}>
      <Text className={'label ' +  (color || 'turq')} small>{label}</Text>
      <Text className='value' small>{value}</Text>
    </Row>
  )
}

export default Pill