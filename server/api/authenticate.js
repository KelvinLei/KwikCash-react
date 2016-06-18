import rand from 'locutus/php/math/mt_rand'
import sha1 from 'locutus/php/strings/sha1'
import pack from 'locutus/php/misc/pack'
import { getEncryptedPasswordForUser } from './database-proxy'
import _debug from 'debug'

const debug = _debug('app:server:api:authenticate')

function salted_hash(text, salt, saltLength = 4) {
  if (!salt) {
    var res = "";
    for (var i = 0; i < saltLength; i++) {
      res += pack('s', rand())
    }
    salt = new Buffer(res).toString('base64').substring(0, saltLength);
  }
  return salt + sha1(salt + text)
}

function salted_compare(text, hash, saltLength = 4) {
  return salted_hash(text, hash.substring(0, saltLength)) === hash
}

export function validateUser(userName, password) {
  return getEncryptedPasswordForUser(userName).then((encryptedPassword) => {
    return {
      isValidPassword: encryptedPassword && encryptedPassword.length && salted_compare(password, encryptedPassword)
    };
  });
}

