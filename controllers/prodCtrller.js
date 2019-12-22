const db = require('../models')
const Product = db.Product

const moment = require('moment')
moment.locale('zh-tw')

module.exports = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll({
        include: ['Images', 'Gifts'],
        where: { status: 1 }
      })

      const today = new Date()
      products.forEach(product => {
        product.mainImg = product.Images.find(img => img.isMain).url
        product.priceFormat = product.price.toLocaleString()
        product.isPreorder = moment(today).isBefore(product.deadline)
        product.isGift = product.Gifts.length > 0 ? true : false
        product.hasInv = (product.inventory !== 0)
      })

      // select 排序
      const sort = req.query.sort
      const order = req.query.order
      const showProducts = products.sort((a, b) => {
        if (order === 'asc') {      // 升冪排列，價格低至高
          return a[sort] - b[sort]
        }
        return b[sort] - a[sort]
      })

      const selectSort = order ? `sort=${sort}&order=${order}` : `sort=${sort}`
      return res.render('products', { showProducts, selectSort, css: 'products' })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(+req.params.id, { 
        include: ['Gifts', 'Images', 'tags', 'Series'] 
      })

      // 頁面所需 data
      product.mainImg = product.Images.find(img => img.isMain).url
      product.priceFormat = product.price.toLocaleString()
      product.saleDateFormat = moment(product.saleDate).format('YYYY年MM月')
      product.releaseDateFormat = moment(product.releaseDate).format('YYYY年MM月DD日(dd)')
      product.deadlineFormat = moment(product.deadline).format('YYYY年MM月DD日(dd)')
      product.hasGift = (product.Gifts.length !== 0) ? true : false
      product.isOnSale = moment(new Date).isAfter(product.deadline)
      product.hasInv = (product.inventory !== 0)

      res.render('product', { css: 'product', product })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}