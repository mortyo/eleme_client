const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    //打包路径
    outputDir: '../eleme_server/public/eleme',
    //代理服务器
    devServer: {
        proxy: 'http://localhost:8001',
    },
    //部署应用包时的基本 URL
    publicPath: process.env.NODE_ENV === 'production'? '/eleme/': '/',
    //路径别名
    chainWebpack: (config) => {
        config.resolve.alias
        .set('src', resolve('./src'))
        .set('components', resolve('./src/components'))
        .set('assets', resolve('./src/assets'))
    },
    //webpack配置
    configureWebpack: config => {
        
    },
}