const db = require('../models')
const { Product, Image, Gift } = db

const Op = require('sequelize').Op
const moment = require('moment')
moment.locale('zh-tw')

const PAGE_LIMIT = 30
const { genQueryString, setWhere, getPagination, getBread } = require('../lib/product_tools.js')

module.exports = {
  getProducts: async (req, res) => {
    try {
      // 排序條件，預設為 ['releaseDate', 'DESC']
      const sort = req.query.sort || 'releaseDate'
      const orderBy = req.query.order || 'DESC'
      const order = [[sort, orderBy]]
      const selectedSort = `${sort},${orderBy}`

      // 製作 db where 物件
      const now = new Date()
      const where = { status: 1,
        [Op.or]: { deadline: { [Op.gte]: now }, saleDate: { [Op.lte]: now } }
      }
      const { categoryQuery, searchQuery, tagQuery } = setWhere(req, where)
      console.log(where)
      // db Query
      const result = await Product.findAndCountAll({
        include: [
          // 設定 separate，使 '$Series.name$' 能工作  (一對多)
          { model: Image, separate: true },
          { model: Gift, separate: true },
          'Series', 'tags'
        ],
        distinct: true, // 去重顯示正確數量
        where,
        order
      })

      // 設定分頁偏移
      const page = +req.query.page || 1
      const offset = (page - 1) * PAGE_LIMIT

      // 製作頁面資料
      const products = result.rows
      const getProducts = products.slice(offset, offset + PAGE_LIMIT)
      getProducts.forEach(product => {
        product.mainImg = product.Images.find(img => img.isMain).url
        product.priceFormat = product.price.toLocaleString()
        product.isOnSale = moment(now).isAfter(product.saleDate)
        product.isPreOrder = moment(now).isBefore(product.deadline)
        product.isGift = product.Gifts.length > 0 ? true : false
        product.hasInv = (product.inventory !== 0)
      })

      // 製作 pagination bar 資料、超連結位址
      const { pagesArray, prev, next } = getPagination(result, PAGE_LIMIT, page)
      const queryString = genQueryString(req.query)

      // 製作麵包屑
      const bread = getBread(categoryQuery, req, res) || '製品一覽'

      res.render('products', {
        css: 'products', js: 'products', 
        getProducts, bread,
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
      const product = await Product.findOne({ 
        // 只取上架中商品
        where: { 'id': +req.params.id, 'status': true },
        include: ['Gifts', 'Images', 'tags', 'Series', 'Category'],
        // 使 Images 第一張為 mainImg，之後依上傳順排序
        order: [
          ['Images', 'isMain', 'DESC'],
          ['Images', 'id', 'ASC']
        ]
      })
      
      if (!product) return res.redirect('/products')

      // 頁面所需 data
      const now = new Date()
      product.priceFormat = product.price.toLocaleString()
      product.saleDateFormat = moment(product.saleDate).format('YYYY年MM月')
      product.releaseDateFormat = moment(product.releaseDate).format('YYYY年MM月DD日(dd)')
      product.deadlineFormat = moment(product.deadline).format('YYYY年MM月DD日(dd)')
      product.hasGift = (product.Gifts.length !== 0) ? true : false
      product.isOnSale = moment(now).isAfter(product.saleDate)
      product.isPreOrder = moment(now).isBefore(product.deadline)
      product.hasInv = (product.inventory !== 0)
      product.category = product.Category.name

      res.render('product', { 
        css: 'product', js: 'product', product,
        useSlick: true, useLightbox: true
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}