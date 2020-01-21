function genImgSeed(productId, imgs) {
  return imgs.map((img, index) => ({
    url: img,
    product_id: productId,
    is_main: index === 0 ? 1 : 0
  }))
}

const seed = []

// 黏土人 竈門炭治郎
seed.push(...genImgSeed(101, [
  "https://lh3.googleusercontent.com/sdEhhph_nkIIigbBOLv7TLK-UAnd641f3t3h6fcg7SZVmeFOHwYP-UBl5OCNcre8xTPE127KCco9wjJWFTKu9_SdWzynGgF1RyX1VJCYeRDZkYC7zZA1_OOSpah7ZVyabxXxHZ2eSyA=w2400",
]))

// 黏土人 竈門禰豆子
seed.push(...genImgSeed(102, [
  "https://lh3.googleusercontent.com/LY7pWJ2JfiwVI6K-qaGAjnJLf53ZAs2pVQgpvxs0FppKhzTRBs_p_-9N16agGT9wVX0IPJ6PJWBxRx1v5btHbdpd8SruQGFBkoU9SPlKoSR5k_IZM1KVk2REKVe1JJLyd93AGyisO34=w2400",
]))

// 黏土人 劉昴星
seed.push(...genImgSeed(103, [
  "https://lh3.googleusercontent.com/dDwOG92o_rCPk_b9-06jXUHiDj4s8z1UuWVfZRiCc7B2dLcDGsAvqXjsX4l6WfY__2ORjJy91jQTcx8MBs6k9y1y-XcVbpSxhqPwdzAek6vaKtK09OMuvLyMVeS3saSYRZ4vJSMkLd4=w2400",
]))

// 黏土人 鋼鐵人 Mark85 終局之戰Ver. DX
seed.push(...genImgSeed(104, [
  "https://lh3.googleusercontent.com/HjYWH6hIAxJ0Z-VS8J5BK1SpnoS4Fh2QCCZkjiVX3cb9rw2G7FsPvTaZsfIS3rJNVq2cPRaU0__DTUVHqijBio1hU_MfOaT2Iy3BgngdeOenWLVbY7MW0cJ9Qvw1jNepIdif3wNARkw=w2400",
]))

// figma 藤丸立香
seed.push(...genImgSeed(105, [
  "https://lh3.googleusercontent.com/9ebaverS7qnoOlRonXqbO74-C26DxE3nO8wm1ZZGLidpI-M5Nj9oPWJauLFiHkyWwUHFNMN5Jd8mY_Cc7RqVjs4w8eOKOP1HNwvA5KBgo_NLt8-fooG8hi3lVJDVaHo-yfTte_gTTuk=w2400",
]))

// MODEROID Shinkalion 500 TYPE EVA
seed.push(...genImgSeed(106, [
  "https://lh3.googleusercontent.com/SSyP1yz5bCQd0ovjSeMHGQxUjFyB8tqqziTiExzFWJqHdB3hEDaXfrWTh38X_FUZtGO2B4uA-Bt0fpeRbYuIgilbrfQ7Cd7Eju2KCym1B5gjcJmhIYHlSWOx1m7vBjGH3tl46oHcprA=w2400",
]))

// 雷姆 萬聖節Ver.
seed.push(...genImgSeed(107, [
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

module.exports = seed