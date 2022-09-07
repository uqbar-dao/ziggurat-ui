import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Col from '../../components-indexer/spacing/Col'
import useExplorerStore from '../store/explorerStore'

const BlocksView = () => {
  const { scry } = useExplorerStore()
  const location = useLocation()
  const [data, setData] = useState<any>()

  console.log('LOCATION:', location)

  useEffect(() => {
    const getData = async () => {
      const result = await scry(`/headers/${location.pathname.split('/').slice(1).join('/')}`)
      console.log('SCRY DATA:', result)
      setData(result)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!data) {
    // TODO: put error message here
    return null
  }

  return (
    <Col>
      
    </Col>
  )
}

export default BlocksView
