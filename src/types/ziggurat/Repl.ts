
export interface Tab {
  name: string
  active: boolean
}

export interface View {
  name: string
  active: boolean
}

export interface Ship {
  name: string
  active: boolean
  apps: {
    [key: string]: any
  }
  expanded?: boolean
}

export interface Poke {
  app: string
  ship: string
  expanded?: boolean
  expandedShips?: boolean
  expandedApps?: boolean
  data: string
}

export interface Scry {
  ship: string
  data: string
  expanded?: boolean
  expandedShips?: boolean
}

export interface Event {
  source: string
  type: string
  data: string
}