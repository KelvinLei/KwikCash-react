var CryptoJS = require("crypto-js");

// TODO: figure out where to store these credentials
const DB_KEY = "fc44pxr47u2gyhuyogmbtymv5fqu3i07"
const DB_IV = "5rhuwtfb6sr2t250"

export const decrypt = (text) => {
  var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(text)});
  var decrypted = CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Utf8.parse(DB_KEY), { iv: CryptoJS.enc.Utf8.parse(DB_IV) });
  return decrypted.toString(CryptoJS.enc.Utf8)
}