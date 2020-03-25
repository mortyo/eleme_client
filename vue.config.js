const path = require('path');
function resolve(dir){
    return path.join(__dirname,dir)
}

module.exports={
    devServer: {
        proxy: 'https://elm.cangdu.org/'
    },
    runtimeCompiler: true,
    chainWebpack:(config)=>{
        config.resolve.alias
        .set('src',resolve('./src'))
        .set('components',resolve('./src/components'))
        .set('assets',resolve('./src/assets'))
    }
}