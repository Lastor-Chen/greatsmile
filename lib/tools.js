const crypto = require('crypto')

module.exports = {
  /**
   * 製作分頁bar，link href
   */
  genQueryString(query) {
    let queryString = '?'
    if (query.q) {
      queryString += `q=${query.q}&`
    }
    
    if (query.category) {
      queryString += `category=${query.category}&`
    }

    if (query.tag) {
      queryString += `tag=${query.tag}&`
    }

    if (query.sort) {
      queryString += `sort=${query.sort}&order=${query.order}&`
    }

    return queryString
  },

  genDataChain(TradeInfo) {
    return Object.entries(TradeInfo)
      .map(([key, val]) => `${key}=${val}`)
      .join('&')
  },

  aesEncrypt(TradeInfo, HashKey, HashIV) {
    const cipher = crypto.createCipheriv('aes256', HashKey, HashIV)
    const encrypted = cipher.update(genDataChain(TradeInfo), 'utf8', 'hex')
    return encrypted + cipher.final('hex')
  },

  aesDecrypt(encrypted, HashKey, HashIV) {
    const decipher = crypto.createDecipheriv('aes256', HashKey, HashIV)
    decipher.setAutoPadding(false)
    const decrypted = decipher.update(encrypted, 'hex', 'utf8')
    const result = decrypted + decipher.final('utf8')
    return result.replace(/[\x00-\x20]+/g, "")
  },

  shaHash(TradeInfo, HashKey, HashIV) {
    const hash = crypto.createHash('sha256')
    const data = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`
    return hash.update(data).digest('hex').toUpperCase()
  }
}