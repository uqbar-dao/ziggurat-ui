export const processRawData = (input: { [key: string]: any } | undefined) : any => {
  if (!input || typeof input !== 'object') {
    return input
  } else if (input instanceof Array) {
    return input.map(processRawData)
  }

  const parsed: { [key: string]: any } = {}

  for (let key in input) {
    const value = input[key]
    const camelKey = key.replace(/-[a-z]/g, (match) => match[1].toUpperCase())
    parsed[camelKey] = processRawData(value)
  }

  return parsed
}
