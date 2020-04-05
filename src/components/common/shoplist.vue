<template>
	<div class="shoplist_container">
		<!-- 如果附近有商家 -->
		<div class="ul">
			<ul v-if="shopListArr.length" class="shop_ul">
				<router-link v-for="item in shopListArr" :key="item.id" :to="{path: 'shop', query:{geohash, id: item.id}}" class="shop_li">
					<div class="shop_img">
						<img :src="imgBaseUrl + item.image_path" class="shop_img">
					</div>
					<hgroup class="shop_right">
						<header class="shop_detail_header">
							<h4 :class="item.is_premium? 'premium': ''" class="shop_title">{{item.name}}</h4>
							<ul class="shop_detail_ul">
								<li v-for="item in item.supports" :key="item.id" class="supports">{{item.icon_name}}</li>
							</ul>
						</header>
						<h5 class="rating_order_num">
							<section class="rating_order_num_left">
								评分：{{item.rating}}
								月售{{item.recent_order_num}}单
							</section>
							<section class="rating_order_num_right">
								<span class="delivery_style delivery_left" v-if="item.delivery_mode">{{item.delivery_mode.text}}</span>
								<span class="delivery_style delivery_right" v-if="ontime(item.supports)">准时达</span>
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
		</div>
		<div class="loadMore">
			<el-button type="primary" @click="loadMore" round size="mini" style="margin-bottom: 4px">加载更多</el-button>
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
	props: [ 'geohash','restaurantCategoryId', 'order_by', 'deliveryMode', 'supportIds'],
	data(){
		return {
			shopListArr:[], // 店铺列表数据
			offset: 0, // 批次加载店铺列表，每次加载24个 limit = 24
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

	methods: {
		initData(){
			//获取数据
			shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId).then((res) => {
				this.shopListArr = res.data;
				if (res.data.length < 15) {
					this.touchend = true;
				}
				this.showLoading = false;
			});
		},
		//到达底部加载更多数据
		async loadMore(){
			this.showLoading = true;
			//数据的定位加24位
			this.offset += 24;
			let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
			this.showLoading = false;
			this.shopListArr = [...this.shopListArr, ...res.data];
			//当获取数据小于20，说明没有更多数据，不需要再次请求数据
			if (res.length < 24) {
				this.touchend = true;
				return
			}
		},
		ontime(supports){
			let Status;
			if ((supports instanceof Array) && supports.length) {
 				supports.forEach(item => {
 					if (item.icon_name === '准') {
 						Status = true;
 					}
 				})
			}else{
				Status = false;
			}
			return Status
		},
		//监听父级传来的数据发生变化时，触发此函数重新根据属性值获取数据
		async reload(){
			this.showLoading = true;
			this.offset = 0;
			let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId, this.order_by, this.deliveryMode, this.supportIds);
			this.showLoading = false;
			//考虑到本地模拟数据是引用类型，所以返回一个新的数组
			this.shopListArr = res.data;
		},
	},
	watch: {
		//监听父级传来的restaurantCategoryIds，当值发生变化的时候重新获取餐馆数据，作用于排序和筛选
		restaurantCategoryId: function (value){
			this.reload();
		},
		//监听父级传来的排序方式
		order_by: function (value){
			this.reload();
		},
		//监听父级的确认按钮是否被点击，并且返回一个自定义事件通知父级，已经接收到数据，此时父级才可以清除已选状态
		deliveryMode: function (value){
			this.reload();
		},
		supportIds: function (value){
			this.reload();
		}
	}
}
</script>

<style lang="scss" scoped>
	@import 'src/style/mixin';
	.shoplist_container{
		margin-top: 8px;
		.ul {
			display: flex;
			justify-content: center;
			.shop_ul{
				max-width: 1134px;
				display: flex;
				// justify-content: center;
				flex-wrap: wrap;
				.shop_li{
					display: flex;
					width: 370px;
					height: 92px;
					background: #fff;
					border:  #e1e4e8 1px solid;
					border-radius: 5px;
					margin: 4px;
					.shop_img{
						width: 90px;
						border-radius: 5px;
					}
					.shop_right{
						width: 100%;
						height: 90px;
						display: flex;
						flex-direction: column;
						justify-content: center;
						.shop_detail_header{
							height: 30px;
							margin: 0 4px;
							display: flex;
							justify-content: space-between;
							align-items: center;
							.shop_title{
								color: #333;
								font-weight:bold;
								font-size: 110%;
							}
							.premium::before{
								content: '品牌';
								font-size: 50%;
								line-height: 16px;
								color: #333;
								background-color: #ffd930;
								border-radius: 3px;
								margin-right: 4px;
							}
							.shop_detail_ul{
								display: flex;
								.supports{
									@include sc(1px, #999);
									height:fit-content;
									border: 1px solid #666;
									border-radius: 3px;
									margin-left: 4px;
								}
							}
						}
						.rating_order_num{
							height: 30px;
							margin: 0 4px;
							display: flex;
							justify-content: space-between;
							.rating_order_num_left{
								display: flex;
								align-items: center;
							}
							.rating_order_num_right{
								display: flex;
								align-items: center;
								justify-content: flex-end;
								.delivery_style{
									border-radius: 3px;
									margin-left: 4px;
									border: 1px;
								}
								.delivery_left{
									color: #fff;
									background-color: $blue;
									border: 1px solid $blue;
								}
								.delivery_right{
									color: $blue;
									border: 1px solid $blue;
								}
							}
						}
						.fee_distance{
							height: 30px;
							margin: 0 4px;
							display: flex;
							justify-content: space-between;
							align-items: center;
							.fee{
								@include sc(0.5rem, #666);
							}
							.distance_time{
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
			}
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
