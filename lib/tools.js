const crypto = require('crypto')

function genDataChain(data) {
  return Object.entries(data)
    .map(([key, val]) => `${key}=${val}`)
    .join('&')
}

module.exports = {
  aesEncrypt(data, HashKey, HashIV) {
    const cipher = crypto.createCipheriv('aes256', HashKey, HashIV)
    const encrypted = cipher.update(genDataChain(data), 'utf8', 'hex')
    return encrypted + cipher.final('hex')
  },

  aesDecrypt(aesEncrypted, HashKey, HashIV) {
    const decipher = crypto.createDecipheriv('aes256', HashKey, HashIV)
    decipher.setAutoPadding(false)
    const decrypted = decipher.update(aesEncrypted, 'hex', 'utf8')
    const result = decrypted + decipher.final('utf8')
    return result.replace(/[\x00-\x20]+/g, "")
  },

  shaHash(aesEncrypted, HashKey, HashIV) {
    const hash = crypto.createHash('sha256')
    const data = `HashKey=${HashKey}&${aesEncrypted}&HashIV=${HashIV}`
    return hash.update(data).digest('hex').toUpperCase()
  },
}