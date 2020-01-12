const db = require('../../models')
const { Gift } = db


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

      res.render('admin/gifts', { gifts })
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

      if (input.name.trim() === '') {

        req.flash('error', '特典名稱不能為空白')
        res.redirect('back')

      } else {

        const id = +req.params.giftsid
        await Gift.update(input, { where: { id } })

        req.flash('success', '更新成功！')
        res.redirect('/admin/gifts')

      }

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  // deleteTag: async (req, res) => {
  //   try {

  //     const id = +req.params.giftsid
  //     await Tag.destroy({ where: { id } })

  //     req.flash('success', '刪除成功！')
  //     res.redirect('/admin/gifts')

  //   } catch (err) {
  //     console.error(err)
  //     res.status(500).json(err.toString())
  //   }
  // },

}