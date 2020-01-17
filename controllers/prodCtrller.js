const db = require('../models')
const Product = db.Product
const Image = db.Image
const Gift = db.Gift

const Op = require('sequelize').Op
const moment = require('moment')
moment.locale('zh-tw')

const pageLimit = 30
const { genQueryString } = require('../lib/tools.js')

module.exports = {
  getProducts: async (req, res) => {
    try {
      // 排序條件，預設為 ['releaseDate', 'DESC']
      const sort = req.query.sort || 'releaseDate'
      const orderBy = req.query.order || 'DESC'
      const order = [[sort, orderBy]]

      // Category 
      const where = { status: 1 }
      const categoryQuery = req.query.category
      const categoryId = {
        'Figure': 1,
        '豆丁人': 2,
        'Figma': 3,
        '組裝模型(仮)': 4
      }
      if (categoryQuery) {
        where.category_id = categoryId[categoryQuery]
      }

      // search 商品名 or 作品名
      // 組合出 SQL， WHERE 'status' AND ('name' OR 'Series.name')
      const searchQuery = req.query.q
      if (searchQuery) {
        where[Op.or] = {
          name: { [Op.like]: `%${searchQuery}%` },
          '$Series.name$': { [Op.like]: `%${searchQuery}%` }
        } 
      }

      // tag
      const tagQuery = req.query.tag || '所有商品'
      const tagId = {}
      const tagGroup = res.locals.tagGroup
      tagGroup.forEach(item => {
        const key = item.name
        const val = item.id
        tagId[key] = val
      })

      if (tagQuery) {
        if (tagQuery == '即將截止預購') {
          // 取得當地今日 23:99 ，再轉回時間格式
          // 從今天往後取 7 天快截止的商品
          const today = moment().add(7, 'days').endOf('day')
          const todayDate = new Date(today)

          where['$tags.id$'] = 1  // 預購中
          where.deadline = {      
            [Op.lte]: todayDate}

        } else if (tagQuery == '所有商品') {
          // 什麼都不加
        } else {
          where['$tags.id$'] = tagId[tagQuery]
        }
      }

      // 設定分頁偏移
      const page = +req.query.page || 1
      const offset = (page - 1) * pageLimit 

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

      // 製作頁面資料
      const today = new Date()
      const products = result.rows
      const getProducts = products.slice(offset, offset + pageLimit )
      getProducts.forEach(product => {
        product.mainImg = product.Images.find(img => img.isMain).url
        product.priceFormat = product.price.toLocaleString()
        product.isPreorder = moment(today).isBefore(product.deadline)
        product.isGift = product.Gifts.length > 0 ? true : false
        product.hasInv = (product.inventory !== 0)
      })

      // 製作 pagination bar 資料
      const totalPages = Math.ceil(result.count / pageLimit)
      const pagesArray = Array.from({ length: totalPages }, (val, index) => index + 1)
      const prev = (page === 1) ? 1 : page - 1
      const next = (page === totalPages) ? totalPages : page + 1

      // 生成 pagination bar 超連結位址
      const queryString = genQueryString(req.query)

      const selectedSort = `${sort},${orderBy}`
      let bread = '製品一覽'
      if (categoryQuery) {bread = categoryQuery}
      if (req.path.includes('search')) { bread ='搜尋商品'}

      // 當為所有商品頁的 製品一覽 時為 true 
      // search 時，取消分類 active 特效
      let isAllProducts = categoryQuery ? false : true
      if (req.path.includes('search')) {isAllProducts = false}

      res.render('products', { 
        js: 'products',
        css: 'products',
        getProducts, selectedSort, searchQuery, bread, pagesArray, queryString, categoryQuery, tagQuery, page, prev, next, isAllProducts
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