const ls = {
  get: <T>(key: string) : T | null => {
    const json = localStorage.getItem(key)
    if (!json) {
      return null
    }

    return JSON.parse(json)
  },
  set: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export default ls
