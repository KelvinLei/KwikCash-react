import { getUserData } from './database-proxy'
import _debug from 'debug'
import {decrypt} from "../shared/decrypter";

const debug = _debug('app:server:api:get-user-data')

export async function getUserDataAsync(userId) {
  try {
    const userData = await getUserData(userId)
    return {
      firstName: userData.firstName,
      lastName: userData.lastName,
      city: decrypt(userData.encryptedCity),
      state: userData.state,
      zip: decrypt(userData.encryptedZip),
      homePhone: decrypt(userData.homePhone),

    }
  } catch(e) {
    throw new Error('invalid user');
  }
}

