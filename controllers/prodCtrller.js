const db = require('../models')
const { Product, Image, Gift, Category } = db

const Op = require('sequelize').Op
const moment = require('moment')
moment.locale('zh-tw')

const pageLimit = 30
const { genQueryString } = require('../lib/tools.js')

function setWhere(req, where) {
  // 製作 category where
  let categoryQuery = +req.query.category || 0
  if (categoryQuery) { where.CategoryId = categoryQuery }

  // 製作 search where (商品名 or 作品名)
  const searchQuery = req.query.q
  if (searchQuery) {
    where[Op.or] = {
      name: { [Op.like]: `%${searchQuery}%` },
      '$Series.name$': { [Op.like]: `%${searchQuery}%` }
    }

    categoryQuery = null  // 搜尋時，關閉分類 active 特效
  }

  // 製作 tag where (tagQuery 非數字者為特規)
  let tagQuery = req.query.tag || '所有商品'
  const isNumber = !isNaN(tagQuery)
  if (isNumber) {
    tagQuery = +tagQuery
    where['$tags.id$'] = tagQuery
  }

  if (tagQuery === '即將截止預購') {
    // 從 Date.now 往後取 7 天快截止的商品
    const date = moment().add(7, 'days').endOf('day')

    where['$tags.id$'] = 1  // 預購中
    where.deadline = { [Op.lte]: date }
  }

  return { categoryQuery, searchQuery, tagQuery }
}

function getPagination(result, pageLimit, page) {
  const totalPages = Math.ceil(result.count / pageLimit)
  const pagesArray = Array.from({ length: totalPages }, (val, index) => index + 1)
  const prev = (page === 1) ? 1 : page - 1
  const next = (page === totalPages) ? totalPages : page + 1

  return { pagesArray, prev, next } 
}

function getBread(categoryQuery, req, res) {
  if (categoryQuery) {
    const categories = res.locals.categoryBar
    const category = categories.find(cate => cate.id === categoryQuery)
    return category.name
  }

  if (req.path.includes('search')) return '搜尋商品'
}

module.exports = {
  getProducts: async (req, res) => {
    try {
      // 排序條件，預設為 ['releaseDate', 'DESC']
      const sort = req.query.sort || 'releaseDate'
      const orderBy = req.query.order || 'DESC'
      const order = [[sort, orderBy]]
      const selectedSort = `${sort},${orderBy}`

      // 製作 db where 物件
      const where = { status: 1 }
      const { categoryQuery, searchQuery, tagQuery } = setWhere(req, where)

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
      const offset = (page - 1) * pageLimit

      // 製作頁面資料
      const today = new Date()
      const products = result.rows
      const getProducts = products.slice(offset, offset + pageLimit)
      getProducts.forEach(product => {
        product.mainImg = product.Images.find(img => img.isMain).url
        product.priceFormat = product.price.toLocaleString()
        product.isPreorder = moment(today).isBefore(product.deadline)
        product.isGift = product.Gifts.length > 0 ? true : false
        product.hasInv = (product.inventory !== 0)
      })

      // 製作 pagination bar 資料、超連結位址
      const { pagesArray, prev, next } = getPagination(result, pageLimit, page)
      const queryString = genQueryString(req.query)

      // 製作麵包屑
      const bread = getBread(categoryQuery, req, res) || '製品一覽'

      res.render('products', {
        js: 'products',
        css: 'products',
        getProducts, selectedSort, searchQuery, bread, pagesArray, queryString, categoryQuery, tagQuery, page, prev, next
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
      product.priceFormat = product.price.toLocaleString()
      product.saleDateFormat = moment(product.saleDate).format('YYYY年MM月')
      product.releaseDateFormat = moment(product.releaseDate).format('YYYY年MM月DD日(dd)')
      product.deadlineFormat = moment(product.deadline).format('YYYY年MM月DD日(dd)')
      product.hasGift = (product.Gifts.length !== 0) ? true : false
      product.isOnSale = moment(new Date).isAfter(product.deadline)
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