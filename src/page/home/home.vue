<template>
  	<div>
        <headTop signin-up='home'>
            <p slot="home" class="home">Tip:请选择您当前的位置</p>
        </headTop>
        <div class="container">
            <div class="city_tip">
                <span>当前定位城市：{{cityname}}</span>
            </div>

            <form class="city_form" v-on:submit.prevent>
                <div>
                    <el-input v-model="inputVaule" placeholder="输入学校、商务楼、地址" required></el-input>
                    <el-button type="primary" @click="postpois">搜索</el-button>
                </div>
            </form>

            <header v-if="historytitle" class="pois_search_history">搜索历史</header>
        
            <ul class="getpois_ul">
                <li v-for="(item, index) in placelist" @click='nextpage(index, item.geohash)' :key="index">
                    <h4 class="pois_name ellipsis">{{item.name}}</h4>
                    <p class="pois_address ellipsis">{{item.address}}</p>
                </li>
            </ul>

            <footer v-if="historytitle&&placelist.length" class="clear_all_history" @click="clearAll">清空所有</footer>

            <div v-if="placeNone" class="search_none_place" >很抱歉！无搜索结果</div>
        </div>
    </div>
</template>

<script>
import headTop from 'src/components/header/head'
import { 
    // cityGuess , 
    searchplace 
} from 'src/service/getData'
import { getStore, setStore, removeStore } from 'src/config/mUtils'

export default {
    components:{
        headTop
    },
    data(){
        return{
            inputVaule:'', // 搜索地址
            cityid:'', // 当前城市id
            cityname:'', // 当前城市名字
            placelist:[], // 搜索城市列表
            placeHistory:[], // 历史搜索记录
            historytitle: true, // 默认显示搜索历史头部，点击搜索后隐藏
            placeNone: false, // 搜索无结果，显示提示信息
        }
    },
	mounted(){
        // 获取当前城市
        // cityGuess().then(res => {
            // this.cityname = res.data.name;
            // this.cityid = res.data.id;
        //     console.log(res)
        //     console.log(1111111)
        // })
        this.initData();
    },
    methods:{
        //初始化数据
        initData(){
            //获取搜索历史记录
            if (getStore('placeHistory')) {
                this.placelist = JSON.parse(getStore('placeHistory'));
            }else{
                this.placelist = [];
            }
        },
        //发送搜索信息inputVaule
        postpois(){
            //输入值不为空时才发送信息
            if (this.inputVaule) {
                searchplace(this.cityid, this.inputVaule).then(res => {
                    this.historytitle = false;
                    this.placelist = res.data;
                    this.placeNone = res.data.length? false : true;
                })
            }
        },
        /**
         * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
         * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
         */
        nextpage(index, geohash){
            let history = getStore('placeHistory');
            let choosePlace = this.placelist[index];
            if (history) {
                let checkrepeat = false;
                this.placeHistory = JSON.parse(history);
                this.placeHistory.forEach(item => {
                    if (item.geohash == geohash) {
                        checkrepeat = true;
                    }
                })
                if (!checkrepeat) {
                    this.placeHistory.push(choosePlace)
                }
            }else {
                this.placeHistory.push(choosePlace)
            }
            setStore('placeHistory',this.placeHistory)
            this.$router.push({path:'/msite', query:{geohash}})
        },
        clearAll(){
            removeStore('placeHistory');
            this.initData();
        }
    },
}

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    .infinite-list{
        height: 100px;
    }
    .home {
        @include center;
        width: 50%;
        color: #fff;
        text-align: center;
        margin-left: -0.5rem;
    }
    .container {
        margin: 0 20%;
        .city_tip {
            @include fj;
            line-height: 1.45rem;
            padding: 0 0.45rem;
            span{
                @include sc(0.55rem, #666);
                font-weight: 900;
            }
        }
        .city_form{
            background-color: #fff;
            border-top: 1px solid $bc;
            border-bottom: 1px solid $bc;
            padding-top: 0.4rem;
            div{
                width: 90%;
                margin: 0 auto;
                text-align: center;
            }
        }
        .pois_search_history{
            border-top: 1px solid $bc;
            border-bottom: 1px solid $bc;
            padding-left: 0.5rem;
            @include font(0.475rem, 0.8rem);
        }
        .getpois_ul{
            background-color: #fff;
            border-top: 1px solid $bc;
            text-align: center;
            li{
                margin: 0 auto;
                padding-top: 0.65rem;
                border-bottom: 1px solid $bc;
                .pois_name{
                    margin: 0 auto 0.35rem;
                    width: 90%;
                @include sc(0.65rem, #333);
                }
                .pois_address{
                    width: 90%;
                    margin: 0 auto 0.55rem;
                    @include sc(0.45rem, #999);
                }
            }
        }
        .clear_all_history{
            @include sc(0.7rem, #666);
            text-align: center;
            line-height: 2rem;
            background-color: #fff;
        }
    }
</style>
