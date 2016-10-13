import _debug from 'debug'

const debug = _debug('app:server:shared::dateHelper')

export const convertDateFormat = ( date ) => {
  if (date == null) return ''

  date = new Date(date)
  if (date <= new Date('2002') || isNaN(date)) {
    // debug(`date ${date} date <= new Date('2002') ${date <= new Date('2002')}, isNaN(date) ${isNaN(date)}`)
    return ''
  }

  const month = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()

  return `${date.getFullYear()}-${month}-${day}`
}