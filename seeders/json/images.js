function genImgSeed(productId, imgs) {
  return imgs.map((img, index) => ({
    url: img,
    product_id: productId,
    is_main: index === 0 ? 1 : 0
  }))
}

const seed = []

// 雷姆 萬聖節Ver.
seed.push(...genImgSeed(101, [
  'https://i.imgur.com/Wxd4r6G.jpg',
  'https://i.imgur.com/IXu8WQL.jpg',
  'https://i.imgur.com/3i1owFq.jpg',
  'https://i.imgur.com/nGEGmFg.jpg',
  'https://i.imgur.com/lsNI1ge.jpg',
  'https://i.imgur.com/9qpE3Lk.jpg',
  'https://i.imgur.com/IpxPRyD.jpg',
  'https://i.imgur.com/93LMG68.jpg',
  'https://i.imgur.com/maJdKCt.jpg',
  'https://i.imgur.com/7nFWeJJ.jpg'
]))

// 寶多六花 ～I believe in future～
seed.push(...genImgSeed(102, [
  'https://i.imgur.com/QkKeb5i.jpg',
  'https://i.imgur.com/DoEGJDM.jpg',
  'https://i.imgur.com/Sj7Lglh.jpg',
  'https://i.imgur.com/trvVpzX.jpg',
  'https://i.imgur.com/lMj8ybK.jpg',
  'https://i.imgur.com/ERHCuv4.jpg',
  'https://i.imgur.com/ixHE55x.jpg'
]))

// 黏土人 竈門炭治郎
seed.push(...genImgSeed(103, [
  "https://i.imgur.com/ozkd3K9.jpg",
  "https://i.imgur.com/Loog0Bt.jpg",
  "https://i.imgur.com/z2FRFNY.jpg",
  "https://i.imgur.com/G72eqlk.jpg",
  "https://i.imgur.com/3wHiiFo.jpg",
  "https://i.imgur.com/u2aMSt9.jpg"
]))

// 黏土人 竈門禰豆子
seed.push(...genImgSeed(104, [
  'https://i.imgur.com/W5L8yff.jpg',
  'https://i.imgur.com/ftZ9Q5g.jpg',
  'https://i.imgur.com/HHQL34d.jpg',
  'https://i.imgur.com/H2YthrT.jpg',
  'https://i.imgur.com/kgSC2Hv.jpg',
  'https://i.imgur.com/Wf6D9H3.jpg',
  'https://i.imgur.com/WyGO4oH.jpg'
]))

// 奈奈祈
seed.push(...genImgSeed(105, [
  'https://i.imgur.com/GcxJ6Fr.jpg',
  'https://i.imgur.com/N5bEyCn.jpg',
  'https://i.imgur.com/W6otWjf.jpg',
  'https://i.imgur.com/hQKDmI2.jpg',
  'https://i.imgur.com/SEcG4rY.jpg',
  'https://i.imgur.com/WDmXifo.jpg',
  'https://i.imgur.com/CGA2S4J.jpg',
  'https://i.imgur.com/LoZGYcd.jpg'
]))

// 絆愛
seed.push(...genImgSeed(106, [
  'https://i.imgur.com/ajkFV0G.jpg',
  'https://i.imgur.com/ZoPsNPE.jpg',
  'https://i.imgur.com/GkwdWuR.jpg',
  'https://i.imgur.com/YtEk62y.jpg',
  'https://i.imgur.com/aWGnNUa.jpg',
  'https://i.imgur.com/eZR2c4m.jpg',
  'https://i.imgur.com/QDYHI1U.jpg'
]))

// figma 阿克婭
seed.push(...genImgSeed(107, [
  'https://i.imgur.com/Xzxi3zH.jpg',
  'https://i.imgur.com/E4oFJAa.jpg',
  'https://i.imgur.com/DJy1iLQ.jpg',
  'https://i.imgur.com/eYOtp17.jpg',
  'https://i.imgur.com/JysT9ua.jpg',
  'https://i.imgur.com/NBM0LSv.jpg',
  'https://i.imgur.com/vHbNJhK.jpg',
  'https://i.imgur.com/qhHZLNk.jpg'
]))

// 大和
seed.push(...genImgSeed(108, [
  'https://i.imgur.com/S1KTKVb.jpg',
  'https://i.imgur.com/IbtjSLJ.jpg',
  'https://i.imgur.com/Ma0hNZh.jpg',
  'https://i.imgur.com/HGcbqiZ.jpg'
]))

// 翠星
seed.push(...genImgSeed(109, [
  'https://i.imgur.com/T6SkkN9.jpg',
  'https://i.imgur.com/h2vBysW.jpg',
  'https://i.imgur.com/9o3zpQ5.jpg',
  'https://i.imgur.com/rFyksHI.jpg',
  'https://i.imgur.com/5ISZJzO.jpg',
  'https://i.imgur.com/wnWb3Ty.jpg',
  'https://i.imgur.com/sFnacfk.jpg'
]))

module.exports = seed