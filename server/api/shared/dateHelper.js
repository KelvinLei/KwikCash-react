import _debug from 'debug'
var moment = require('moment')
const debug = _debug('app:server:shared::dateHelper')

export const convertDateFormat = ( date ) => {
  if (date == null) return ''

  date = moment(date)
  if (date <= moment('2002') || !date.isValid()) return ''

  // const month = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)
  // const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()

  return date.format('YYYY-MM-DD'); // `${date.getFullYear()}-${month}-${day}`
}