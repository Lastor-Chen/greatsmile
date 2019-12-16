const router = require('express').Router()

// route base '/users'
router.get('/', (req, res) => {
  res.send('users page')
})

module.exports = router
