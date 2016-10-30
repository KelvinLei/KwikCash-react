import _debug from 'debug'
var moment = require('moment')
const debug = _debug('app:server:shared::dateHelper')

export const convertDateFormat = ( date ) => {
  if (date == null || date == '0000-00-00') return ''
  // debug(`in convertDateFormat, date ${date}`)
  // date = moment(date)
  date = new Date(date)
  if (date <= new Date('2002') || isNaN(date.getTime())) return ''
  const month = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  return `${date.getFullYear()}-${month}-${day}`
  // return date.format('YYYY-MM-DD');
}