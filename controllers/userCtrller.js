module.exports = {
  getSignUp: (req, res) => {
    res.send('sign up')
  },

  signUp: (req, res) => {
    res.send('POST sign up')
  },

  getSignIn: (req, res) => {
    res.send('sign in')
  },

  signIn: (req, res) => {
    res.send('POST sign in')
  },

  signOut: (req, res) => {
    res.send('sign out')
  },
}