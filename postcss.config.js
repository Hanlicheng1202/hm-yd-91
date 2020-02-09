module.exports = {
  plugins: {
    'autoprefixer': {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 手机以iphone为主要适配375 取1/10
      propList: ['*']
    }
  }
}
