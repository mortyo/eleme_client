<template>
    <header id='head_top'>
        <el-menu class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">
            <el-menu-item index="首页" @click = "gotoAddress({path: '/msite', query: {geohash}})" class="guide_item">首页</el-menu-item>
            <el-menu-item index="搜索" @click = "gotoAddress({path: `/search/${geohash}`})" class="guide_item">搜索</el-menu-item>
            <el-menu-item index="订单" @click = "gotoAddress('/order')" class="guide_item">订单</el-menu-item>
            <el-menu-item index="我的" @click = "gotoAddress('/profile')" class="guide_item">我的</el-menu-item>
            <!-- 所有插槽 -->
            <slot name='search'></slot>
            <slot name="edit"></slot>
            <slot name="changecity"></slot>
            <slot name="changeLogin"></slot>
            <slot name="shop"></slot>
            <!-- 显示登录or个人中心 -->
            <router-link :to="userInfo? '/profile':'/login'" class="head_login">
                <el-avatar :src="imgBaseUrl + userInfo.avatar" v-if="userInfo"></el-avatar>
                <span class="login_span" v-else>登录|注册</span>
            </router-link>
            
        </el-menu>
    </header>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import { imgBaseUrl } from 'src/config/env'
    export default {
        data(){
            return{
                activeIndex: '1',
                imgBaseUrl
            }
        },
        props: ['signinUp', 'headTitle', 'goBack'], //来自于父组件的数据
        mounted(){
            //获取用户信息
            this.getUserInfo();
        },
        computed: {
            ...mapState([
                'userInfo',
                'geohash'
            ]),
        },
        methods: {
            ...mapActions([
                'getUserInfo'
            ]),
            gotoAddress(path){
        		this.$router.push(path)
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        },

    }

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';

    #head_top{
        height: 100px;
        left: 0;
        top: 0;
        @include wh(100%, 60px);  //宽高
    }
    .head_goback{
        left: 0.4rem;
        @include wh(60px, 60px);
        line-height: 2.2rem;
        margin-left: .4rem;
    }
    .head_login{
        right: 0.55rem;
        @include sc(0.65rem, #fff); //字体大小，颜色
        @include ct;    //定位上下居中
        .login_span{
            color: #fff;
        }
    }
    .title_head{
        @include center;
        width: 50%;
        color: #fff;
        text-align: center;
        .title_text{
            @include sc(0.8rem, #fff);
            text-align: center;
            font-weight: bold;
        }
    }
</style>
