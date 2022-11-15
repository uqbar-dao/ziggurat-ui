import { useState } from "react"

export default function useSessionStorage<T>(name: string, initialValue: T): [T, (val: T) => void] {
  const [value, setValue] = useState<T>(JSON.parse(sessionStorage.getItem(name) || 'null') || initialValue)

  const storeValue = (value: T) => {
    setValue(value)
    sessionStorage.setItem(name, JSON.stringify(value))
  }

  return [value, storeValue]
}
