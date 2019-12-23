const db = require('../models')
const Product = db.Product

const moment = require('moment')
moment.locale('zh-tw')

module.exports = {
  getProducts: async (req, res) => {
    try {
      // 排序條件
      const sort = req.query.sort
      const foo = req.query.order ? req.query.order : 'DESC'
      const order = sort ? [[sort, foo]] : [['releaseDate', foo]]

      // db Query
      const products = await Product.findAll({
        include: ['Images', 'Gifts'],
        where: { status: 1 },
        order
      })

      // 製作頁面資料
      const today = new Date()
      products.forEach(product => {
        product.mainImg = product.Images.find(img => img.isMain).url
        product.priceFormat = product.price.toLocaleString()
        product.isPreorder = moment(today).isBefore(product.deadline)
        product.isGift = product.Gifts.length > 0 ? true : false
        product.hasInv = (product.inventory !== 0)
      })

      const selectSort = sort ? `${sort}${foo}` : 'releaseDate'

      return res.render('products', { products, selectSort, css: 'products' })

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