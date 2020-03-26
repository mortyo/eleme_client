const path = require('path');
function resolve(dir){
    return path.join(__dirname,dir)
}

module.exports={
    //代理服务器
    devServer: {
        proxy: 'http://elm.cangdu.org'
      },
    //路径别名
    chainWebpack:(config)=>{
        config.resolve.alias
        .set('src',resolve('./src'))
        .set('components',resolve('./src/components'))
        .set('assets',resolve('./src/assets'))
    }
}