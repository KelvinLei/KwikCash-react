import rand from 'locutus/php/math/mt_rand'
import sha1 from 'locutus/php/strings/sha1'
import pack from 'locutus/php/misc/pack'
import _debug from 'debug'

const debug = _debug('app:server:api:shared:password')

export function salted_hash(text, salt, saltLength = 4) {
  if (!salt) {
    var res = "";
    for (var i = 0; i < saltLength; i++) {
      res += pack('s', rand())
    }
    salt = new Buffer(res).toString('base64').substring(0, saltLength);
  }
  return salt + sha1(salt + text)
}

export function salted_compare(text, hash, saltLength = 4) {
  return salted_hash(text, hash.substring(0, saltLength)) === hash
}
