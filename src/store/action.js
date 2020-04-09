import {
	getUser,
	getAddressList
} from '../api/getData'
import {
	GET_USERINFO,
	SAVE_ADDRESS
} from './mutation-types.js'

export default {
	//获取用户信息
	async getUserInfo({
		commit,
		state
	}) {
		let res = await getUser();
		commit(GET_USERINFO, res.data)
	},
	//根据state里的userInfo.user_id保存地址
	async saveAddress({
		commit,
		state
	}) {
		if(state.state_Address.length > 0) return;
		let address = await getAddressList(state.userInfo.user_id);
		commit(SAVE_ADDRESS, address);	
	},
}