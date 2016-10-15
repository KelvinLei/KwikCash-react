import rand from 'locutus/php/math/mt_rand'
import sha1 from 'locutus/php/strings/sha1'
import pack from 'locutus/php/misc/pack'
import { getUserByName, getUserById } from './database-proxy'
import _debug from 'debug'
import config from '../../config'
import { salted_compare } from '../shared/password'

const debug = _debug('app:server:member:api:authenticate')

const checkValidPassword = ( user, password ) => {
  debug(`checkValidPassword user ${JSON.stringify(user)} password ${password}`);
  return user.encryptedPassword
    && user.encryptedPassword.length
    && salted_compare(password, user.encryptedPassword)
}

export async function authenticateUserByName(userName, password) {
  try {
    var user = await getUserByName(userName)
    debug(`user ${JSON.stringify(user)}`);
    var isValidPassword = checkValidPassword(user, password)
    debug(`isValidPassword ${isValidPassword}`);

    if (config.disableAuth) {
      isValidPassword = true;
    }
    return {
      id: user.id,
      username: user.userId,
      isValidPassword: isValidPassword,
      name: user.name,
    }
  } catch (e) {
    throw new Error('invalid user in authenticateUserByName');
  }
}

export async function authenticateUserById(userId, password) {
  try {
    var user = await getUserById(userId)
    debug(`user ${JSON.stringify(user)}`);

    var isValidPassword = checkValidPassword(user, password)

    if (config.disableAuth) {
      isValidPassword = true;
    }
    return {
      id: user.id,
      username: user.userId,
      isValidPassword: isValidPassword,
      name: user.name,
    }
  } catch (e) {
    throw new Error('invalid user in authenticateUserById');
  }
}
