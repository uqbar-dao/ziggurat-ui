const ls = {
  get: <T>(key: string) : T | null => {
    const json = sessionStorage.getItem(key)
    if (!json) {
      return null
    }

    return JSON.parse(json)
  },
  set: (key: string, data: any) => {
    sessionStorage.setItem(key, JSON.stringify(data))
  }
}

export default ls
