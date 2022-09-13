import React, { useCallback, useState } from 'react'
import { FaCheckCircle, FaCopy, FaRegCheckCircle, FaRegCopy } from 'react-icons/fa';
import Row from '../spacing/Row'
import Text from '../text/Text';
import './CopyIcon.scss'

interface CopyIconProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
  iconOnly?: boolean
}

const CopyIcon: React.FC<CopyIconProps> = ({
  text,
  iconOnly = true,
  ...props
}) => {
  const [didCopy, setDidCopy] = useState(false)

  const onCopy = useCallback((e) => {
    e.preventDefault()
    navigator.clipboard.writeText(text)
    setDidCopy(true)
    setTimeout(() => setDidCopy(false), 1000)
  }, [text])

  return (
    <Row style={{ marginLeft: 12, padding: '2px 4px', cursor: 'pointer' }} className="icon" onClick={onCopy}>
      {didCopy ? 
        iconOnly ? <FaRegCheckCircle />
        : <Text style={{ fontSize: 14 }}>Copied!</Text>
      : <FaRegCopy />}
    </Row>
  )
}

export default CopyIcon
