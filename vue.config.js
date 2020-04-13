const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    //打包路径
    outputDir: '../eleme_server/public',
    //代理服务器
    devServer: {
        proxy: process.env.VUE_APP_PROXY,
    },
    //路径别名
    chainWebpack: (config) => {
        config.resolve.alias
        .set('src', resolve('./src'))
        .set('components', resolve('./src/components'))
        .set('assets', resolve('./src/assets'))
    },
    //webpack配置
    configureWebpack: config => {

    }
}