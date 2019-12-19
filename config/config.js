if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

module.exports = {
  "development": {
    "username": process.env.MYSQL_USER,
    "password": process.env.MYSQL_KEY,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST,
    "dialect": "mysql",
    "define": {
      "underscored": true
    },
    "logging": false
  },
  "test": {
    "username": process.env.MYSQL_USER,
    "password": process.env.MYSQL_KEY,
    "database": process.env.MYSQL_DATABASE_TEST,
    "host": process.env.MYSQL_HOST,
    "dialect": "mysql",
    "define": {
      "underscored": true
    },
    "logging": false
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "define": {
      "underscored": true
    },
    "logging": false
  }
}
