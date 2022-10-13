export type EndpointType = 'scry' | 'sub' | 'poke'

export const ENDPOINT_TYPES = ['scry', 'sub', 'poke']

export interface Endpoint {
  id: string
  type: EndpointType
  app: string
  sub?: number
  result?: string | string[]
  error?: string
  path?: string
  mark?: string
  json?: string
}
