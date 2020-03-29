<template>
    <div class="profile_page">
        <section class="profile">
            <div class="avatar">
                <img :src="imgBaseUrl + userInfo.avatar" v-if="userInfo&&userInfo.user_id">
            </div>
            <div class="user-info">
                <p>{{username}}</p>
                <p>
                    <i class="el-icon-phone-outline"></i>
                    <span>{{mobile}}</span>
                </p>
                <p>
                    <i class="el-icon-message"></i>
                    <span>{{email}}</span>
                </p>
                <p>
                    <i class="el-icon-location-information">{{city}}</i>
                </p>
                <p>
                    <i class="el-icon-thumb">{{registe_time}}</i>
                </p>
            </div>
            <router-link :to="userInfo&&userInfo.user_id? '/profile/info' : '/login'" class="profile-link">设置</router-link>
        </section>
        
        <section class="info-data">
            <el-tabs type="border-card">
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-shopping-cart-full"></i> 我的订单</span>
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="所有订单" name="all">
                                所有订单
                            </el-tab-pane>
                            <el-tab-pane label="配送中" name="sending">配送中</el-tab-pane>
                            <el-tab-pane label="待支付" name="wait_to_pay">待支付</el-tab-pane>
                            <el-tab-pane label="支付超时" name="timeout">支付超时</el-tab-pane>
                        </el-tabs>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-wallet"></i> 我的钱包</span>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-present"></i> 我的优惠</span>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-trophy"></i> 我的积分</span>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-eleme"></i> Elemen小程序</span>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-more-outline"></i></span>
                </el-tab-pane>
            </el-tabs>


            <ul>
                <router-link to="/balance" tag="li" class="info-data-link">
                    <span class="info-data-top"><b>{{parseInt(balance).toFixed(2)}}</b>元</span>
                    <span class="info-data-bottom">我的余额</span>
                </router-link>
                <router-link to="/benefit" tag="li" class="info-data-link">
                    <span class="info-data-top"><b>{{count}}</b>个</span>
                    <span class="info-data-bottom">我的优惠</span>
                </router-link>
                <router-link to="/points" tag="li" class="info-data-link">
                    <span class="info-data-top"><b>{{pointNumber}}</b>分</span>
                    <span class="info-data-bottom">我的积分</span>
                </router-link>
                <router-link to='/order' tag="li" class="info-data-link">
                    <i class="el-icon-chicken"></i>
                    <span class="info-data-bottom">我的订单</span>
                </router-link>
                <router-link to='/download' tag="li" class="info-data-link">
                    <i class="el-icon-eleme"></i>
                    <span class="info-data-bottom">下载APP</span>
                </router-link>
            </ul>
        </section>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import {imgBaseUrl} from 'src/config/env'
import {
    getOrderList,
} from 'src/service/getData'

export default {
    data(){
        return{
            username: '',           //用户名
            avatar: '',             //头像地址
            mobile: '暂无绑定手机号',             //电话号码
            email: '暂无绑定邮箱',             //电话号码
            city: '',
            registe_time: '',
            balance: 0,            //我的余额
            count : 0,             //优惠券个数
            pointNumber : 0,       //积分数
            imgBaseUrl,
            //订单数据
            activeName: 'all',

        }
    },
    computed:{
        ...mapState([
            'userInfo',
        ]),
    },
    mounted(){
        this.initData();
        this.initOrder()
    },
    methods:{
        initData(){
            if (this.userInfo && this.userInfo.user_id) {
                this.avatar = this.userInfo.avatar;
                this.username = this.userInfo.username;
                this.mobile = this.userInfo.mobile || '暂无绑定手机号';
                this.email = this.userInfo.email || '暂无绑定邮箱';
                this.balance = this.userInfo.balance;
                this.count = this.userInfo.gift_amount;
                this.pointNumber = this.userInfo.point;
                this.city = this.userInfo.city;
                this.registe_time = this.userInfo.registe_time;
            }
        },
        initOrder(){
            if(this.userInfo && this.userInfo.user_id) {
                getOrderList(this.userInfo.id).then((res) => {
                    console.log(res.data)
                })
            }
        }
    },
    //监听userInfo数据变化是回调initData()函数初始化数据
    watch: {
        userInfo: function (value){
            this.initData()
        }
    }
}
</script>

<style lang="scss" scoped>
   @import 'src/style/mixin';

    .profile_page{
        margin-top: 24px;
        padding: 0 16px 0 16px;
    }
    .profile{
        display: block;
        float: left;
        width: 20%;
        padding-right: 16px;
        .avatar {
            overflow: hidden;
            width: 100%;
            img {
                border-radius: 5px;
                border: 1px solid #e1e4e8;
                height: 100%;
                width: 100%;
            }
        }
        .user-info{
            padding: 16px 0;
            p{
                font-weight:600;
                font-size: 16px;
                line-height: 24px;
                color: #666;
                .icon-mobile-number{
                    display:inline-block;
                }
            }
        }
        .profile-link{
            display:block;
            text-align: center;
            background:#545c64;
            color: #fff;
            padding: 8px;
            border-radius: 5px;
        }
    }
    .info-data{
        display: block;
        float: left;
        width: 80%;
        background:$fc;
        ul{
            display: block;
            float: left;
            .info-data-link{
                text-align:center;
                margin: 10px 0;
                border-right:1px solid #f1f1f1;
                span{
                    display:block;
                    width:100%;
                }
                .info-data-top{
                    @include sc(.8rem,#333);
                    padding: .853333rem 0 .453333rem;
                    b{
                        display:inline-block;
                        @include sc(1.2rem,#f90);
                        font-weight:700;
                        line-height:1rem;
                        font-family: Helvetica Neue,Tahoma;
                    }
                }
                .info-data-bottom{
                    @include sc(.9rem,#666);
                    font-weight:400;
                    padding-bottom:.453333rem;

                }
            }
            .info-data-link:nth-of-type(2){
                .info-data-top{
                    b{
                        color:#ff5f3e;
                    }
                }

            }
            .info-data-link:nth-of-type(3){
                border:0;
                .info-data-top{
                    b{
                        color:#6ac20b;
                    }
                }
            }
        }
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
