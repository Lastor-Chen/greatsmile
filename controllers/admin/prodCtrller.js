const db = require('../../models')
const { Product, Category, Series, Image, Tag, TagItem } = db
const moment = require('moment')

const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const {checkProduct} = require('../../lib/checker.js')

module.exports = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll({
        order: [['id', 'DESC']],
        include: [Category, Series, Image, 'tags']
      })

      //判斷日期用
      const today = new Date()

      products.forEach(product => {
        //寫入主商品圖, 若無商品圖則寫入無圖片圖示
        if (product.Images.length != 0) {
          product.mainImg = product.Images.find(img => img.isMain).url
          product.secondImg = product.Images.filter(function (item, index, array) {
            return !item.isMain
          })

        } else {
          product.mainImg = 'https://citainsp.org/wp-content/uploads/2016/01/default.jpg'
        }

        //判斷發售狀態
        if (moment(today).isBefore(product.saleDate)) {
          product.saleStatus = '預約中'
        } else {
          product.saleStatus = '已發售'
        }

        //售價加上dot
        product.price = product.price.toLocaleString()
      })
      res.render('admin/products', { products })
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findOne({
        where: { id: +req.params.id },
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
        css: 'product', js: 'product', layout: 'main',
        useSlick: true, useLightbox: true,
        product
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getAddPage: async (req, res) => {
    try {
      const [categories, series, tag] = await Promise.all([
        Category.findAll({
          order: [['id', 'ASC']],
        }),
        Series.findAll({
          order: [['id', 'ASC']],
        }),
        Tag.findAll({
          order: [['id', 'ASC']],
        })
      ])

      // 表單驗證未過時，取回當前 input 值
      const input = req.flash('input')[0]
      let product = input || {}

      if (product.tag) {
        tag.forEach(tag => {
          const hasTag = input.tag.includes(`${tag.id}`)
          if (hasTag) { tag.checked = true }
        })
      }
      
      res.render('admin/new', { categories, series, tag, product, js: 'admin/product' })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  postDisplay: async (req, res) => {
    try {
      const productId = req.params.id
      const product = await Product.findByPk(productId)
      product.status = true
      await product.save()

      res.redirect('/admin/products')
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  postUndisplay: async (req, res) => {
    try {
      const productId = req.params.id
      const product = await Product.findByPk(productId)
      product.status = false
      await product.save()

      res.redirect('/admin/products')
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id)
      await product.destroy()
      res.redirect('/admin/products')
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  postNewProduct: async (req, res) => {
    try {
      const input = { ...req.body }
      input.SeriesId = +input.SeriesId
      input.CategoryId = +input.CategoryId
      const { files } = req

      // 檢查是否有未填的內容
      const error = checkProduct(input)
      if (error) {
        console.error(error)
        req.flash('error', error)
        req.flash('input', input)
        return res.redirect('/admin/products/new')
      }
      // 檢查至少有一張圖片
      if (!files[0]){
        req.flash('error', '至少上傳一張圖片')
        req.flash('input', input)
        return res.redirect('/admin/products/new')
      }

      const newProduct = await Product.create(input)

      //寫入TagItem
      if (input.tag) {
        const tagArray = input.tag
        tagArray.forEach(async tagId => {
          const tagItem = {
            tag_id: Number(tagId),
            product_id: newProduct.id
          }
          await TagItem.create(tagItem)
        })
       }

      //寫入Image
      if (files) {
        const mainImg = {
          url: (await imgur.uploadFile(files[0].path)).data.link,
          ProductId: newProduct.id,
          isMain: true
        }
        await Image.create(mainImg)

        //移除第一筆後全寫入
        files.shift()
        for (const file of files) {
          const img = {
            url: (await imgur.uploadFile(file.path)).data.link,
            ProductId: newProduct.id,
            isMain: false
          }
          await Image.create(img)
        }
      }

      req.flash('success', '成功建立商品！')
      res.redirect(`/admin/products`)

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getEditPage: async (req, res) => {
    try {
      const id = req.params.id
      let product = await Product.findByPk(id)
      const releaseDate = product.releaseDate.toJSON().split('T')[0]
      const saleDate = product.saleDate.toJSON().split('T')[0]
      const deadline = product.deadline.toJSON().split('T')[0]
      const [categories, series, tag] = await Promise.all([
        Category.findAll({
          order: [['id', 'ASC']],
        }),
        Series.findAll({
          order: [['id', 'ASC']],
        }),
        Tag.findAll({
          order: [['id', 'ASC']],
        })
      ])

      const tagItem = await TagItem.findAll({
        where: { product_id: id }
      })

      tag.forEach(tag => {
        tagItem.forEach(tagItem => {
          if (tag.id === tagItem.tag_id) {
            tag.checked = true
          }
        })
      })

      const images = await Image.findAll({
        where: { product_id: id },
        order: [['id', 'ASC']]
      })

      const input = req.flash('input')
      if (input.length > 0) {      
        product = input[0]
        product.id = +id
      }

      res.render('admin/edit', {
        css: 'edit',
        product,
        categories,
        series,
        tag,
        releaseDate,
        saleDate,
        deadline,
        tagItem,
        images,
        js: 'admin/product'
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  putProduct: async (req, res) => {
    try {
      const id = req.params.id
      const input = { ...req.body }
      const error = checkProduct(input)
      
      if (error) {
        console.error(error)
        req.flash('error', error)
        req.flash('input', input)
        return res.redirect(`/admin/products/${id}/edit`)
      }

      //修改商品資訊
      let product = await Product.findByPk(id)
      await product.update(input)

      //清除舊有TagItem
      await TagItem.destroy({
        where: { product_id: +id }
      })

      //新增TagItem資訊
      if (input.tag) {
        const tagArray = input.tag
        tagArray.forEach(async tagId => {
          const tagItem = {
            tag_id: +tagId,
            product_id: id
          }
          await TagItem.create(tagItem)
        })
      }

      //新增Image
      const { files } = req
      if (files) {
        for (const file of files) {
          const img = {
            url: (await imgur.uploadFile(file.path)).data.link,
            ProductId: id,
            isMain: false
          }
          await Image.create(img)
        }
      }

      //修改mainImg
      if (input.mainImg) {
        // 原 mainImg 改為 false
        const image = await Image.findOne(
          { where: { product_id: id, isMain: true } }
        )
        await image.update({ isMain: false })

        // 指定新 mainImg
        const mainImgId = input.mainImg
        const mainImg = await Image.findByPk(mainImgId)
        await mainImg.update({ isMain: true })
      }
      
      req.flash('success', '成功更新資料！')
      res.redirect(`/admin/products/${id}/edit`)

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  deleteImage: async (req, res) => {
    try {

      const image = await Image.findByPk(req.params.id)
      const redirectUrl = `/admin/products/${image.ProductId}/edit`
      await image.destroy()

      req.flash('success', '圖片刪除成功！')
      res.redirect(redirectUrl)

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },
}
