import { EndpointType } from "./Endpoint"

export type EndpointFormField = 'type' | 'app' | 'path' | 'mark' | 'json'

export interface EndpointForm {
  type: EndpointType
  app: string
  path?: string
  mark?: string
  json?: string
}

export const BLANK_ENDPOINT_FORM: EndpointForm = {
  type: 'scry',
  app: '',
  path: '',
  mark: '',
  json: '',
}
