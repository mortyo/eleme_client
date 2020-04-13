<template>
    <div class="profile_page">
        <div class="profile">
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
        </div>
        <div class="info-data">
            <el-tabs type="border-card">
                <!-- 订单 -->
                <el-tab-pane class="order">
                    <span slot="label"><i class="el-icon-shopping-cart-full"></i> 我的订单</span>
                        <el-tabs v-model="activeName">
                            <el-tab-pane class="allorder" label="全部订单" name="all">
                                <ul>
                                    <li v-for="item in orderlist" :key="item.key" class="order_data">
                                        <div class="item_left">
                                            <img :src="imgBaseUrl+item.restaurant_image_url" alt="商家图片" @click="showDetail(item)" class="restaurant_img"> 
                                        </div>
                                        <div class="item_middle">
                                            <p>商家名称：<router-link :to="{path: '/shop', query: {geohash, id: item.restaurant_id}}" style="color:blue;">{{item.restaurant_name}}</router-link></p>
                                            <p>商品：{{item.basket.group[0][0].name}}{{item.basket.group[0].length > 1 ? ' 等' + item.basket.group[0].length + '件' : ''}}</p>
                                            <p>共支付：¥{{item.total_amount.toFixed(2)}}</p> 
                                            <p>订单状态：{{item.status_bar.title}}</p> 
                                            <div style="color:blue;" v-if="item.status_bar.title == '等待支付'">去支付(time)</div>
                                            <router-link :to="{path: '/shop', query: {geohash, id: item.restaurant_id}}" style="color:blue;" v-else>重新下单</router-link>
                                        </div>
                                        <div class="item_right">
                                            <p>下单时间：{{item.formatted_created_at}}</p>
                                            <p>{{item.basket.deliver_fee.name}}：{{item.basket.deliver_fee.price}}元</p>
                                            <p>{{item.basket.packing_fee.name}}：{{item.basket.packing_fee.quantity}}个，共{{item.basket.packing_fee.quantity*item.basket.packing_fee.price}}元</p>
                                            <div v-if="item.basket.extra.length==0">无额外费用</div>
                                            <div v-else>额外费用：{{item.basket.extra}}</div>
                                            <p style="color:blue;cursor:pointer" @click="showDetail(item)">订单详情</p>
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
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-wallet"></i> 我的钱包</span>
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
                    <span slot="label"><i class="el-icon-present"></i> 我的优惠</span>
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
                    <span slot="label"><i class="el-icon-trophy"></i> 我的积分</span>
                    <p>当前积分：{{pointNumber}}分</p>
                    <p>积分记录</p>
                    <p>没有任何积分记录哦</p>
                </el-tab-pane>
                <!-- 下载 -->
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-eleme"></i> Eleme小程序</span>
                    <img src='../../assets/app.png'>
                    <p>手机用户请扫码下载APP</p>
                </el-tab-pane>
                <!-- 更多 -->
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-more-outline"></i></span>
                </el-tab-pane>
            </el-tabs>
        </div>
        <transition name="el-fade-in-linear">
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
} from 'src/api/getData'

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
            'userInfo','geohash'
        ]),
    },
    mounted(){
        this.initData();
    },
    methods:{
        ...mapMutations([
            'SAVE_ORDER'
        ]),
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
                })  
                //获取红包数据
                getHongbaoNum(this.userInfo.user_id).then((res) => {
                    this.hongbaoList = res.data
                })
            }
        },
        //订单显示详情页
        showDetail(item){
            this.SAVE_ORDER(item);
            this.$router.push({path:'/profile/orderDetail'});
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
        display: flex;
        margin: 24px auto 0 auto;
        padding: 0 16px;
        max-width: 1000px;
        height: 1000px;
        .profile{
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
            width: 80%;
            .allorder {
                .order_data {
                    display: flex;
                    width:742.39px;
                    background: #fff;
                    height: 90px;
                    border: rgb(220, 223, 230) 1px solid;
                    border-radius: 10px;
                    margin-bottom: 4px;
                    overflow: hidden;
                    .item_left{
                        .restaurant_img{
                            height: 88px;
                            width: 88px;
                            border-radius: 10px;
                            cursor:pointer;
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
        }
    }
</style>
