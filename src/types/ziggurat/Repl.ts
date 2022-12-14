
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
  data: {
    [key: string]: any
  }
}