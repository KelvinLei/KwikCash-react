import _debug from 'debug'

const debug = _debug('app:server:shared::dateHelper')

export const convertDateFormat = ( date ) => {
  // debug(`date is ${date}`)
  if (date == null || date <= new Date('2002') || isNaN(date)) {
    return ''
  }

  if (!date instanceof Date) {
    date = new Date(date)
  }

  const month = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()

  return `${date.getFullYear()}-${month}-${day}`
}