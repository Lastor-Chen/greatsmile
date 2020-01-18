const db = require('../../models')
const { Gift, Product } = db

const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

module.exports = {
  getGifts: async (req, res) => {
    try {

      const gifts = await Gift.findAll({
        order: [['id', 'ASC']]
      })
      
      gifts.forEach(gift => {
        if (!gift.image) {
          gift.image = 'https://citainsp.org/wp-content/uploads/2016/01/default.jpg'
        }
      });

      res.render('admin/gifts', { gifts , js:'upload'})
    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  postGift: async (req, res) => {
    try {
      const input = { ...req.body }
      if (input.name.trim() === '') {

        req.flash('error', '特典名稱不能為空白')
        res.redirect('/admin/gifts')

      } else {


      //寫入Image
      const { file } = req
      if (file) {
        input.image = (await imgur.uploadFile(file.path)).data.link
      }
  
      const maxId = await Gift.max('id')
      await Gift.create({ id: maxId + 1, ...input })

      req.flash('success', '新增成功！')
      res.redirect('/admin/gifts')

      }

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  putGift: async (req, res) => {
    try {
      const input = { ...req.body }
      const giftId = +req.params.giftsid
      if (input.name.trim() === '') {
        req.flash('error', '特典名稱不能為空白')
        return res.redirect('back')
      }

      // 處理圖片
      const { file } = req
      if (file) {
        input.image = (await imgur.uploadFile(file.path)).data.link
      }

      // 處理關聯商品
      if (input.ProductId.trim() !== '') {
        const product = await Product.findByPk(input.ProductId, {
          attributes: [ 'id' ],
          include: Gift
        })

        if (!product) {
          req.flash('error', '欲關聯商品不存在！')
          return res.redirect('back')
        }

        const gift = product.Gifts[0]
        if (gift && (gift.id !== giftId)) {
          req.flash('error', `該商品已有特典 id ${gift.id}`)
          return res.redirect('back')
        }
      }

      if (input.ProductId.trim() === '') {
        input.ProductId = null
      }

      await Gift.update(input, { where: { id: giftId } })

      req.flash('success', '更新成功！')
      res.redirect('/admin/gifts')

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  deleteGift: async (req, res) => {
    try {

      const id = +req.params.giftsid
      await Gift.destroy({ where: { id } })

      req.flash('success', '刪除成功！')
      res.redirect('/admin/gifts')

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

}