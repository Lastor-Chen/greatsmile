const Op = require('sequelize').Op
const moment = require('moment')
moment.locale('zh-tw')

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

  setWhere(req, where) {
    // 製作 category where
    let categoryQuery = +req.query.category || 0
    if (categoryQuery) { where.CategoryId = categoryQuery }

    // 製作 search where (商品名 or 作品名)
    const searchQuery = req.query.q
    if (searchQuery !== undefined) {
      where[Op.and].push({ 
        [Op.or]: {
          name: { [Op.like]: `%${searchQuery}%` },
          '$Series.name$': { [Op.like]: `%${searchQuery}%` }
        }
      }) 
      categoryQuery = null  // 搜尋時，關閉分類 active 特效
    }

    // 製作 tag where (tagQuery 非數字者為特規)
    let tagQuery = req.query.tag || 'all'
    if (!isNaN(tagQuery)) { tagQuery = +tagQuery }
    if (tagQuery === 'gift') { where['$Gifts.id$'] = { [Op.not]: null } }
    if (tagQuery === 'preOrder') { delete where[Op.and][0][Op.or].saleDate }
    if (tagQuery === 'available') { delete where[Op.and][0][Op.or].deadline }

    if (tagQuery === 'soon') {
      // 從 Date.now 往後取 7 天快截止的商品
      const now = new Date()
      const end = moment().add(7, 'days').endOf('day')

      where.deadline = { [Op.between]: [now, end] }
    }

    return { categoryQuery, searchQuery, tagQuery }
  },

  getPagination(products, PAGE_LIMIT, page) {
    const totalPages = Math.ceil(products.length / PAGE_LIMIT)
    const pagesArray = Array.from({ length: totalPages }, (val, index) => index + 1)
    const prev = (page === 1) ? 1 : page - 1
    const next = (page === totalPages) ? totalPages : page + 1

    return { pagesArray, prev, next }
  },

  getBread(categoryQuery, req, res) {
    if (categoryQuery) {
      const categories = res.locals.categoryBar
      const category = categories.find(cate => cate.id === categoryQuery)
      return category.name
    }

    if (req.path.includes('search')) return '搜尋結果'
  },
}