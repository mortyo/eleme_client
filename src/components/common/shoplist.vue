<template>
	<div class="shoplist_container">
		<!-- 如果附近有商家 -->
		<ul v-if="shopListArr.length" class="shop_ul">
			<router-link v-for="item in shopListArr" :key="item.id" :to="{path: 'shop', query:{geohash, id: item.id}}" class="shop_li">
				<img :src="imgBaseUrl + item.image_path" class="shop_img">
				<hgroup class="shop_right">
					<header class="shop_detail_header">
						<h4 :class="item.is_premium? 'premium': ''" class="shop_title">{{item.name}}</h4>
						<ul class="shop_detail_ul">
							<li v-for="item in item.supports" :key="item.id" class="supports">{{item.icon_name}}</li>
						</ul>
					</header>
					<h5 class="rating_order_num">
						<section class="rating_order_num_left">
							<section class="rating_section">
								<el-rate v-model="item.rating" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
							</section>
							<section class="order_section">
								月售{{item.recent_order_num}}单
							</section>
						</section>
						<section class="rating_order_num_right">
							<span class="delivery_style delivery_left" v-if="item.delivery_mode">{{item.delivery_mode.text}}</span>
							<span class="delivery_style delivery_right" v-if="zhunshi(item.supports)">准时达</span>
						</section>
					</h5>
					<h5 class="fee_distance">
						<p class="fee">
							¥{{item.float_minimum_order_amount}}起送
							<span class="segmentation">/</span>
							{{item.piecewise_agent_fee.tips}}
						</p>
						<p class="distance_time">
							<span v-if="Number(item.distance)">{{item.distance > 1000? (item.distance/1000).toFixed(2) + 'km': item.distance + 'm'}}
								<span class="segmentation">/</span>
							</span>
							<span v-else>{{item.distance}}</span>
							<span class="segmentation">/</span>
							<span class="order_time">{{item.order_lead_time}}</span>
						</p>
					</h5>
				</hgroup>
			</router-link>
		</ul>
		<div class="loadMore">
			<el-button type="primary" @click="loadMore">加载更多。。。</el-button>
		</div>
		<!-- 没有更多 -->
		<p v-if="touchend" class="empty_data">没有更多了</p>
		<!-- 加载动画 -->
		<transition name="loading">
			<loading v-show="showLoading"></loading>
		</transition>
	</div>
</template>

<script>

import {mapState} from 'vuex'
import {shopList} from 'src/service/getData'
import {imgBaseUrl} from 'src/config/env'
import loading from './loading'

export default {
	components: {
		loading
	},
	props: [ 'geohash','restaurantCategoryId', 'restaurantCategoryIds', 'sortByType', 'deliveryMode', 'supportIds', 'confirmSelect'],
	data(){
		return {
			shopListArr:[], // 店铺列表数据
			offset: 0, // 批次加载店铺列表，每次加载20个 limit = 20
			preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
			showLoading: true, //显示加载动画
			touchend: false, //没有更多数据
			imgBaseUrl,
		}
	},
	computed: {
		...mapState([
			'latitude','longitude'
		]),
	},
	mounted(){
		this.initData();
	},

	updated(){
		// console.log(this.supportIds, this.sortByType)
	},
	methods: {
		async initData(){
			//获取数据
			shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId).then((res) => {
				this.shopListArr = res.data;
				console.log(this.shopListArr)
				if (res.data.length < 20) {
					this.touchend = true;
				}
				this.hideLoading();
			});
		},
		//到达底部加载更多数据
		async loadMore(){
			if (this.touchend) {
				return
			}
			//防止重复请求
			if (this.preventRepeatReuqest) {
				return
			}
			this.showLoading = true;
			this.preventRepeatReuqest = true;

			//数据的定位加20位
			this.offset += 20;
			let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
			this.hideLoading();
			this.shopListArr = [...this.shopListArr, ...res.data];
			//当获取数据小于20，说明没有更多数据，不需要再次请求数据
			if (res.length < 20) {
				this.touchend = true;
				return
			}
			this.preventRepeatReuqest = false;
		},
		//开发环境与编译环境loading隐藏方式不同
		hideLoading(){
			this.showLoading = false;
		},
		zhunshi(supports){
			let zhunStatus;
			if ((supports instanceof Array) && supports.length) {
 				supports.forEach(item => {
 					if (item.icon_name === '准') {
 						zhunStatus = true;
 					}
 				})
			}else{
				zhunStatus = false;
			}
			return zhunStatus
		},
		//监听父级传来的数据发生变化时，触发此函数重新根据属性值获取数据
		async listenPropChange(){
			this.showLoading = true;
			this.offset = 0;
			let res = await shopList(this.latitude, this.longitude, this.offset, '', this.restaurantCategoryIds, this.sortByType, this.deliveryMode, this.supportIds);
			this.hideLoading();
			//考虑到本地模拟数据是引用类型，所以返回一个新的数组
			this.shopListArr = [...res.data];
		},
	},
	watch: {
		//监听父级传来的restaurantCategoryIds，当值发生变化的时候重新获取餐馆数据，作用于排序和筛选
		restaurantCategoryIds: function (value){
			this.listenPropChange();
		},
		//监听父级传来的排序方式
		sortByType: function (value){
			this.listenPropChange();
		},
		//监听父级的确认按钮是否被点击，并且返回一个自定义事件通知父级，已经接收到数据，此时父级才可以清除已选状态
		confirmSelect: function (value){
			this.listenPropChange();
		}
	}
}
</script>

<style lang="scss" scoped>
	@import 'src/style/mixin';
	.shoplist_container{
		margin: 8px auto 0 auto;
        max-width: 1250px;
		.shop_ul{
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
		}
		.shop_li{
			display: flex;
			width: 400px;
			height: 90px;
			background: #fff;
			border:  #e1e4e8 1px solid;
			margin: 4px;
			border-radius: 5px;
			.shop_img{
				width: 90px;
				width: 90px;
				border-radius: 5px;
			}
			.shop_right{
				margin: 4px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.shop_detail_header{
					display: flex;
					justify-content: space-between;
					.shop_title{
						height: 30px;;
						color: #333;
					}
					.premium::before{
						content: '品牌';
						display: inline-block;
						font-size: 0.5rem;
						line-height: .6rem;
						color: #333;
						background-color: #ffd930;
						padding: 0 0.1rem;
						border-radius: 0.1rem;
						margin-right: 0.2rem;
					}
					.shop_detail_ul{
						display: flex;
						.supports{
							@include sc(1px, #999);
							height:fit-content;
							border: 1px solid #666;
							border-radius: 3px;
							margin: 4px;
							padding: 2px;
						}
					}
				}
				.rating_order_num{
					height: 30px;
					.rating_order_num_left{
						@include fj(flex-start);
						.rating_section{
							width: 100%;
						}
						.order_section{
							transform: scale(1.2);
							@include sc(0.4rem, #666);
						}
					}
					.rating_order_num_right{
						display: flex;
						align-items: center;
						transform: scale(0.9);
						min-width: 5rem;
						justify-content: flex-end;
						margin-right: -0.4rem;
						.delivery_style{
							font-size: 0.4rem;
							padding: 0.04rem 0.08rem 0;
							border-radius: 0.08rem;
							margin-left: 0.08rem;
							border: 1px;
						}
						.delivery_left{
							color: #fff;
							background-color: $blue;
							border: 0.025rem solid $blue;
						}
						.delivery_right{
							color: $blue;
							border: 0.025rem solid $blue;
						}
					}
				}
				.fee_distance{
					margin-top: 0.8rem;
					@include fj;
					@include sc(0.9rem, #333);
					.fee{
						transform: scale(1.1);
						@include sc(0.5rem, #666);
					}
					.distance_time{
						transform: scale(.9);
						span{
							color: #999;
						}
						.order_time{
							color: $blue;
						}
						.segmentation{
							color: #ccc;
						}
					}
				}
			}
		}
		.shop_li:hover {
			background: rgb(223, 223, 223);
			border-radius: 5px;
		}

		.loadMore {
			text-align: center;
		}
		.empty_data{
			@include sc(0.5rem, #666);
			text-align: center;
			line-height: 2rem;
		}
		.return_top{
			position: fixed;
			bottom: 3rem;
			right: 1rem;
		}
		.loading-enter-active, .loading-leave-active {
			transition: opacity 1s
		}
		.loading-enter, .loading-leave-active {
			opacity: 0
		}
	}
</style>
