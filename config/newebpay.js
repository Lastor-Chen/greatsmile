require('dotenv').config()
const { aesEncrypt, shaHash } = require('../lib/tools.js')

// 藍新金流設定
const host = process.env.HOST_URL
const MerchantID = process.env.MERCHANT_ID
const HashKey = process.env.HASH_KEY
const HashIV = process.env.HASH_IV
const PayGateWay = "https://ccore.newebpay.com/MPG/mpg_gateway"
const ReturnURL = `${host}/newebpay/callback?from=ReturnURL`
const NotifyURL = `${host}/newebpay/callback?from=NotifyURL`
const ClientBackURL = `${host}/orders`

function getTradeInfo(amount, desc, email) {
  data = {
    'MerchantID': MerchantID,         // 商店代號
    'RespondType': 'JSON',            // 回傳格式
    'TimeStamp': Date.now(),          // 時間戳記
    'Version': 1.5,                   // 串接程式版本
    'MerchantOrderNo': Date.now(),    // 商店訂單編號
    'LoginType': 0,                   // 智付通會員
    'OrderComment': 'OrderComment',   // 商店備註
    'Amt': amount,                    // 訂單金額
    'ItemDesc': desc,                 // 產品名稱
    'Email': email,                   // 付款人電子信箱
    'ReturnURL': ReturnURL,           // 支付完成返回商店網址
    'NotifyURL': NotifyURL,           // 支付通知網址/每期授權結果通知
    'ClientBackURL': ClientBackURL    // 支付取消返回商店網址
  }

  console.log('data')
  console.log(data)

  const TradeInfo = aesEncrypt(data, HashKey, HashIV)
  const TradeSha = shaHash(TradeInfo, HashKey, HashIV)

  tradeInfo = {
    'MerchantID': MerchantID,    // 商店代號
    'TradeInfo': TradeInfo,      // 加密後參數
    'TradeSha': TradeSha,
    'Version': 1.5,              // 串接程式版本
    'PayGateWay': PayGateWay,
    'MerchantOrderNo': data.MerchantOrderNo,
  }

  console.log('tradeInfo')
  console.log(tradeInfo)

  return tradeInfo
}

module.exports = getTradeInfo