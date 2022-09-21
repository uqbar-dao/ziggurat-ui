import moment from "moment"

export const getDiff = (date: Date) => new Date().getTime() - date.getTime()

// ~2022.2.8..16.48.20..b53a
export const getHoonDate = (d: Date) => `~${d.getFullYear()}.${d.getMonth()}.${d.getDate()}..${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}..${d.getMilliseconds().toString(16)}`

export const getOffset = (nextBlockTime: number) => Math.round((nextBlockTime - new Date().getTime()) / 1000)

export const formatIndexerTimestamp = (timestamp: number) => moment(timestamp * 1000).format('YYYY-MM-DD HH:mm')
