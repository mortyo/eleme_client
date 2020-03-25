<template>
    <div class="profile_page">
        <head-top go-back='true' :head-title="profiletitle"></head-top>

        <section class="profile-number">
            <router-link :to="userInfo&&userInfo.user_id? '/profile/info' : '/login'" class="profile-link">
                <img :src="imgBaseUrl + userInfo.avatar" class="privateImage" v-if="userInfo&&userInfo.user_id">
                <div class="user-info">
                    <p>{{username}}</p>
                    <p>
                        <i class="el-icon-phone-outline"></i>
                        <span class="icon-mobile-number">{{mobile}}</span>
                    </p>
                </div>
            </router-link>
        </section>
        
        <section class="info-data">
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
import headTop from 'src/components/header/head'
import {mapState, mapMutations} from 'vuex'
import {imgBaseUrl} from 'src/config/env'
import {getImgPath} from 'src/components/common/mixin'

export default {
    components:{
        headTop,
    },
    mixins: [getImgPath],
    data(){
        return{
            profiletitle: '我的',
            username: '登录/注册',           //用户名
            resetname: '',
            mobile: '暂无绑定手机号',             //电话号码
            balance: 0,            //我的余额
            count : 0,             //优惠券个数
            pointNumber : 0,       //积分数
            avatar: '',             //头像地址
            imgBaseUrl,
        }
    },
    computed:{
        ...mapState([
            'userInfo',
        ]),
        //后台会返回两种头像地址格式，分别处理
        // imgpath:function () {
        //     let path;
        //     if(this.avatar.indexOf('/') !==-1){
        //         path = imgBaseUrl +　this.avatar;
        //     }else{
        //         path = this.getImgPath(this.avatar)
        //     }
        //     this.SAVE_AVANDER(path);
        //     return path;
        // }
    },
    mounted(){
        this.initData();
    },
    methods:{
        ...mapMutations([
            'SAVE_AVANDER'
        ]),
        initData(){
            if (this.userInfo && this.userInfo.user_id) {
                this.avatar = this.userInfo.avatar;
                this.username = this.userInfo.username;
                this.mobile = this.userInfo.mobile || '暂无绑定手机号';
                this.balance = this.userInfo.balance;
                this.count = this.userInfo.gift_amount;
                this.pointNumber = this.userInfo.point;
            }else{
                this.username = '登录/注册';
                this.mobile = '暂无绑定手机号';
            }
        },
    },
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
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
        .profile-number{
            margin: 0 20%;
            .profile-link{
                display:block;
                display:flex;
                box-align: center;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                background:#545c64;
                padding: .666667rem .6rem;
                .privateImage{
                    display:inline-block;
                    @include wh(2.5rem,2.5rem);
                    border-radius:50%;
                    vertical-align:middle;
                    .privateImage-svg{
                        background:$fc;
                        border-radius:50%;
                        @include wh(2.5rem,2.5rem);
                    }
                }
                .user-info{
                    margin-left:.48rem;
                    -webkit-box-flex: 1;
                    -ms-flex-positive: 1;
                    flex-grow: 1;
                    p{
                        font-weight:700;
                        @include sc(.8rem,$fc);
                        .user-icon{
                            @include wh(0.5rem,0.75rem);
                            display:inline-block;
                            vertical-align:middle;
                            line-height:0.75rem;
                            .icon-mobile{
                                @include wh(100%,100%);
                            }
                        }
                        .icon-mobile-number{
                            display:inline-block;
                            @include sc(.57333rem,$fc);

                        }
                    }

                }
                .arrow{
                    @include wh(.46667rem,.98rem);
                    display:inline-block;
                    svg{
                    @include wh(100%,100%);
                    }
                }
            }
        }
        .info-data{
            margin: 0 20%;
            background:$fc;
            box-sizing: border-box;
            ul{
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
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
