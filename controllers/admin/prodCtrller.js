const db = require('../../models')
const { Product, Category, Series, Image, Tag, TagItem } = db
const moment = require('moment')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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

      const input = req.flash('input')
      let product = {}
      if (input.length > 0) {
        product = input[0]
      }

      res.render('admin/new', { categories, series, tag, product })

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
      product.destroy()
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
        tagArray.forEach(tagId => {
          const tagItem = {
            tag_id: Number(tagId),
            product_id: newProduct.id
          }
          TagItem.create(tagItem)
        })
       }

      //寫入Image
      if (files) {
        imgur.setClientId(IMGUR_CLIENT_ID)
        const mainImg = {
          url: (await imgur.uploadFile(files[0].path)).data.link,
          ProductId: newProduct.id,
          isMain: true
        }
        await Image.create(mainImg)

        //移除第一筆後全寫入
        files.shift()
        for (const file of files) {
          imgur.setClientId(IMGUR_CLIENT_ID)
          const img = {
            url: (await imgur.uploadFile(file.path)).data.link,
            ProductId: newProduct.id,
            isMain: false
          }
          Image.create(img)
        }
      }
      res.redirect('/admin/products')
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
        images
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
        tagArray.forEach(tagId => {
          const tagItem = {
            tag_id: +tagId,
            product_id: id
          }
          TagItem.create(tagItem)
        })
      }

      //新增Image
      const { files } = req
      if (files) {
        for (const file of files) {
          imgur.setClientId(IMGUR_CLIENT_ID)
          const img = {
            url: (await imgur.uploadFile(file.path)).data.link,
            ProductId: id,
            isMain: false
          }
          Image.create(img)
        }
      }

      //修改mainImg
      if (input.mainImg) {
        const mainImgId = input.mainImg
        const images = await Image.findAll({
          where: { product_id: id }
        })

        for (const image of images) {
          await image.update({
            isMain: false
          }).then(function () { })
        }

        const mainImg = await Image.findByPk(mainImgId)
        await mainImg.update({ isMain: true })
      }
      res.redirect('/admin/products')
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
      res.redirect(redirectUrl)

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },
}
