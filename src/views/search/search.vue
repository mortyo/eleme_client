<template>
  	<div class="search_page">
        <form class="search_container">
            <el-input class="input" v-model="searchValue" placeholder="请输入商家或美食名称" @input="checkInput" clearable></el-input>
            <el-button class="search" type="primary" round @click.prevent="searchTarget('')">搜索</el-button>
        </form>

        <section class="restaurant" v-if="restaurantList.length">
            <h4 class="title_restaurant">商家</h4>
            <ul class="list_container">
                <router-link :to="{path:'/shop', query:{id:item.id}}" tag="li" v-for="item in restaurantList" :key="item.id" class="list_li">
                    <section class="item_left">
                        <img :src="imgBaseUrl + item.image_path" class="restaurant_img">
                    </section>
                    <section class="item_middle">
                        <div class="item_right_text">
                            <p>商家名称：{{item.name}}</p>
                            <p>评分：{{item.rating}}</p>
                            <p>月售量： {{item.recent_order_num}} 单</p>
                            <p>评论数：400</p>
                            <p>{{item.float_minimum_order_amount}}件or{{item.delivery_fee}} 元起送 / 距离{{item.distance}}</p>
                        </div>
                    </section>
                    <section class="item_right">
                        <p>分类：{{item.category}}</p>
                        <p>配送费：{{item.float_delivery_fee}}元起</p>
                        <p>开店时间：{{item.opening_hours}}</p>
                        <div v-for="activities_item in item.activities" :key="activities_item.id">
                            <p>活动：{{activities_item.name}}</p> 
                            <p>活动详情：{{activities_item.description}}</p>
                        </div>
                    </section>
                </router-link>
            </ul>
        </section>

        <section class="search_history" v-if="searchHistory.length&&showHistory">
            <h4 class="title_restaurant">搜索历史</h4>
            <ul>
                <li v-for="(item, index) in searchHistory" :key="index" @click="searchTarget(item)" class="history_list">
                    <span>{{item}}</span>
                    <i class="el-icon-close" @click="deleteHistory(index)"></i>
                </li>
            </ul>
            <footer class="clear_history" @click="clearAllHistory">清空搜索历史</footer>
        </section>

        <div class="search_none" v-if="emptyResult">很抱歉！无搜索结果</div>
    </div>
</template>

<script>
import { searchRestaurant } from '../../api/getData'
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
    mounted(){
        if(this.$route.query.geohash&&this.$route.query.keyword){
            searchRestaurant(this.$route.query.geohash,this.$route.query.keyword).then((res) => {
                this.restaurantList = res.data
                console.log(this.restaurantList)
                this.emptyResult = !this.restaurantList.length;
            })
        }else{
            this.geohash = this.$route.query.geohash;
            //获取搜索历史记录
            if (getStore('searchHistory')) {
                this.searchHistory = JSON.parse(getStore('searchHistory'));
            }
        } 
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
            await searchRestaurant(this.geohash, this.searchValue).then((res) => {
                this.restaurantList = res.data
                this.emptyResult = !this.restaurantList.length;
            });
            
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
        margin: 24px auto 0 auto;
        padding: 0 16px;
        max-width: 1000px;
        height: 1000px;
    }
    .search_container{
        display: flex;
        justify-content: center;
        .input {
            width: 600px;
        }
        .search {
            margin-left: 16px;
        }
    }
    .title_restaurant{
        line-height: 24px;
        font-weight: bold;
        color: #666;
    }
    .restaurant {
        width: 698px;
        margin: 0 auto 24px auto;
        .list_li{
            display: flex;
            overflow: hidden;
            background: #fff;
            height: 90px;
            border: rgb(220, 223, 230) 1px solid;
            border-radius: 10px;
            margin-bottom: 4px;
            cursor: pointer;
            .item_left{
                .restaurant_img{
                    height: 88px;
                    width: 88px;
                    border-radius: 10px;
                }
            }
            .item_middle{
                font-size: 10px;
                margin: 0 16px;
                overflow: hidden;
                width: 40%;
            }
            .item_right {
                overflow: hidden;
                font-size: 10px;
                margin: 0 16px;
            }
        }
    }
    .search_history{
        width: 698px;
        margin: 0 auto 24px auto;
        .history_list{
            background-color: #fff;
            height: 32px;
            border-bottom: 1px solid $bc;
            padding: 0 0 0 8px;
            margin: 4px 0;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            i {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 31px;
                height: 31px;
            }
            i:hover{
                background-color: grey;
                width: 31px;
                height: 31px;
                border-radius: 5px;
            }
        }
        .clear_history{
            margin: 16px auto;
            border-radius: 5px;
            width: 100px;
            background-color: #fff;
            color: $blue;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
        }
    }
    .search_none{
        width: 698px;
        margin: 24px auto;
        padding: 8px 0;
        border-radius: 5px;
        color: #333;
        background-color: #fff;
        text-align: center;
    }
</style>
