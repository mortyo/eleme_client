import Vue from 'vue'
import VueRouter from 'vue-router'
import {routerMode} from '../config/env'

const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')
const msite = r => require.ensure([], () => r(require('../page/msite/msite')), 'msite')
const food = r => require.ensure([], () => r(require('../page/food/food')), 'food')
const shop = r => require.ensure([], () => r(require('../page/shop/shop')), 'shop')
const shopDetail = r => require.ensure([], () => r(require('../page/shop/children/shopDetail')), 'shopDetail')
const shopSafe = r => require.ensure([], () => r(require('../page/shop/children/children/shopSafe')), 'shopSafe')
const foodDetail = r => require.ensure([], () => r(require('../page/shop/children/foodDetail')), 'foodDetail')
const confirmOrder = r => require.ensure([], () => r(require('../page/confirmOrder/confirmOrder')), 'confirmOrder')
const remark = r => require.ensure([], () => r(require('../page/confirmOrder/children/remark')), 'remark')
const invoice = r => require.ensure([], () => r(require('../page/confirmOrder/children/invoice')), 'invoice')
const payment = r => require.ensure([], () => r(require('../page/confirmOrder/children/payment')), 'payment')
const userValidation = r => require.ensure([], () => r(require('../page/confirmOrder/children/userValidation')), 'userValidation')
//搜索
const search = r => require.ensure([], () => r(require('../page/search/search')), 'search')
//登录
const login = r => require.ensure([], () => r(require('../page/login/login')), 'login')
const forget = r => require.ensure([], () => r(require('../page/forget/forget')), 'forget')
//我的
const profile = r => require.ensure([], () => r(require('../page/profile/profile')), 'profile')
const info = r => require.ensure([], () => r(require('../page/profile/children/info')), 'info')
const orderDetail = r => require.ensure([], () => r(require('../page/profile/children/orderDetail')), 'orderDetail')

const routes = [
    //空路径直接导航到/home
    {
        path: '',
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
        meta: { keepAlive: true },
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
            path: 'remark', //订单备注
            component: remark,
        }, {
            path: 'invoice', //发票抬头
            component: invoice,
        }, {
            path: 'payment', //付款页面
            component: payment,
        }, {
            path: 'userValidation', //用户验证
            component: userValidation,
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
	mode: routerMode,
    strict: process.env.NODE_ENV !== 'production',
    // 路选项，滑动行为
	scrollBehavior (to, from, savedPosition) {
        //return 期望滚动到哪个的位置
	    if (savedPosition) {
		    return { x: 0,y: 0 }  //前进后退时返回顶部
		} else {
			if (from.meta.keepAlive) {
                from.meta.savedPosition = document.body.scrollTop;  //Element.scrollTop 属性可以获取或设置一个元素的内容垂直滚动的像素数
			}
		    return { x: 0, y: to.meta.savedPosition || 0 }
        }
	}
})

export default router