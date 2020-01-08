module.exports = {
  /**
   * 製作分頁bar，link href
   */
  genQueryString: (query) => {
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
  }
}