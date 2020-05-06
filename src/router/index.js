import Vue from 'vue'
import VueRouter from 'vue-router'

const home = r => require.ensure([], () => r(require('../views/home/home')), 'home')
const msite = r => require.ensure([], () => r(require('../views/msite/msite')), 'msite')
const food = r => require.ensure([], () => r(require('../views/food/food')), 'food')
//商店
const shop = r => require.ensure([], () => r(require('../views/shop/shop')), 'shop')
const shopDetail = r => require.ensure([], () => r(require('../views/shop/children/shopDetail')), 'shopDetail')
const shopSafe = r => require.ensure([], () => r(require('../views/shop/children/children/shopSafe')), 'shopSafe')
const foodDetail = r => require.ensure([], () => r(require('../views/shop/children/foodDetail')), 'foodDetail')
//确认订单
const confirmOrder = r => require.ensure([], () => r(require('../views/confirmOrder/confirmOrder')), 'confirmOrder')
const chooseAddress = r => require.ensure([], () => r(require('../views/confirmOrder/children/chooseAddress')), 'chooseAddress')
const addAddress = r => require.ensure([], () => r(require('../views/confirmOrder/children/children/addAddress')), 'addAddress')
const searchAddress = r => require.ensure([], () => r(require('../views/confirmOrder/children/children/children/searchAddress')), 'searchAddress')

const remark = r => require.ensure([], () => r(require('../views/confirmOrder/children/remark')), 'remark')
const invoice = r => require.ensure([], () => r(require('../views/confirmOrder/children/invoice')), 'invoice')
const payment = r => require.ensure([], () => r(require('../views/confirmOrder/children/payment')), 'payment')

//搜索
const search = r => require.ensure([], () => r(require('../views/search/search')), 'search')
//登录
const login = r => require.ensure([], () => r(require('../views/login/login')), 'login')
const forget = r => require.ensure([], () => r(require('../views/forget/forget')), 'forget')
//我的
const profile = r => require.ensure([], () => r(require('../views/profile/profile')), 'profile')
const info = r => require.ensure([], () => r(require('../views/profile/children/info')), 'info')
const orderDetail = r => require.ensure([], () => r(require('../views/profile/children/orderDetail')), 'orderDetail')

const routes = [
    //空路径直接导航到/msite
    {
        path: '/',
        redirect: '/home'
    },
    //首页城市列表页
    {
        path: '/home',
        component: home
    },
    //所有商铺列表页
    {
        path: '/msite',
        component: msite,
        // meta: { keepAlive: true },
    },
    //特色商铺列表页
    {
        path: '/food',
        component: food
    },
    //搜索页
    {
        path: '/search/',
        component: search
    },
    //商铺详情页
    {
        path: '/shop',
        component: shop,
        children: [{
            path: 'foodDetail', //食品详情页
            component: foodDetail,
        }, {
            path: 'shopDetail', //商铺详情页
            component: shopDetail,
            children: [{
                path: 'shopSafe', //商铺安全认证页
                component: shopSafe,
            }, ]
        }]
    },
    //确认订单页
    {
        path: '/confirmOrder',
        component: confirmOrder,
        children: [{
            path: 'chooseAddress',
            component: chooseAddress,
            children: [{
                path: 'addAddress',
                component: addAddress,
                children: [{
                    path: 'searchAddress',
                    component: searchAddress
                }]
            }]
        },{
            path: 'remark', //订单备注
            component: remark,
        }, {
            path: 'invoice', //发票抬头
            component: invoice,
        }, {
            path: 'payment', //付款页面
            component: payment,
        }]
    },
    //登录注册页
    {
        path: '/login',
        component: login,
    },
    //个人信息页
    {
        path: '/profile',
        component: profile,
        children: [{
            path: 'info', //个人信息详情页
            component: info,
        }, {
            path: 'orderDetail', //订单详情页
            component: orderDetail,
        }]
    },
    //修改密码页
    {
        path: '/forget',
        component: forget
    },
]

Vue.use(VueRouter)
const router = new VueRouter({
	routes,
	// mode: 'history',
    strict: process.env.NODE_ENV !== 'production',  //在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到
    // 路选项，滑动行为
	// scrollBehavior (to, from, savedPosition) {
    //     //return 期望滚动到哪个的位置
	//     if (savedPosition) {
	// 	    return { x: 0,y: 0 }  //前进后退时返回顶部
	// 	} else {
	// 		if (from.meta.keepAlive) {
    //             from.meta.savedPosition = document.body.scrollTop;  //Element.scrollTop 属性可以获取或设置一个元素的内容垂直滚动的像素数
	// 		}
	// 	    return { x: 0, y: to.meta.savedPosition || 0 }
    //     }
    // }
    base: '/eleme/'
})

export default router