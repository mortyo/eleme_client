<template>
    <div class="food_container">
		<div class="filter">
			<el-cascader :options="category"  v-model="restaurant_category_id" :props="{ emitPath:false }" clearable placeholder="商家分类"></el-cascader>
			<el-select v-model="order_by" placeholder="排序">
    			<el-option v-for="item in sortCode" :key="item.value" :label="item.label" :value="item.value"></el-option>
  			</el-select>
			<el-select v-model="support_ids" multiple collapse-tags placeholder="筛选">
				<el-option v-for="item in supportcode" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<el-checkbox v-model="delivery_mode" true-label=1 border>蜂鸟专送</el-checkbox>
		</div>
      <!-- 商店列表 -->
    	<section class="shop_list_container">
	    	<shop-list 
			:geohash="geohash" 
			:restaurantCategoryId="restaurant_category_id" 
			:order_by='order_by' 
			:deliveryMode="delivery_mode" 
			:support_ids="support_ids" v-if="latitude"></shop-list>
    	</section>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import shopList from "src/components/common/shoplist";
import {
  msiteAddress,
  foodCategory,
  foodDelivery,  //获取配送方式，所有配送方式只有一种，那就是‘蜂鸟配送’id为1
  foodActivity	 //获取商铺活动，以获取support_ids，所有support_ids已放在supportcode
} from "src/service/getData";

export default {
	data() {
		return {
			geohash: "", // city页面传递过来的地址geohash

			restaurant_category_id: "", //筛选类型的id
			order_by: null, // 根据何种方式排序
			sortCode: [
				{ value:1,label: '起送价'},
				{ value:2,label: '配送速度'},
				{ value:3,label: '评分'},
				{ value:4,label: '智能排序(默认)'},
				{ value:5,label: '距离最近'},
				{ value:6,label: '销量最高'},
			],
			delivery_mode: null, // 选中的配送方式
			support_ids: [], // 选中的商铺活动列表
			supportcode: [
				{ value:8,label: '品牌商家'},
				{ value:7,label: '外卖保'},
				{ value:9,label: '准时达'},
				{ value:5,label: '新店'},
				{ value:3,label: '在线支付'},
				{ value:4,label: '开发票'},
			],
			category: null, // category分类左侧数据
		};
	},
	created() {
		this.initData();
	},
	components: {
		shopList
	},
	computed: {
		...mapState(["latitude", "longitude"])
	},
	methods: {
		...mapMutations(["RECORD_ADDRESS"]),
		//初始化获取数据
		initData() {
			//获取从msite页面传递过来的参数
			this.geohash = this.$route.query.geohash;
			this.restaurant_category_id = this.$route.query.restaurant_category_id;
			//防止刷新页面时，vuex状态丢失，经度纬度需要重新获取，并存入vuex
			if (!this.latitude) {
				//获取位置信息
				msiteAddress(this.geohash).then((res) => {
				// 记录当前经度纬度进入vuex
				this.RECORD_ADDRESS(res);
				});
				
			}
			//获取category分类,请求获取的数组重新生成新的数组category
			foodCategory(this.latitude, this.longitude).then((res) => {
				// console.log(res.data)
				this.category = res.data.map(object => {
					return {
						label: object.name,
						value: object.id,
						children: object.sub_categories.map(o => {
							return{
								label: o.name,
								value: o.id,
							}
						})
					}
				})
			});
			// //获取筛选列表的配送方式
			// foodDelivery(this.latitude, this.longitude).then((res) => {
			// 	this.Delivery = res.data;
			// });
			// //获取筛选列表的商铺活动
			// foodActivity(this.latitude, this.longitude).then((res) => {
			// 	this.Activity = res.data;
			// 	console.log(res.data)
			// 	//记录support_ids的状态
			// 	this.Activity.forEach((item, index) => {
			// 		this.supportcode[index] = { label: item.name, value: item.id };
			// 	});
			// 	// console.log(this.supportcode)
			// });
		},
	}
};
</script>

<style lang="scss" scoped>
	.filter {
		margin-top: 12px;
		display: flex;
		justify-content: center;
	}
</style>
