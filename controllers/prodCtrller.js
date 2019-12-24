const db = require('../models')
const Product = db.Product
const Image = db.Image
const Gift = db.Gift
const pageLimit = 10

const Op = require('sequelize').Op
const moment = require('moment')
moment.locale('zh-tw')
const { pageUrl } = require('../lib/showUrl.js')

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

      // 設定分頁偏移
      let offset = 0
      if (req.query.page) {
        offset = (req.query.page - 1) * pageLimit
      }

      // db Query
      const result = await Product.findAndCountAll({
        include: [
          { model: Image,
            separate: true },
          { model: Gift,
            separate: true },
          'Series'],
        distinct: true, // 去重顯示正確數量
        where,
        order,
        offset,
        limit: pageLimit
      })
      
      // 製作頁面資料
      const today = new Date()
      const products = result.rows
      products.forEach(product => {
        product.mainImg = product.Images.find(img => img.isMain).url
        product.priceFormat = product.price.toLocaleString()
        product.isPreorder = moment(today).isBefore(product.deadline)
        product.isGift = product.Gifts.length > 0 ? true : false
        product.hasInv = (product.inventory !== 0)
      })

      // 取得頁數資料
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1

      // 取得分頁連結
      const query = { ...req.query }  // 深拷貝，保護原始資料
      const showUrl = await pageUrl(query)

      const selectedSort = `${sort},${orderBy}`
      const bread = req.path.includes('search') ? '搜尋商品' : '製品一覽'

      res.render('products', { 
        js: 'products',
        css: 'products',
        products, selectedSort, searchQuery, bread, totalPage, showUrl, prev, next
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