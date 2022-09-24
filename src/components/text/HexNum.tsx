import React from 'react'
import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from '../../utils/colors'
import { addHexDots } from '../../utils/format'
import Row from '../spacing/Row'
import CopyIcon from './CopyIcon'
import './HexNum.scss'
import Text from './Text'

interface HexNumProps extends React.HTMLAttributes<HTMLSpanElement> {
  colors?: boolean,
  num: string,
  displayNum?: string,
  mono?: boolean
  bold?: boolean
  copy?: boolean
  copyText?: string
}

const HexNum: React.FC<HexNumProps> = ({
  colors = true,
  num,
  displayNum = num,
  mono,
  bold,
  copy,
  copyText,
  ...props
}) => {
  num = num.replace(/(0x|\.)/g,'')
  
  while (num.length < 6)
  {
    num = '0' + num
  }

  copyText = copyText || displayNum

  const leftHsl = rgbToHsl(hexToRgb(num.slice(0, 6)))
  const rightHsl = rgbToHsl(hexToRgb(num.length > 6 ? num.slice(num.length - 6) : num))
  leftHsl.s = rightHsl.s = 1
  const leftColor = rgbToHex(hslToRgb(leftHsl))
  const rightColor = rgbToHex(hslToRgb(rightHsl))

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
      <Text breakAll className='hex-text' bold={bold} mono={mono}> 
        {displayNum}
      </Text>
      {copy && <CopyIcon text={addHexDots(copyText)} />}
    </Row>
  )
}

export default HexNum
