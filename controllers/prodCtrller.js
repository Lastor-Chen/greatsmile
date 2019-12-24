const db = require('../models')
const Product = db.Product

const Op = require('sequelize').Op
const moment = require('moment')
moment.locale('zh-tw')

module.exports = {
  getProducts: async (req, res) => {
    try {
      // 排序條件，預設為 ['releaseDate', 'DESC']
      const sort = req.query.sort || 'releaseDate'
      const orderBy = req.query.order || 'DESC'
      const order = [[sort, orderBy]]

      // search 商品名 or 作品名
      // 組合出 SQL， WHERE 'status' AND ('name' OR 'Series.name')
      const searchQuery = req.query.q
      const where = { status: 1 }
      if (searchQuery) {
        where[Op.or] = {
          name: { [Op.like]: `%${searchQuery}%` },
          '$Series.name$': { [Op.like]: `%${searchQuery}%` }
        } 
      }

      // db Query
      const products = await Product.findAll({
        include: ['Images', 'Gifts', 'Series'],
        where,
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

      const selectedSort = `${sort},${orderBy}`
      const bread = req.path.includes('search') ? '搜尋商品' : '製品一覽'

      res.render('products', { 
        js: 'products',
        css: 'products',
        products, selectedSort, searchQuery, bread
      })

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