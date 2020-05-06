<template>
	<div id="app">
		<header>
			<el-menu class="el-menu-demo"  mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
				<el-menu-item index="首页" @click = "gotoAddress({path: '/msite', query: {geohash}})" class="guide_item">首页</el-menu-item>
				<el-menu-item index="搜索" @click = "gotoAddress({path: '/search',query: {geohash}})" class="guide_item">搜索</el-menu-item>
				<el-menu-item index="订单" @click = "gotoAddress('/profile')" class="guide_item">订单</el-menu-item>
				<div id="search"> 
					<el-input class="input" v-model="keyword" placeholder="搜索附近美食..." clearable>
						<el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
					</el-input>
				</div>
				<el-submenu index="个人中心" style="float:right" v-if="userInfo">
					<template slot="title"><el-avatar :src="imgBaseUrl + userInfo.avatar"></el-avatar></template>
					<el-menu-item index="当前用户" @click = "gotoAddress('/profile')">当前用户：{{userInfo.username}}</el-menu-item>
					<el-menu-item index="账号设置" @click = "gotoAddress('/profile/info')">账号设置</el-menu-item>
					<el-menu-item index="退出" @click="showDialog()">退出</el-menu-item>
				</el-submenu>
				<el-menu-item index="登录" style="float:right" v-else>
					<router-link :to="'/login'">
						<span class="head_login">登录 | 注册</span>
					</router-link>
				</el-menu-item>
			</el-menu>
		</header>
		<!-- 退出登录提示框 -->
		<el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center :modal-append-to-body="false">
			<span>确定退出吗？</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="centerDialogVisible = false;logout();" round>确 定</el-button>
				<el-button @click="centerDialogVisible = false" round>取 消</el-button>
			</span>
		</el-dialog>
    	<transition name="router-fade" mode="out-in">
			<router-view></router-view>
		</transition>
    </div>
</template>

<script>
import { getStore } from './config/mUtils';
import { mapState,mapActions,mapMutations } from 'vuex'
// import { imgBaseUrl } from 'src/config/env'
import { removeStore } from 'src/config/mUtils'
import { signout } from 'src/api/getData'
export default {
	data(){
		return{
			avatar: '',
			keyword: '', //搜索关键字
			// search_show: false,  //是否显示搜索框
			imgBaseUrl:'/img/',
			centerDialogVisible: false
		}
	},
	computed: {
		...mapState([
			'userInfo',
			'geohash'
		]),
	},
	async mounted(){
		if(getStore('user_id')) {
			//获取用户信息
			await this.getUserInfo();
			// 根据state.userInfo.user_id获取并保存收货地址到state
			this.saveAddress();
		}
	},
	methods: {
		...mapMutations([
			'OUT_LOGIN'
		]),
		...mapActions([
			'getUserInfo',
			'saveAddress'
		]),
		gotoAddress(path){
			this.$router.push(path).catch(err => {err})
		},
		//搜索
		async search(){
			if(!this.geohash){
				this.$confirm('当前还没有定位，是否去定位再搜？', '提示', {
					confirmButtonText: '去定位',
					cancelButtonText: '算了，先不定',
					type: 'warning'
				}).then(() => {
					this.$router.push('/home')
				}).catch(() => {
					return
				});
			}else if(!this.keyword){
				this.$message.error({message:'请先输入要搜索的内容喔!',showClose: true});
				return
			}
			await this.$router.push({ path: '/search',query: {geohash:this.geohash,keyword:this.keyword}})
			this.keyword = ''
			// this.search_show = false
		},
		showDialog(){
			this.centerDialogVisible = true;
		},
		async logout(){
			this.OUT_LOGIN();
			removeStore('user_id')
			await signout().then(()=>{
				window.location.reload()
			});
		}
	}
}	
</script>

<style lang="scss">
	@import './style/common';
	@import './style/mixin';
	#app {
		font-size: 14px;
		line-height: 1.5;
	}
    .el-menu-demo {
        display: flex;
        justify-content: center;
		#search {
			padding: 10px 24px;
			width: 628px;
			.input {
				width: 500px;
			}
		}
		.head_login{
			@include sc(0.65rem, #fff); //字体大小，颜色
		}
    }
	.router-fade-enter-active, .router-fade-leave-active {
	  	transition: opacity .3s;
	}
	.router-fade-enter, .router-fade-leave-active {
	  	opacity: 0;
	}
</style>
