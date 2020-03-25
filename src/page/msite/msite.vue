<template>
    <div>
    	<head-top signin-up='msite'>
			<router-link to="/home" slot="msite-title" class="msite_title">
				<span class="title_text ellipsis">{{msiteTitle}}</span>
			</router-link>
    	</head-top>

		<!-- 商店导航 -->
		<div class="shopnav">
			<router-link v-for="(item, index) in foodTypes" :key="index" :to="{path: '/food', query: {geohash, title: item.title, restaurant_category_id: getCategoryId(item.link)}}" class="link">
					<img :src="imgBaseUrl + item.image_url">
					<span>{{item.title}}</span>
			</router-link>
		</div>
		<!-- 商店列表 -->
    	<div class="shop_list_container">
	    	<header class="shop_header">
	    		<span class="shop_header_title">附近商家</span>
	    	</header>
	    	<shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
    	</div>	
		<el-backtop></el-backtop>
    </div>    
</template>

<script>
import headTop from 'src/components/header/head'
import shopList from 'src/components/common/shoplist'
import {mapMutations} from 'vuex'
import {msiteAddress, msiteFoodTypes} from 'src/service/getData'

export default {
	components: {
    	headTop,
    	shopList,
    },
	data(){
        return {
        	geohash: '', // 页面传递过来的地址geohash
            msiteTitle: '请选择地址...', // msite页面头部标题
            foodTypes: [], // 食品分类列表
            hasGetData: false, //是否已经获取地理位置数据，成功之后再获取商铺列表信息
            imgBaseUrl: 'https://fuss10.elemecdn.com', //图片域名地址
        }
    },
    async beforeMount(){
		if (!this.$route.query.geohash) {
			this.$router.push({path:'/home'})
		}else{
			this.geohash = this.$route.query.geohash
		}
		//保存geohash 到vuex
		this.SAVE_GEOHASH(this.geohash);
    	//获取位置信息
    	let res = await msiteAddress(this.geohash);
		this.msiteTitle = res.data.name;
    	// 记录当前经度纬度
    	this.RECORD_ADDRESS(res.data);
		this.hasGetData = true;
    },
    mounted(){
        //获取导航食品类型列表
       	msiteFoodTypes().then(res => {
			this.foodTypes = res.data;
        })
    },
    methods: {
    	...mapMutations([
    		'SAVE_GEOHASH','RECORD_ADDRESS'
    	]),
    	// 解码url地址，求去restaurant_category_id值
    	getCategoryId(url){
    		let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name',''));
    		if (/restaurant_category_id/gi.test(urlData)) {
    			return JSON.parse(urlData).restaurant_category_id.id
    		}else{
    			return ''
    		}
    	}
    }
}

</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
	.msite_title{
		@include center;
        width: 50%;
        color: #fff;
        text-align: center;
        margin-left: -0.5rem;
        .title_text{
            @include sc(0.8rem, #fff);
            text-align: center;
            display: block;
        }
	}
	.shopnav{
		text-align: center;
		.link:hover{
			background-color:pink;
			border-radius: 0.2rem;
		}
		img {
			width: 18px;
		}
	}
	.shop_list_container{
		margin-top: .4rem;
		border-top: 0.025rem solid $bc;
		background-color: #fff;
		.shop_header{
			.shop_header_title{
				color: #999;
				@include font(0.55rem, 1.6rem);
			}
		}
	}
</style>
