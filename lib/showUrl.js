module.exports = {
  // 取得分頁連結
  pageUrl: (query) => {
    const url = []
    if (query.sort) {
      url.push(`sort=${query.sort}&order=${query.order}`)
    }

    let showUrl = url.join('&') + '&'
    if (query.q) {
      return showUrl = `/search?q=${query.q}&` + showUrl
    } else {
      return showUrl = `/products?` + showUrl
    }
  }
}