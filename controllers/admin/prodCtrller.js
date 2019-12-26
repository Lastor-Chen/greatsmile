const db = require('../../models')
const { Product, Category, Series, Image, Tag, TagItem } = db
const moment = require('moment')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

module.exports = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll({
        order: [['id', 'DESC']],
        include: [Category, Series, Image]
      })


      //判斷日期用
      const today = new Date()

      products.forEach(product => {
        //寫入主商品圖, 若無商品圖則寫入無圖片圖示
        if (product.Images.length != 0) {
          product.mainImg = product.Images.find(img => img.isMain).url
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
      res.render('admin/products', { products, css: 'admin' })
    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  getAddPage: async (req, res) => {
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

    res.render('admin/new', { categories, series, tag, css: 'adminAdd' })
  },

  postDisplay: async (req, res) => {
    try {
      const productId = req.params.id
      const product = await Product.findByPk(productId)
      product.status = true
      product.save().then(function () { })
    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
    res.redirect('/admin/products')
  },

  postUndisplay: async (req, res) => {
    try {
      const productId = req.params.id
      const product = await Product.findByPk(productId)
      product.status = false
      product.save().then(function () { })
    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
    res.redirect('/admin/products')
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id)
      product.destroy()
    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
    res.redirect('/admin/products')
  },

  postNewProduct: async (req, res) => {
    try {
      const input = { ...req.body }

      const product = {
        name: input.name,
        price: input.price,
        inventory: input.inventory,
        slogan: input.slogan,
        description: input.description,
        spec: input.spec,
        copyright: input.copyright,
        maker: input.copyright,
        status: input.status,
        releaseDate: input.releseDate,
        saleDate: input.saleDate,
        deadline: input.deadline,
        SeriesId: Number(input.seriesId),
        CategoryId: Number(input.CategoryId)
      }
      const newProduct = await Product.create(product)

      //寫入TagItem
      const tagArray = input.tag
      tagArray.forEach(tagId => {
        const tagItem = {
          tag_id: Number(tagId),
          product_id: newProduct.id
        }
        TagItem.create(tagItem)
      })

      //寫入Image
      const { files } = req
      if (files) {
        const mainImg = {
          url: (await imgur.uploadFile(files[0].path)).data.link,
          ProductId: newProduct.id,
          isMain: true
        }
        Image.create(mainImg)

        //移除第一筆後全寫入
        files.shift()
        for (const file of files) {
          const img = {
            url: (await imgur.uploadFile(file.path)).data.link,
            ProductId: newProduct.id,
            isMain: false
          }
          Image.create(img)
        }
      }

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
    res.redirect('/admin/products')
  }

}
