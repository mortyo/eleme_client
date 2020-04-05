<template>
    <div class="food_container">
		<div>
			<el-cascader :options="category"  v-model="restaurant_category_id" :props="{ emitPath:false }" clearable></el-cascader>
			<el-select v-model="order_by" placeholder="排序">
    			<el-option v-for="item in sortCode" :key="item.value" :label="item.label" :value="item.value"></el-option>
  			</el-select>
			<el-select v-model="support_ids" multiple collapse-tags placeholder="筛选">
				<el-option v-for="item in supportcode" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			{{support_ids}}
			<el-checkbox v-model="delivery_mode" true-label=1 border>蜂鸟专送</el-checkbox>
		</div>
      <!-- 商店列表 -->
    	<section class="shop_list_container">
	    	<shop-list 
			:geohash="geohash" 
			:restaurantCategoryId="restaurant_category_id" 
			:order_by='order_by' 
			:deliveryMode="delivery_mode" 
			:supportIds="support_ids" v-if="latitude"></shop-list>
    	</section>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import shopList from "src/components/common/shoplist";
import { getImgPath } from "src/components/common/mixin";
import {
  msiteAddress,
  foodCategory,
  foodDelivery,
  foodActivity
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
			
			confirmStatus: false, // 确认选择

			sortBy: null, // 筛选的条件
			category: null, // category分类左侧数据
			categoryDetail: null, // category分类右侧的详细数据
			Delivery: null, // 配送方式数据 1 蜂鸟专送
			Activity: null, // 商家支持活动数据
			filterNum: 0, // 所选中的所有样式的集合
		};
	},
	created() {
		this.initData();
	},
	mixins: [getImgPath],
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
@import "src/style/mixin";
.sort_container {
  background-color: #fff;
  border-bottom: 0.025rem solid #f1f1f1;
  width: 50%;
  position: fixed;
  margin:0 20%;
  display: flex;
  z-index: 13;
  box-sizing: border-box;
  .sort_item {
    @include sc(0.55rem, #444);
    @include wh(33.3%, 1.6rem);
    text-align: center;
    line-height: 1rem;
    .sort_item_container {
      @include wh(100%, 100%);
      position: relative;
      z-index: 14;
      background-color: #fff;
      box-sizing: border-box;
      padding-top: 0.3rem;
      .sort_item_border {
        height: 1rem;
        border-right: 0.025rem solid $bc;
      }
    }
    .sort_icon {
      vertical-align: middle;
      transition: all 0.3s;
      fill: #666;
    }
  }
  .choose_type {
    .sort_item_container {
      .category_title {
        color: $blue;
      }
      .sort_icon {
        transform: rotate(180deg);
        fill: $blue;
      }
    }
  }
  .showlist-enter-active,
  .showlist-leave-active {
    transition: all 0.3s;
    transform: translateY(0);
  }
  .showlist-enter,
  .showlist-leave-active {
    opacity: 0;
    transform: translateY(-100%);
  }
  .sort_detail_type {
    width: 100%;
    position: absolute;
    display: flex;
    top: 1.6rem;
    left: 0;
    border-top: 0.025rem solid $bc;
    background-color: #fff;
  }
  .category_container {
    .category_left {
      flex: 1;
      background-color: #f1f1f1;
      height: 16rem;
      overflow-y: auto;
      span {
        @include sc(0.5rem, #666);
        line-height: 1.8rem;
      }
      .category_left_li {
        @include fj;
        padding: 0 0.5rem;
        .category_icon {
          @include wh(0.8rem, 0.8rem);
          vertical-align: middle;
          margin-right: 0.2rem;
        }
        .category_count {
          background-color: #ccc;
          @include sc(0.4rem, #fff);
          padding: 0 0.1rem;
          border: 0.025rem solid #ccc;
          border-radius: 0.8rem;
          vertical-align: middle;
          margin-right: 0.25rem;
        }
        .category_arrow {
          vertical-align: middle;
        }
      }
      .category_active {
        background-color: #fff;
      }
    }
    .category_right {
      flex: 1;
      background-color: #fff;
      padding-left: 0.5rem;
      height: 16rem;
      overflow-y: auto;
      .category_right_li {
        @include fj;
        height: 1.8rem;
        line-height: 1.8rem;
        padding-right: 0.5rem;
        border-bottom: 0.025rem solid $bc;
        span {
          color: #666;
        }
      }
      .category_right_choosed {
        span {
          color: $blue;
        }
      }
    }
  }
  .sort_list_container {
    width: 100%;
    .sort_list_li {
      height: 2.5rem;
      display: flex;
      align-items: center;
      svg {
        @include wh(0.7rem, 0.7rem);
        margin: 0 0.3rem 0 0.8rem;
      }
      p {
        line-height: 2.5rem;
        flex: auto;
        text-align: left;
        text-indent: 0.25rem;
        border-bottom: 0.025rem solid $bc;
        @include fj;
        align-items: center;
        span {
          color: #666;
        }
      }
      .sort_select {
        span {
          color: $blue;
        }
      }
    }
  }
  .filter_container {
    flex-direction: column;
    align-items: flex-start;
    min-height: 10.6rem;
    background-color: #f1f1f1;
    .filter_header_style {
      @include sc(0.4rem, #333);
      line-height: 1.5rem;
      height: 1.5rem;
      text-align: left;
      padding-left: 0.5rem;
      background-color: #fff;
    }
    .filter_ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0 0.5rem;
      background-color: #fff;
      .filter_li {
        display: flex;
        align-items: center;
        border: 0.025rem solid #eee;
        @include wh(4.7rem, 1.4rem);
        margin-right: 0.25rem;
        border-radius: 0.125rem;
        padding: 0 0.25rem;
        margin-bottom: 0.25rem;
        svg {
          @include wh(0.8rem, 0.8rem);
          margin-right: 0.125rem;
        }
        span {
          @include sc(0.4rem, #333);
        }
        .filter_icon {
          @include wh(0.8rem, 0.8rem);
          font-size: 0.5rem;
          border: 0.025rem solid $bc;
          border-radius: 0.15rem;
          margin-right: 0.25rem;
          line-height: 0.8rem;
          text-align: center;
        }
        .activity_svg {
          margin-right: 0.25rem;
        }
        .selected_filter {
          color: $blue;
        }
      }
    }
    .confirm_filter {
      display: flex;
      background-color: #f1f1f1;
      width: 100%;
      padding: 0.3rem 0.2rem;
      .filter_button_style {
        @include wh(50%, 1.8rem);
        font-size: 0.8rem;
        line-height: 1.8rem;
        border-radius: 0.2rem;
      }
      .clear_all {
        background-color: #fff;
        margin-right: 0.5rem;
        border: 0.025rem solid #fff;
      }
      .confirm_select {
        background-color: #56d176;
        color: #fff;
        border: 0.025rem solid #56d176;
        span {
          color: #fff;
        }
      }
    }
  }
}
.showcover-enter-active,
.showcover-leave-active {
  transition: opacity 0.3s;
}
.showcover-enter,
.showcover-leave-active {
  opacity: 0;
}
.back_cover {
  position: fixed;
  @include wh(100%, 100%);
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
