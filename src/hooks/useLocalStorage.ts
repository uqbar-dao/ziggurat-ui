import { useState } from "react"

export default function useLocalStorage<T>(name: string, initialValue: T): [T, (val: T) => void] {
  const [value, setValue] = useState<T>(JSON.parse(localStorage.getItem(name) || 'null') || initialValue)

  const storeValue = (value: T) => {
    setValue(value)
    localStorage.setItem(name, JSON.stringify(value))
  }

  return [value, storeValue]
}
