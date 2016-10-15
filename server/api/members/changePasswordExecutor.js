import { changePasswordQuery } from './database-proxy'
import _debug from 'debug'
import {decrypt} from "../shared/decrypter";
import {authenticateUserById} from "./authenticate";
import {encrypt} from "../shared/decrypter";
import {salted_hash, salted_compare} from "../shared/password";

const debug = _debug('app:server:api:changePassword')

export async function changePassword(userId, currentPassword, newPassword) {
  try {
    const userData = await authenticateUserById(userId, currentPassword)
    // debug(`before calling changePasswordQuery userData ${JSON.stringify(userData)}`)

    if (userData.isValidPassword) {
      const encryptedNewPw = salted_hash(newPassword, null)
      await changePasswordQuery(userId, encryptedNewPw)
    }

    // const isCorrect = salted_compare(newPassword, encryptedNewPw)
    // debug(`encrypted new password ${salted_hash(currentPassword, null)}`)
    // debug(`isCorrect ${isCorrect}`)
    // debug(`after calling changePasswordQuery userData ${JSON.stringify(userData)}`)
    return userData

  } catch (e) {
    throw new Error(`failure in changePassword. Error: 
                      ${e}`);
  }
}

