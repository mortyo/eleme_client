<template>
  	<div class="paddingTop search_page">
        <div class="container">
            <form class="search_form">
                <el-input v-model="searchValue" placeholder="请输入商家或美食名称" @input="checkInput"></el-input>
                <el-button type="primary" @click.prevent="searchTarget('')">搜索</el-button>
            </form>

            <section v-if="restaurantList.length">
                <h4 class="title_restaurant">商家</h4>
                <ul class="list_container">
                    <router-link :to="{path:'/shop', query:{id:item.id}}" tag="li" v-for="item in restaurantList" :key="item.id" class="list_li">
                        <section class="item_left">
                            <img :src="imgBaseUrl + item.image_path" class="restaurant_img">
                        </section>
                        <section class="item_right">
                            <div class="item_right_text">
                                <p>
                                    <span>{{item.name}}</span>
                                </p>
                                <p>月售 {{item.month_sales||item.recent_order_num}} 单</p>
                                <p>{{item.delivery_fee||item.float_minimum_order_amount}} 元起送 / 距离{{item.distance}}</p>
                            </div>
                            <ul class="item_right_detail">
                                <li v-for="activities in item.restaurant_activity" :key="activities.id">
                                    <span :style="{backgroundColor: '#' + activities.icon_color}" class="activities_icon">{{activities.icon_name}}</span>
                                    <span>{{activities.name}}</span>
                                    <span class="only_phone">(手机客户端专享)</span>
                                </li>
                            </ul>
                        </section>
                    </router-link>
                </ul>
            </section>

            <section class="search_history" v-if="searchHistory.length&&showHistory">
                <h4 class="title_restaurant">搜索历史</h4>
                <ul>
                    <li v-for="(item, index) in searchHistory" :key="index" class="history_list">
                        <span class="history_text ellipsis" @click="searchTarget(item)">{{item}}</span>
                        <i class="el-icon-close" @click="deleteHistory(index)"></i>
                    </li>
                </ul>
                <footer class="clear_history" @click="clearAllHistory">清空搜索历史</footer>
            </section>

            <div class="search_none" v-if="emptyResult">很抱歉！无搜索结果</div>
        </div>
    </div>
</template>

<script>
import {searchRestaurant} from '../../service/getData'
import {imgBaseUrl} from '../../config/env'
import {getStore, setStore} from '../../config/mUtils'

export default {
	data(){
        return {
            geohash: '', // msite页面传递过来的地址信息
            searchValue: '', // 搜索内容
            restaurantList: [], // 搜索返回的结果
            imgBaseUrl, // 图片域名地址
            searchHistory: [], // 搜索历史记录
            showHistory: true, // 是否显示历史记录，只有在返回搜索结果后隐藏
            emptyResult: false, // 搜索结果为空时显示
        }
    },
    created(){
       
    },
    mounted(){
        this.geohash = this.$route.params.geohash;
        //获取搜索历史记录
        if (getStore('searchHistory')) {
            this.searchHistory = JSON.parse(getStore('searchHistory'));
        }
    },
    components:{

    },
    methods:{
        //点击提交按钮，搜索结果并显示，同时将搜索内容存入历史记录
        async searchTarget(historyValue){
            if (historyValue) {
                this.searchValue = historyValue;
            }else if (!this.searchValue) {
                return 
            }
            //隐藏历史记录
            this.showHistory = false;
            //获取搜索结果
            let res = await searchRestaurant(this.geohash, this.searchValue);
            this.restaurantList = res.data
            this.emptyResult = !this.restaurantList.length;
            /**
             * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
             * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
             */
            let history = getStore('searchHistory');
            if (history) { 
                let checkrepeat = false;
                this.searchHistory = JSON.parse(history);
                this.searchHistory.forEach(item => {
                    if (item == this.searchValue) {
                        checkrepeat = true;
                    }
                })
                if (!checkrepeat) {
                    this.searchHistory.push(this.searchValue)
                }
            }else {
                this.searchHistory.push(this.searchValue)
            }
            setStore('searchHistory',this.searchHistory)
        },
        //搜索结束后，删除搜索内容直到为空时清空搜索结果，并显示历史记录
        checkInput(){
            if (this.searchValue === '') {
                this.showHistory = true; //显示历史记录
                this.restaurantList = []; //清空搜索结果
                this.emptyResult = false; //隐藏搜索为空提示
            } 
        },
        //点击删除按钮，删除当前历史记录
        deleteHistory(index){
            this.searchHistory.splice(index, 1);
            setStore('searchHistory',this.searchHistory);
        },
        //清除所有历史记录
        clearAllHistory(){
            this.searchHistory = [];
            setStore('searchHistory',this.searchHistory);
        }
    }
}

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    .search_page{
        margin-bottom: 2rem;
    }
    .container {
        margin: 0 20%;
    }
    .search_form{
        background-color: #fff;
        padding: 0.5rem;
        display: flex;
        input{
            height: 1.5rem;
        }
    }
    .title_restaurant{
        font-size: 0.6rem;
        line-height: 2rem;
        text-indent: 0.5rem;
        font-weight: bold;
        color: #666;
    }
    .list_container{
        background-color: #fff;
    }
    .list_li{
        display: flex;
        justify-content: 'center';
        padding: 0.5rem;
        border-bottom: 0.025rem solid $bc;
        .item_left{
            margin-right: 0.25rem;
            .restaurant_img{
                @include wh(1.7rem, 1.7rem);
            }
        }
        .item_right{
            font-size: 0.55rem;
            flex: 1;
            .item_right_text{
                padding-bottom: 0.25rem;
                border-bottom: 0.025rem solid $bc;
                p{
                    line-height: .9rem;
                }
                .pay_icon{
                    margin-bottom: -0.08rem;
                }
            }
            .item_right_detail{
                margin-top: 0.25rem;
                li{
                    font-size: 0;
                    span{
                        font-size: .5rem;
                        vertical-align: middle;
                        display: inline-block;
                        margin-bottom: 0.2rem;
                    }
                    .activities_icon{
                        @include sc(.5rem, #fff);
                        font-weight: bold;
                        padding: .04rem;
                        border-radius: 0.15rem;
                        margin-right: 0.125rem;
                    }
                    .only_phone{
                        color: #FF6000;
                    }
                }
            }
        }
    }
    .search_history{
        .history_list{
            background-color: #fff;
            border-bottom: 0.025rem solid $bc;
            @include font(0.7rem, 2rem);
            padding: 0 0.3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .history_text{
                display: inline-block;
                width: 80%;
            }
            .delete_icon{
                @include wh(1rem, 1rem);
            }
        }
        .clear_history{
            background-color: #fff;
            color: $blue;
            @include font(.7rem, 2rem);
            font-weight: bold;
            text-align: center;
        }
    }
    .search_none{
        margin: 0 auto;
        @include font(0.65rem, 1.75rem);
        color: #333;
        background-color: #fff;
        text-align: center;
        margin-top: 0.125rem;
    }
</style>
