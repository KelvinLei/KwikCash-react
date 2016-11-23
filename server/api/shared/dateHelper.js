import _debug from 'debug'
var moment = require('moment')
const debug = _debug('app:server:shared::dateHelper')

export const convertDateFormat = ( date ) => {
  if (date == null || date == '0000-00-00') return ''
  // debug(`in convertDateFormat, date ${date}`)
  // date = moment(date)
  date = new Date(date)
  // debug(`in convertDateFormat, date ${date}`)

  if (date <= new Date('2002') || isNaN(date.getTime())) return ''
  const month = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)

  // debug(`in convertDateFormat, month ${month}`)
  // debug(`in convertDateFormat, utc month ${date.getUTCMonth()}`)
  // debug(`in convertDateFormat, utc day ${date.getUTCDay()}`)
  // debug(`in convertDateFormat, utc date ${date.getUTCDate()}`)

  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()

  // debug(`in convertDateFormat, day ${day}`)

  return `${date.getFullYear()}-${month}-${day}`
  // return date.format('YYYY-MM-DD');
}