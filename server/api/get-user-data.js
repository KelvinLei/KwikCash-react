import { getUserData } from './database-proxy'
import _debug from 'debug'

const debug = _debug('app:server:api:get-user-data')

export async function getUserDataAsync(userId) {
  try {
    return await getUserData(userId)
  } catch(e) {
    throw new Error('invalid user');
  }
}

