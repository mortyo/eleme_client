<template>
  	<div>
        <headTop signin-up='home'>
            <p slot="home" class="home">Tip:请选择您当前的位置</p>
        </headTop>

        <div class="container">
            <!-- 搜索框 -->
            <form class="city_form" v-on:submit.prevent>
                <p class="city_tip">当前定位城市：{{cityname}}</p><br>
                <el-autocomplete class="search" popper-class="my-autocomplete" :popper-append-to-body="false" v-model="inputVaule" :fetch-suggestions="querySearch" placeholder="输入学校、商务楼、地址" @select="handleSelect" >
                    <i class="el-icon-delete el-input__icon" slot="suffix" @click="handleIconClick"></i>
                    <template slot-scope="{ item }">
                        <p>历史记录</p>
                        <div class="name">{{ item.value }}</div>
                        <span class="addr">{{ item.address }}</span>
                    </template>
                    <el-button slot="append" icon="el-icon-search" @click="postpois"></el-button>
                </el-autocomplete>
            </form>
            <!-- 搜索结果 -->
            <ul class="getpois_ul">
                <li v-for="(item, index) in placelist" @click='nextpage(index,item.geohash)' :key="index">
                    <h4 class="pois_name ellipsis">{{item.name}}</h4>
                    <p class="pois_address ellipsis">{{item.address}}</p>
                </li>
            </ul>
            <div v-if="placeNone" class="search_none_place" >很抱歉！无搜索结果</div>
        </div>
    </div>
</template>

<script>
import headTop from 'src/components/header/head'
import { cityGuess , searchplace } from 'src/service/getData'
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

            historylist:[], // 历史搜索记录
            placeNone: false, // 搜索无结果，显示提示信息
        }
    },
	mounted(){
        // 获取当前城市
        cityGuess().then(res => {
            this.cityname = res.data.name;
            this.cityid = res.data.id;
        });
        this.initData();
    },
    methods:{
        //初始化数据
        initData(){
            //获取搜索历史记录
            this.historylist = JSON.parse(getStore('placeHistory'));
        },
        //发送搜索信息inputVaule
        postpois(){
            //输入值不为空时才发送信息
            if (this.inputVaule) {
                searchplace(this.cityid, this.inputVaule).then(res => {
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
            };
            setStore('placeHistory',this.placeHistory);
            this.$router.push({path:'/msite', query:{geohash}});
        },
        clearAll(){
            removeStore('placeHistory');
            this.initData();
        },


        // 点击输入框时列出历史记录,queryString为输入字符串，cb是 调用 callback 返回建议列表的数据
        querySearch(queryString, cb) {
            var historylist = this.historylist ? this.historylist.map(object=>{return {
                value:object.name,
                address:object.address,
                geohash:object.geohash,
                latitude:object.latitude,
                longitude:object.longitude
            }}) : [];
            //如果输入字符串为非空，则显示相关历史记录，如果为空就显示全部历史记录
            var results = queryString ? historylist.filter(this.createFilter(queryString)) : historylist;
            cb(results);
        },
        //过滤输入字符串
        createFilter(queryString) {
            return (restaurant) => {
            return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        //选中后处理
        handleSelect(item) {
            console.log(item);
            this.$router.push({path:'/msite', query:{geohash:item.geohash}})
        },
        handleIconClick(ev) {
            this.clearAll();
            console.log(ev)
        }
    },
}

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    .home {
        @include center;
        width: 50%;
        // color: #fff;
        text-align: center;
        margin-left: -0.5rem;
    }
    .container {
        .city_form{
            text-align: center;
            .city_tip {
                margin: 0 25%;
                text-align: left;
            }
            .search{
                width: 50%;
                text-align: left;
                margin: initial;
                padding: 0;
            }
            .my-autocomplete {
                li {
                    line-height: normal;
                    padding: 7px;

                    .name {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    }
                    .addr {
                    font-size: 12px;
                    color: #b4b4b4;
                    }

                    .highlighted .addr {
                    color: #ddd;
                    }
                }
            }
        }
        .getpois_ul{
            li{
                margin: 0 25%;
                padding-top: 21px;
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
        .search_none_place{
            text-align: center;
            margin: 21px auto;
        }
}
</style>
