import {getStore} from '../config/mUtils'
import axios from 'axios'

/**
 * 1-获取首页默认地址
 */

export const cityGuess = () => axios.get('https://elm.cangdu.org/v1/cities', {
	params: {
		type: 'guess'
	}
});


/**
 * 2-获取当前所在城市
 */

export const currentcity = number => axios.get('/v1/cities/'+number)


/**
 * 3-获取搜索地址
 */

export const searchplace = (city_id, keyword) => axios.get('/v1/pois', {
	params: {
		type: 'search',
		city_id,
		keyword
	}
});


/**
 * 4-获取msite页面地址信息
 */

export const msiteAddress = geohash => axios.get('/v2/pois/' + geohash);


/**
 * 5-获取msite页面食品分类列表
 */

export const msiteFoodTypes = () => axios.get('/v2/index_entry');


/**
 * 6-获取msite商铺列表
 */

export const shopList = (latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', delivery_mode = '', support_ids = []) => {
	let supportStr = '';
	support_ids.forEach(item => {
		if (item.status) {
			supportStr += '&support_ids[]=' + item.id;
		}
	});
	let data = {
		latitude,
		longitude,
		offset,
		limit: '20',
		'extras[]': 'activities',
		keyword: '',
		restaurant_category_id,
		'restaurant_category_ids[]': restaurant_category_ids,
		order_by,
		'delivery_mode[]': delivery_mode + supportStr
	};
	return axios.get('/shopping/restaurants', {
		params: data
	});
};


/**
 * 7-获取search页面搜索结果
 */

export const searchRestaurant = (geohash, keyword) => axios.get('/v4/restaurants', {
	params: {
		'extras[]': 'restaurant_activity',
		geohash,
		keyword,
		type: 'search'
	}
});


/**
 * 8-获取food页面的 category 种类列表
 */

export const foodCategory = (latitude, longitude) => axios.get('/shopping/v2/restaurant/category', {
	params: {
		latitude,
		longitude
	}
});


/**
 * 9-获取food页面的配送方式
 */

export const foodDelivery = (latitude, longitude) => axios.get('/shopping/v1/restaurants/delivery_modes', {
	params: {
		latitude,
		longitude,
		kw: ''
	}
});


/**
 * 10-获取food页面的商家属性活动列表
 */

export const foodActivity = (latitude, longitude) => axios.get('/shopping/v1/restaurants/activity_attributes', {
	params: {
		latitude,
		longitude,
		kw: ''
	}
});


/**
 * 11-获取shop页面商铺详情
 */

export const shopDetails = (shopid, latitude, longitude) => axios.get('/shopping/restaurant/' + shopid, {
	params: {
		latitude,
		longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
	}	
});



/**
 * 12-获取shop页面菜单列表
 */

export const foodMenu = restaurant_id => axios.get('/shopping/v2/menu', {
	params: {
		restaurant_id
	}
});


/**
 * 13-获取商铺评价列表
 */

export const getRatingList = (shopid, offset, tag_name = '') => axios.get('/ugc/v2/restaurants/' + shopid + '/ratings', {
	params: {
		has_content: true,
		offset,
		limit: 10,
		tag_name
	}
});


/**
 * 14-获取商铺评价分数
 */

export const ratingScores = shopid => axios.get('/ugc/v2/restaurants/' + shopid + '/ratings/scores');


/**
 * 15-获取商铺评价分类
 */

export const ratingTags = shopid => axios.get('/ugc/v2/restaurants/' + shopid + '/ratings/tags');


/**
 * 16-获取图片验证码
 */

export const getcaptchas = () => axios.post('/v1/captchas');



/**
 * 17-确认订单
 */

export const checkout = (geohash, entities, shopid) => axios.post('/v1/carts/checkout', {
	come_from: "web",
	geohash,
	entities,
	restaurant_id: shopid,
});


/**
 * 18-获取快速备注列表
 */

export const getRemark = (id, sig) => axios.get('/v1/carts/' + id + '/remarks', {
	params: {
		sig
	}
});


/**
 * 19-获取地址列表
 */

// export const getAddress = (id, sig) => axios.get('/v1/carts/' + id + '/addresses', {
// 	params: {
// 		sig
// 	}
// });


/**
 * 20-搜索地址
 */

export const searchNearby = keyword => axios.get('/v1/pois', {
	params: {
		type: 'nearby',
		keyword
	}
});


/**
 * 21-添加地址-post
 */

export const postAddAddress = (userId, address, address_detail, geohash, name, phone, phone_bk, poi_type, sex, tag, tag_type) => axios.post('/v1/users/' + userId + '/addresses', {
		address,
		address_detail,
		geohash,
		name,
		phone,
		phone_bk,
		poi_type,
		sex,
		tag,
		tag_type,
});


/**
 * 22-下订单-post
 */

export const placeOrders = (user_id, cart_id, address_id, description, entities, geohash, sig) => axios.post('/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
	address_id,
	come_from: "mobile_web",
	deliver_time: "",
	description,
	entities,
	geohash,
	paymethod_id: 1,
	sig,
});


/**
 * 23-重新发送订单验证码-post
 */

export const rePostVerify = (cart_id, sig, type) => axios.post('/v1/carts/' + cart_id + '/verify_code', {
	sig,
	type,
});



/**
 * 24-下订单-post
 */

export const validateOrders = ({
	user_id,
	cart_id,
	address_id,
	description,
	entities,
	geohash,
	sig,
	validation_code,
	validation_token
}) => axios.post('/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
	address_id,
	come_from: "mobile_web",
	deliver_time: "",
	description,
	entities,
	geohash,
	paymethod_id: 1,
	sig,
	validation_code,
	validation_token,
});


/**
 * 25-重新发送订单验证码
 */

export const payRequest = (merchantOrderNo, userId) => axios.get('/payapi/payment/queryOrder', {
	params:{
		merchantId: 5,
		merchantOrderNo,
		source: 'MOBILE_WAP',
		userId,
		version: '1.0.0',
	}
});



/**
 * 26-获取服务中心信息
 */

export const getService = () => axios.get('/v3/profile/explain');



/**
* 27-兑换会员卡-post
*/

export const vipCart = (id, number, password) => axios.post('/member/v1/users/' + id + '/delivery_card/physical_card/bind',{
	number,
	password
})



/**
 * 28-获取红包
*/

export const getHongbaoNum = id => axios.get('/promotion/v2/users/' + id + '/hongbaos?limit=20&offset=0');



/**
 * 29-获取过期红包
*/


export const getExpired = id => axios.get('/promotion/v2/users/' + id + '/expired_hongbaos?limit=20&offset=0');


/**
 * 30-兑换红包-post
*/

export const exChangeHongbao = (id, exchange_code, captcha_code) => axios.post('/v1/users/' + id + '/hongbao/exchange',{
	exchange_code,
	captcha_code,
});


/**
 * 31-获取用户信息
 */

export const getUser = () => axios.get('/v1/user', {
	params: {
		user_id: getStore('user_id')
	}
});


/**
 * 32-获取订单列表
 */

export const getOrderList = (user_id, offset) => axios.get('/bos/v2/users/' + user_id + '/orders', {
	params: {
		limit: 10,
		offset:offset,
	}
});


/**
 * 33-获取订单详情
 */

export const getOrderDetail = (user_id, orderid) => axios.get('/bos/v1/users/' + user_id + '/orders/' + orderid + '/snapshot');


/**
*34-个人中心里编辑地址
*/

export const getAddressList = (user_id) => axios.get('/v1/users/'+user_id+'/addresses')

/**
*35-个人中心里搜索地址
*/

export const getSearchAddress = (keyword) => fetch('v1/pois',{
	keyword:keyword,
	type:'nearby'
})

/**
* 36-删除地址
*/

export const deleteAddress = (userid, addressid) => axios.get( '/v1/users/' + userid + '/addresses/' + addressid, {}, 'DELETE')



/**
 * 37-账号密码登录
 */

export const accountLogin = (username, password, captcha_code) => axios.post('/v2/login', {
	username:username,
	password:password, 
	captcha_code:captcha_code
});


/**
 * 38-退出登录
 */

export const signout = () => axios.get('/v2/signout');


/**
 * 39-改密码
 */
export const changePassword = (username, oldpassWord, newpassword, confirmpassword, captcha_code) => fetch('/v2/changepassword', {username, oldpassWord, newpassword, confirmpassword, captcha_code}, 'POST');
