
module.exports = {
  isAuth: (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/signin')
    next()
  },

  isAdminAuth: (req, res, next) => {
    // 確認登入狀態
    if (!req.isAuthenticated()) return res.redirect('/signin')

    // 確認用戶權限
    if (!req.user.isAdmin) return res.redirect('/')
    next()
  }
}
