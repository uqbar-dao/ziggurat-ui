import React from 'react'
import { useNavigate } from 'react-router-dom'
import Text from '../../components/text/Text'

import './BackLink.scss'

const BackLink: React.FC = () =>{
  const navigate = useNavigate()

  return (
    <Text className='button link back-link' onClick={() => navigate(-1)}> Back </Text>
  )
}

export default BackLink