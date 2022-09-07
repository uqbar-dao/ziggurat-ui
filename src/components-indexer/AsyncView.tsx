import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../api'

interface AsyncViewProps {
  renderer: (data?: any) => JSX.Element
}

export const AsyncView = ({ renderer }: AsyncViewProps) => {
  const location = useLocation()
  const [data, setData] = useState<any>()

  console.log('LOCATION:', location)

  useEffect(() => {
    const getData = async () => {
      const result = await api.scry({ app: 'uqbar-indexer', path: location.pathname })
      console.log('SCRY DATA:', result)
      setData(result)
    }

    getData()
  }, [location])

  if (!data) {
    // TODO: put error message here
    return null
  }

  return renderer(data)
}
