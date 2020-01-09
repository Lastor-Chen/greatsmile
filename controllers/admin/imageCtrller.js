const db = require('../../models')
const { Image } = db


module.exports = {
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