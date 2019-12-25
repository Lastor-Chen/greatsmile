module.exports = {
  /**
   * 製作分頁bar，link href
   */
  genQueryString: (query) => {
    let queryString = '?'
    if (query.q) {
      queryString += `q=${query.q}&`
    } 

    if (query.sort) {
      queryString += `sort=${query.sort}&order=${query.order}&`
    }

    return queryString
  }
}