import rand from 'locutus/php/math/mt_rand'
import sha1 from 'locutus/php/strings/sha1'
import pack from 'locutus/php/misc/pack'
import { getUser } from './database-proxy'
import _debug from 'debug'
import config from '../../config'
import { salted_compare } from '../shared/password'

const debug = _debug('app:server:api:authenticate')

export async function authenticateUser(userName, password) {
  try {
    var user = await getUser(userName)
    debug(user);
    var isValidPassword = user.encryptedPassword && user.encryptedPassword.length && salted_compare(password, user.encryptedPassword)
    if (config.disableAuth) {
      isValidPassword = true;
    }
    return {
      id: user.id,
      username: user.userId,
      isValidPassword: isValidPassword,
      name: user.name,
    }
  } catch(e) {
    throw new Error('invalid user');
  }
}

