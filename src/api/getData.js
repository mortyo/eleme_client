import axios from 'axios';
import qs from 'qs';
import { getStore } from '../config/mUtils';

/**
 * 1-获取首页默认地址
 */

export const cityGuess = () => axios.get('https://elm.cangdu.org/v1/cities', {
	params: {
		type: 'guess'
	}
});

/**
 * 3-获取搜索地址
 */

export const searchplace = (city_id, keyword) => axios.get('/v3/pois', {
	params: {
		type: 'search',
		city_id,
		keyword
	}
});


/**
 * 4-获取msite页面地址信息
 */

export const msiteAddress = geohash => axios.get('/v3/pois/' + geohash);


/**
 * 5-获取msite页面食品分类列表
 */

export const msiteFoodTypes = () => axios.get('/v2/index_entry');


/**
 * 6-获取msite商铺列表
 */

export const shopList = (latitude, longitude, offset, restaurant_category_id, order_by, delivery_mode, support_ids) => {
	let data = {
		latitude,
		longitude,
		offset,
		limit: '24',
		restaurant_category_id,
		order_by,
		'delivery_mode[]': delivery_mode,
		support_ids: support_ids,
	};
	return axios.get('/v2/shops', {
		params: data,
		//qs可以改变数组参数格式
		paramsSerializer: params => {
			return qs.stringify(params, { arrayFormat: 'brackets' })
		}
	});
};


/**
 * 7-获取search页面搜索结果
 */

export const searchRestaurant = (geohash, keyword) => axios.get('v2/shops/search', {
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

export const foodCategory = (latitude, longitude) => axios.get('/v2/getCategories', {
	// params: {
	// 	latitude,
	// 	longitude
	// }
});


/**
 * 9-获取food页面的配送方式
 */

export const foodDelivery = (latitude, longitude) => axios.get('/v2/delivery_modes', {
	// params: {
		// latitude,
		// longitude,
		// kw: ''
	// }
});


/**
 * 10-获取food页面的商家属性活动列表
 */

export const foodActivity = (latitude, longitude) => axios.get('/v2/activity_attributes', {
	// params: {
	// 	latitude,
	// 	longitude,
	// 	kw: ''
	// }
});


/**
 * 11-获取shop页面商铺详情
 */

export const shopDetails = (shopid, latitude, longitude) => axios.get('/v2/shop/' + shopid, {
	// params: {
	// 	latitude,
	// 	longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
	// }	
});



/**
 * 12-获取shop页面菜单列表
 */

export const foodMenu = restaurant_id => axios.get('/v2/allMenu', {
	params: {
		restaurant_id
	}
});


/**
 * 13-获取商铺评价列表
 */

export const getRatingList = (shopid, offset, tag_name = '') => axios.get('/v2/Rate/' + shopid + '/ratings', {
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

export const ratingScores = shopid => axios.get('/v2/Rate/' + shopid + '/scores');


/**
 * 15-获取商铺评价分类
 */

export const ratingTags = shopid => axios.get('/v2/Rate/' + shopid + '/tags');


/**
 * 16-获取图片验证码
 */

export const getcaptchas = () => axios.post('/v4/captchas');



/**
 * 17-确认订单
 */

export const checkout = (geohash, entities, shopid) => axios.post('/v2/carts/checkout', {
	come_from: "web",
	geohash,
	entities,
	restaurant_id: shopid,
});


/**
 * 18-获取快速备注列表
 */

export const getRemark = (id, sig) => axios.get('/v2/carts/' + id + '/remarks', {
	params: {
		sig
	}
});


/**
 * 19-获取地址列表
 */

export const getAddress = (id, sig) => axios.get('/v1/users/' + id + '/addresses', {
	// params: {
	// 	sig
	// }
});


/**
 * 20-搜索地址
 */

// export const searchNearby = keyword => axios.get('/v1/pois', {
// 	params: {
// 		type: 'nearby',
// 		keyword
// 	}
// });


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
 * 22-下订单-post,post购物车数据
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

// export const rePostVerify = (cart_id, sig, type) => axios.post('/v1/carts/' + cart_id + '/verify_code', {
// 	sig,
// 	type,
// });



/**
 * 24-下订单-post
 */

// export const validateOrders = ({
// 	user_id,
// 	cart_id,
// 	address_id,
// 	description,
// 	entities,
// 	geohash,
// 	sig,
// 	validation_code,
// 	validation_token
// }) => axios.post('/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
// 	address_id,
// 	come_from: "mobile_web",
// 	deliver_time: "",
// 	description,
// 	entities,
// 	geohash,
// 	paymethod_id: 1,
// 	sig,
// 	validation_code,
// 	validation_token,
// });


/**
 * 25-重新发送订单验证码
 */

export const payRequest = (merchantOrderNo, userId) => axios.get('/v4/payment', {
	// params:{
	// 	merchantId: 5,
	// 	merchantOrderNo,
	// 	source: 'MOBILE_WAP',
	// 	userId,
	// 	version: '1.0.0',
	// }
});



/**
 * 26-获取服务中心信息
 */

// export const getService = () => axios.get('/v4/explain');



/**
* 27-兑换会员卡-post
*/

// export const vipCart = (id, number, password) => axios.post('/member/v1/users/' + id + '/delivery_card/physical_card/bind',{
// 	number,
// 	password
// })



/**
 * 28-获取红包
*/

export const getHongbaoNum = id => axios.get('/v1/users/' + id + '/hongbaos?limit=20&offset=0');



/**
 * 29-获取过期红包
*/


export const getExpired = id => axios.get('/v1/users/' + id + '/expired_hongbaos?limit=20&offset=0');


/**
 * 30-兑换红包-post
*/

export const exChangeHongbao = (id, exchange_code, captcha_code) => axios.post('/v1/users/' + id + '/hongbao_exchange',{
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

export const getOrderList = (user_id, offset) => axios.get('/v1/users/' + user_id + '/orders', {
	params: {
		limit: 5,
		offset:offset,
	}
});


/**
 * 33-获取订单详情
 */

export const getOrderDetail = (user_id, orderid) => axios.get('/v1/users/' + user_id + '/orders/' + orderid + '/snapshot');


/**
*34-个人中心里编辑地址
*/

export const getAddressList = (user_id) => axios.get('/v1/users/'+user_id+'/addresses')

/**
*35-个人中心里搜索地址
*/

// export const getSearchAddress = (keyword) => fetch('v1/pois',{
// 	keyword:keyword,
// 	type:'nearby'
// })

/**
* 36-删除地址
*/

export const deleteAddress = (userid, addressid) => axios.delete( '/v1/users/' + userid + '/addresses/' + addressid)



/**
 * 37-账号密码登录
 */

export const accountLogin = (username, password, captcha_code) => axios.post('/v1/login', {
	username,
	password, 
	captcha_code
});


/**
 * 38-退出登录
 */

export const signout = () => axios.get('/v1/signout');


/**
 * 39-改密码
 */
export const changePassword = (username, oldpassWord, newpassword, confirmpassword, captcha_code) => fetch('/v1/changepassword', {username, oldpassWord, newpassword, confirmpassword, captcha_code}, 'POST');

/**
 *40-改头像
*/
export const changeAvatar = (user_id,data) => fetch('/v1/users/'+user_id+'/avatar',{
	method: 'POST',
	credentials: 'include',
	body: data
})