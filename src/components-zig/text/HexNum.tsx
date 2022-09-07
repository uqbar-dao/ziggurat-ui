import React from 'react'
import Row from '../spacing/Row'
import './HexNum.scss'
import Text from './Text'

interface HexNumProps extends React.HTMLAttributes<HTMLSpanElement> {
  colors?: boolean,
  num: string,
  displayNum: string,
}

const HexNum: React.FC<HexNumProps> = ({
  colors = true,
  num,
  displayNum,
  ...props
}) => {
  num = num.replace(/(0x|\.)/g,'')
  
  while (num.length < 6)
  {
    num = '0' + num
  }

  const leftColor = '#' + num.slice(0, 6)
  const rightColor = '#' + (num.length > 6 ? num.slice(num.length - 6) : num)
  const angle = (parseInt(num, 16) % 360) || -45

  return (
    <Row {...props} className={`hex ${props.className || ''} ${colors ? 'colors' : ''}`}>
      {colors && <span className='color-dot' style={{ 
        borderTopColor: leftColor,
        borderRightColor: rightColor,
        borderBottomColor: rightColor,
        borderLeftColor: leftColor,

        background: `linear-gradient(${angle}deg, ${leftColor} 0 50%, ${rightColor} 50% 100%)`, 
      }}></span>}
      <Text>
        {displayNum}
      </Text>
    </Row>
  )
}

export default HexNum
