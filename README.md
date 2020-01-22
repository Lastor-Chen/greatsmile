![image alt](https://github.com/Lastor-Chen/greatsmile/blob/master/public/img/logo.png?raw=true)

Web development final project. A figure Online Shop.

これはWebエンジニアーの学生が開発した卒業制作です。<br>
開発者はアニメファンなので、個人趣味で有名なグッドスマイルの通販サイトを真似しました。<br>
正式の営業など一切しません。

<br>

## Overview
這是 Alpha Camp 全端 Web App 開發課程的學生小組畢業專案。<br>
我們選擇的主題為「網路電商」，限時 4-6 weeks 進行開發製作。

因個人興趣，選擇製作模型電商，並將目標設定為中小型工作室的專屬電商。<br>
希望能縮小規模，專心將電商的核心功能給打造更為精美。

核心開發目標：
1. 前台，商品陳列、搜尋篩選
2. 購物車、信用卡支付系統
3. 後台，商品相關基本的 CRUD 系統
<br>

由於我們並非美術 UI 設計的學生，但又想呈現出我們有基本的前端切板技術。<br>
因此主 UI 設計，選擇直接參考日本知名模型製造商 Good Smile Company 的線上商店。

## Deploy
此專案佈署於 heroku 平台。您可以直接前往，開始瀏覽。<br>
[heroku 傳送門](https://greatsmile.herokuapp.com/products) <br>

ps. 有透過 Travis 來進行基本的 CI / CD 自動化技術。

## 相關資料
User Story - (準備中) <br>
資料庫ERD - (準備中)

## 主要技術

|  | 後端 | 前端 |
| -------- | -------- | -------- |
| 核心語言   | Node.js     | JavaScrip |
| 框架 | Express.js | Bootstrap  |
| 模板引擎 | Handlebars | |
| 資料庫 | MySQL | Sequelize |
| 單元測試 | Mocha | |

- 此 App 的核心體系為 Node.js + Express.js，以 Node npm 來管理套件。
- 目前並無使用 Vue 之類較完整的前端框架，為純後端生成頁面的 Web App。
- 單元測試部分，並沒完整實作，僅有初步的 model 測試，並把 CI 建起來而以。
- 其他依賴套件請參考專案 [package.json](./package.json)

## Installation & 本機端啟動
如欲在本地端啟動，必須先安裝 [Node.js](https://nodejs.org/en/) 與 [MySQL](https://www.mongodb.com/)。<br>
推薦使用 [nvm](https://github.com/coreybutler/nvm-windows) 來安裝指定版本的 Node.js。
- Node.js v10.16.3
- MySQL v8.0.17

#### 下載專案
請先從 Github clone 本專案:
```
$ git clone https://github.com/Lastor-Chen/greatsmile.git
```

並安裝依賴套件 `$ npm install`

#### 設置 .env file
請參考專案檔案 [.env.example](./.env.example)。
- DB config： MySQL 資料庫個人帳密等訊息
- Imgur： 專案圖床，請輸入個人註冊的 Imgur App ID
- Gmail： 請輸入個人可使用的 Gamil 帳戶，做為通知信發送用
- newebpay： 藍新金流，測試環境 API 之帳戶資訊

※ 藍新金流 API，不支持 localhost 串接。請使用 [ngrok](https://ngrok.com/) 虛擬出一個網域。並將該網域填入 env 的 HOST_URL 條目。

#### 初始化資料庫
安裝資料庫 ORM sequelize，可選擇安裝在 global 或 local:
```
$ npm install [-g] sequelize
```

於 MySQL 建立 database:
```
# SQL
CREATE DATABASE `database_name`;
CREATE DATABASE `database_name_test`;
```

運行 sequelize migration 建立 database tables:
```
$ npx sequelize db:migrate
$ npx sequelize db:migrate --env test
```

登錄 seed 資料:
```
$ npx sequelize db:seed:all
```

完成上述前置作業後，即可於本機端啟動 App:
```
$ npm run dev
```

啟動後，可於任一瀏覽器以 http://localhost:3000 進行瀏覽。<br>
如欲測試線上支付系統，請使用 ngrok 虛擬的網域，替代掉 `localhost:3000`。

## 開發人員
Team 最終溫蒂蕃茄堡
- [Lastor](https://github.com/Lastor-Chen)
- [TomatoSoup](https://github.com/TomatoSoup0126)
- [Wendy](https://github.com/wendyhsiao)