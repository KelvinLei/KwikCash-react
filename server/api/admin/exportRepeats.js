import { getRepeatLoanCustomers } from './database-proxy'
import _debug from 'debug'

const debug = _debug('app:server:admin:exportRepeats')

export async function getRepeatCustomers() {
  debug(`calling getRepeatCustomers`)
  return await getRepeatLoanCustomers()
}

