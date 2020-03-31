<template>
    <header id='head_top'>
        <el-menu class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">
            <el-menu-item index="首页" @click = "gotoAddress({path: '/msite', query: {geohash}})" class="guide_item">首页</el-menu-item>
            <el-menu-item index="搜索" @click = "gotoAddress({path: `/search/${geohash}`})" class="guide_item">搜索</el-menu-item>
            <el-menu-item index="订单" @click = "gotoAddress('/order')" class="guide_item">订单</el-menu-item>
            <el-menu-item index="我的" @click = "gotoAddress('/profile')" class="guide_item">我的</el-menu-item>
            <el-submenu index="profile" style="float:right" v-if="userInfo">
                <template slot="title"><el-avatar :src="imgBaseUrl + userInfo.avatar"></el-avatar></template>
                <el-menu-item index="2-1" @click = "gotoAddress('/profile')">个人中心</el-menu-item>
                <el-menu-item index="2-2" @click = "gotoAddress('/profile/info')">账号设置</el-menu-item>
                <el-menu-item index="2-3" @click="showDialog()">退出</el-menu-item>
            </el-submenu>
            <el-menu-item index="login" style="float:right" v-else>
                <router-link :to="'/login'">
                    <span class="title_head">登录|注册</span>
                </router-link>
            </el-menu-item>
            
            <!-- 所有插槽 -->
            <slot name='search'></slot>
            <slot name="edit"></slot>
            <slot name="changecity"></slot>
            <slot name="changeLogin"></slot>
            <slot name="shop"></slot>
            <!-- 显示登录or个人中心 -->
        </el-menu>
        <!-- 退出登录提示框 -->
        <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
            <span>确定退出吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="centerDialogVisible = false;logout();" round>确 定</el-button>
                <el-button @click="centerDialogVisible = false" round>取 消</el-button>
            </span>
        </el-dialog>
    </header>
</template>

<script>
    import { mapState, mapActions,mapMutations} from 'vuex'
    import { imgBaseUrl } from 'src/config/env'
    import { removeStore } from 'src/config/mUtils'
    import { signout } from 'src/service/getData.js'

    export default {
        data(){
            return{
                activeIndex: '1',
                imgBaseUrl,
                centerDialogVisible: false
            }
        },
        props: ['signinUp', 'headTitle', 'goBack'], //来自于父组件的数据
        async mounted(){
            //获取用户信息
            await this.getUserInfo();
            //保存收货地址
            this.saveAddress();
        },
        computed: {
            ...mapState([
                'userInfo',
                'geohash'
            ]),
        },
        methods: {
            ...mapMutations([
                'OUT_LOGIN'
            ]),
            ...mapActions([
                'getUserInfo',
                'saveAddress'
            ]),
            gotoAddress(path){
        		this.$router.push(path)
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            showDialog(){
                this.centerDialogVisible = true;
            },
            async logout(){
                this.OUT_LOGIN();
                removeStore('user_id')
                await signout().then(()=>{
                    window.location.reload()
                });
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
