<template>
    <div>
		<div class="address">
			<p>当前地址：
				<span class="msite_title">{{msiteTitle}} </span>
				<router-link to="/home" class="change">&lt;地址不对？点击切换&gt;</router-link>
			</p>
		</div>
		<div class="shopnav">
			<router-link v-for="item in foodTypes" :key="item.index" :to="{path: '/food', query: {geohash, title: item.title, restaurant_category_id: getCategoryId(item.link)}}" class="link">
					<img :src="imgBaseUrl + item.image_url">
					<span>{{item.title}}</span>
			</router-link>
		</div>
		<p class="title">附近商家</p>
	    <shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
		<el-backtop></el-backtop>
    </div>    
</template>

<script>
import shopList from 'src/components/common/shoplist'
import {mapMutations} from 'vuex'
import {msiteAddress, msiteFoodTypes} from 'src/service/getData'

export default {
	components: {
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
	.address{
		text-align: center;
		.change{
			color: blue;
		}
	}
	.shopnav{
		text-align: center;

		.link {
			border: #e1e4e8 1px solid;
			border-radius: 5px;
			margin: 0 2px;
		}
		.link:hover{
			background-color:pink;
			border-radius: 0.2rem;
		}
		img {
			width: 18px;
		}
	}
	.title {
		text-align:center;
		color:#ff4400;
		margin:8px
	}
</style>
