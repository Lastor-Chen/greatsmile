const db = require('../models')
const { Product } = db

const Op = db.Sequelize.Op
const moment = require('moment')
moment.locale('zh-tw')

const PAGE_LIMIT = 30
const { genQueryString, getOrder, setWhere, getPagination, getBread } = require('../lib/product_tools.js')

module.exports = {
  getProducts: async (req, res) => {
    try {
      // 處理 query data
      const now = new Date()
      const [order, selectedSort] = getOrder(req)
      const { where, categoryQuery, searchQuery, tagQuery } = setWhere(req, now)

      // db Query
      let allProducts = await Product.findAll({
        include: [ 'Images', 'Gifts', 'Series', 'tags' ],
        distinct: true, // 去重顯示正確數量
        where,
        order
      })

      if (!isNaN(tagQuery)) {
        allProducts = allProducts.filter(prod => prod.tags.some(tag => tag.id === tagQuery))
      }

      // 設定分頁偏移
      const page = +req.query.page || 1
      const offset = (page - 1) * PAGE_LIMIT
      const products = allProducts.slice(offset, offset + PAGE_LIMIT)

      // 製作頁面資料
      products.forEach(product => {
        product.mainImg = product.Images.find(img => img.isMain).url
        product.priceFormat = product.price.toLocaleString()
        product.isOnSale = moment(now).isAfter(product.saleDate)
        product.isPreOrder = moment(now).isBefore(product.deadline)
        product.hasInv = (product.inventory > 0)
      })

      // 製作 pagination bar 資料、超連結位址
      const { pagesArray, prev, next } = getPagination(allProducts, PAGE_LIMIT, page)
      const queryString = genQueryString(req.query)

      // 製作麵包屑
      const bread = getBread(categoryQuery, req, res) || '製品一覽'

      res.render('products', {
        css: 'products', js: 'products', 
        products, bread,
        categoryQuery, searchQuery, tagQuery, selectedSort,
        pagesArray, page, prev, next, queryString
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getProduct: async (req, res) => {
    try {
      const now = new Date()

      // 判斷是否為 preview 頁
      const isPreview = req.path.includes('preview')
      let where = { 'id': +req.params.id }
      if (!isPreview) {
        where = { ...where,
          // 只取營銷中的商品
          'status': true,
          releaseDate: { [Op.lte]: now },
          [Op.or]: { deadline: { [Op.gte]: now }, saleDate: { [Op.lte]: now } }
        }
      }

      // Query 資料庫
      const product = await Product.findOne({ 
        where,
        include: ['Gifts', 'Images', 'tags', 'Series', 'Category'],
        // 使 Images 第一張為 mainImg，之後依上傳順排序
        order: [
          ['Images', 'isMain', 'DESC'],
          ['Images', 'id', 'ASC']
        ]
      })

      if (!product) return res.redirect('/products')

      // 頁面所需 data
      product.priceFormat = product.price.toLocaleString()
      product.saleDateFormat = moment(product.saleDate).tz('Asia/Taipei').format('YYYY年MM月')
      product.releaseDateFormat = moment(product.releaseDate).tz('Asia/Taipei').format('YYYY年MM月DD日(dd)')
      product.deadlineFormat = moment(product.deadline).tz('Asia/Taipei').format('YYYY年MM月DD日(dd)')
      product.hasIcon = (product.Gifts.length || product.tags.length)
      product.isOnSale = moment(now).isAfter(product.saleDate)
      product.isPreOrder = moment(now).isBefore(product.deadline)
      product.hasInv = (product.inventory > 0)
      product.category = product.Category.name

      res.render('product', { 
        layout: 'main', css: 'product', js: 'product',
        useSlick: true, useLightbox: true,
        product
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}