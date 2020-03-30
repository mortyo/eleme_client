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
                <!-- 订单 -->
                <el-tab-pane class="order">
                    <span slot="label"><i class="el-icon-shopping-cart-full"></i> 我的订单</span>
                        <el-tabs v-model="activeName">
                            <el-tab-pane class="allorder" label="全部订单" name="all">
                                    <ul class="order_head">
                                        <li id="name">商品</li>
                                        <li id="total">实付款</li>
                                        <li id="stat">交易状态</li>
                                        <li id="operate">交易操作</li>
                                    </ul>
                                    <ul class="order_data">
                                        <li v-for="item in orderlist" :key="item.key">
                                            <div>
                                                {{item.formatted_created_at}} 
                                                <img alt="商家图片"> 
                                                {{item.restaurant_name}}
                                                订单详情
                                            </div>
                                            <div>
                                                <img alt="商品图片"> 
                                                {{item.basket.group[0][0].name}}{{item.basket.group[0].length > 1 ? ' 等' + item.basket.group[0].length + '件商品' : ''}}
                                                ¥{{item.total_amount.toFixed(2)}}
                                                {{item.status_bar.title}}
                                                <div style="display:inline" v-if="item.status_bar.title == '等待支付'">去支付(time)</div>
                                                <div style="display:inline" v-else>重新下单</div>
                                            </div>
                                        </li>
                                    </ul>
                            </el-tab-pane>
                            <el-tab-pane label="支付成功" name="sending">支付成功</el-tab-pane>
                            <el-tab-pane label="等待支付" name="wait_to_pay">等待支付</el-tab-pane>
                            <el-tab-pane label="支付超时" name="timeout">支付超时</el-tab-pane>
                        </el-tabs>
                </el-tab-pane>
                <!-- 余额 -->
                <el-tab-pane class="balance">
                    <span slot="label"><i class="el-icon-wallet"></i>我的钱包</span>
                    <div class="cash">
                        <p>当前余额：<span>{{balance}}</span>元</p>
                        <el-button type="primary" class="Take_out">提现</el-button>
                    </div>
                    <div class="record">
                        <p>交易记录</p>
                        <p>没有任何交易记录哦</p>
                    </div>
                </el-tab-pane>
                <!-- 红包 -->
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-present"></i>我的优惠</span>
                        <el-tabs v-model="activeName_hongbao">
                            <el-tab-pane label="红包" name="hongbao">
                                <p>当前可用红包：{{hongbaoList.length}}个</p>
                                <ul>
                                    <li v-for="item in hongbaoList" :key="item.id">
                                        <section class="list_item">
                                            <div class="list_item_left">
                                                <span>¥</span>
                                                <span>{{String(item.amount).split('.')[0]}}</span>
                                                <span>.</span>
                                                <span>{{String(item.amount).split('.')[1]||0}}</span>
                                                <p>{{item.description_map.sum_condition}}</p>
                                            </div>
                                            <div class="list_item_right">
                                                <h4>{{item.name}}</h4>
                                                <p>{{item.description_map.validity_periods}}</p>
                                                <p>{{item.description_map.phone}}</p>
                                            </div>
                                            <div class="time_left">{{item.description_map.validity_delta}}</div>
                                        </section>
                                        <footer class="list_item_footer" v-if="item.limit_map">
                                            <p>{{item.limit_map.restaurant_flavor_ids}}</p>
                                        </footer>
                                    </li>
                                </ul>
                            </el-tab-pane>
                            <el-tab-pane label="代金券" name="daijinquan">
                                <p>没有任何代金券哦</p>
                            </el-tab-pane>
                        </el-tabs>
                </el-tab-pane>
                <!-- 积分 -->
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-trophy"></i>我的积分</span>
                    <p>当前积分：{{pointNumber}}分</p>
                    <p>积分记录</p>
                    <p>没有任何积分记录哦</p>
                </el-tab-pane>
                <!-- 下载 -->
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-eleme"></i>Eleme小程序</span>
                    <img src='../../images/app.png'>
                    <p>手机用户请扫码下载APP</p>
                </el-tab-pane>
                <!-- 更多 -->
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-more-outline"></i></span>
                </el-tab-pane>
            </el-tabs>
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
    getHongbaoNum
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
            orderlist: [],
            //红包
            activeName_hongbao: 'hongbao',
            hongbaoList: []
        }
    },
    computed:{
        ...mapState([
            'userInfo',
        ]),
    },
    mounted(){
        this.initData();
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
                //获取订单数据
                getOrderList(this.userInfo.id).then((res) => {
                    this.orderlist = res.data
                    // console.log(this.orderlist)
                //获取红包数据
                getHongbaoNum(this.userInfo.user_id).then((res) => {
                    this.hongbaoList = res.data
                    console.log(res.data)
                });
                })
            }
        },
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
        .allorder {
            .order_head {
                border: 1px solid #ececec;
                width: 100%;
                li {
                    float: left;
                    // display: block;
                    // #name { width: 50%; };
                    // #total {};
                    // #stat {};
                    // #operate{}
                }
            }
            .order_data {
                width: 100%;
                li {
                    border: 1px solid #ececec;
                    margin: 3px;
                }
            }
        }
        // .balance {
        //     .cash{
        //         .take_out{

        //         }
        //     }
        // }




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
