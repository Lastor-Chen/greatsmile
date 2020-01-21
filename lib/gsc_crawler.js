const puppeteer = require('puppeteer')
const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

async function getImgPath(folderName, productPath) {
  try {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(productPath)


    const imgPaths = await page.evaluate(() => {
      imgPathArray = []
      const thumbImags = document.querySelectorAll('.thumbImag')
      thumbImags.forEach(thumbImg => {
        const path = thumbImg.dataset.primaryimagesrc
        imgPathArray.push(`https://goodsmileshop.com${path}`)
      })
      return imgPathArray
    })

    let imgurPaths = []

    //新增資料夾
    fs.mkdir(`${folderName}`, function (err) { })

    for (let index = 0; index < imgPaths.length; index++) {
      const imgPath = imgPaths[index]
      var imgSource = await page.goto(imgPath)

      //下載圖檔
      fs.writeFile(`./${folderName}/${index}.jpg`, await imgSource.buffer(), function (err) { })
      console.log(`image_${index} download complete`)
      // //上傳到imgur
      const imgurPath = (await imgur.uploadFile(`./${folderName}/${index}.jpg`)).data.link
      imgurPaths.push(imgurPath)

    }
    await browser.close()


    return imgurPaths

  } catch (err) { console.error(err) }
}

getImgPath('資料夾名稱', '商品詳細頁網址')
  .then(paths => {
    console.log(paths)
  })

