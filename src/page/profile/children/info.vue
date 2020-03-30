 <template>
    <div class="rating_page">
        <head-top head-title="账户信息" go-back='true'></head-top>

        <el-tabs class="tabs" type="border-card" tab-position="left">
            <el-tab-pane>
                <span slot="label"><i class="el-icon-user"></i> 用户信息</span>
                <p>当前用户名：{{username}}</p>
                <el-input v-model="resetname" placeholder="请输入新的用户名" clearable style="width:200px"></el-input>
                <el-button type="primary" @click="resetName3()">确认修改</el-button>
            </el-tab-pane>
            <el-tab-pane class="avatar">
                <span slot="label"><i class="el-icon-s-custom"></i> 头像修改</span>
                <img :src="imgBaseUrl + userInfo.avatar" style="width:180px;height:180px;">
                <input type="file" class="profileinfopanel-upload" style="display: block">
                <el-button type="primary" @click="uploadAvatar()">确认上传</el-button>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-map-location"></i> 收货地址</span>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-unlock"></i> 修改密码</span>
            </el-tab-pane>
        </el-tabs>



        <!-- 主要信息 -->
        <section class="profile-info">
            <router-link to="/profile/info/address" class="info-router">
                <section class="headportrait">
                    <h4>收货地址</h4>
                    <p>修改</p>
                </section>
            </router-link>

            <router-link to="/forget" class="info-router">
                <section class="headportrait">
                    <h4>登录密码</h4>
                    <p>修改</p>
                </section>
            </router-link>

            <el-button class="exitlogin" type="danger" @click="exitlogin">退出登录</el-button>
        </section>
        <!-- 确认退出登录 -->
        
        <section class="coverpart" v-if="show">
            <section class="cover-background"></section>
            <section class="cover-content " :class="{'cover-animate' : isEnter, 'cover-animate-leave' : isLeave}">
                <div class="sa-icon">
                    <span class="sa-body"></span>
                    <span class="sa-dot"></span>
                </div>
                <h2>是否退出登录</h2>
                <div class="sa-botton">
                    <button class="waiting" @click="waitingThing">再等等</button>
                    <div style="display:inline-block;">
                        <button class="quitlogin"  @click="outLogin">退出登录</button>
                    </div>
                </div>
            </section>
        </section>

        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import alertTip from 'src/components/common/alertTip'

    import {mapMutations, mapState} from 'vuex'
    import { 
        signout,
        changeAvatar
    } from 'src/service/getData'
    import axios from 'axios'
    import {imgBaseUrl} from 'src/config/env'
    import {removeStore} from 'src/config/mUtils'

    export default {
        components: {
            headTop,
            alertTip,
        },
        data(){
            return{
                username:'',    //用户名
                resetname:'', //重置用户名
                avatar:'',      //用户头像
                show:false,     //显示提示框
                isEnter:true,  //是否登录
                isLeave:false, //是否退出
                showAlert: false,
                alertText: null,
                imgBaseUrl,
                imageUrl: ''
            }
        },
        computed:{
            ...mapState([
                'userInfo', 'imgPath'
            ]),
        },
        beforeDestroy(){
            clearTimeout(this.timer)
        },
        methods: {
            ...mapMutations([
                'OUT_LOGIN', 'SAVE_AVANDER'
            ]),
            resetName3(){
                this.$message({
                    showClose: true,
                    message: '没有修改用户名这个接口，等我后面写服务器的时候再加，嘻嘻',
                    type: 'success'
                });
            },
            exitlogin(){
                this.show=true;
                this.isEnter=true;
                this.isLeave=false;
            },
            //取消退出
            waitingThing(){
                clearTimeout(this.timer)
                this.isEnter=false;
                this.isLeave=true;
                this.timer = setTimeout(() =>{
                    clearTimeout(this.timer)
                    this.show=false;
                },200)
            },
            //退出登录
            async outLogin(){
                this.OUT_LOGIN();
                this.waitingThing();
                this.$router.go(-1);
                removeStore('user_id')
                await signout().then(()=>{
                    window.location.reload()
                });
            },
            async uploadAvatar(){
                //上传头像
                if (this.userInfo) {
                    let input = document.querySelector('.profileinfopanel-upload')
                    let data = new FormData();
                    data.append('file', input.files[0]);
                    try{
                        //上传到服务器
                        let response = await changeAvatar(this.userInfo.user_id,data)
                        //解析响应成json格式
                        let res = await response.json();
                        console.log(res)
                        if (res.status == 1) {
                            this.userInfo.avatar = res.image_path;
                        }
                    }catch (error) {
                        this.$message.error('上传失败，请重新上传');
                        throw new Error(error);
                    }
                }
            }
        },
        watch: {
            userInfo: function (value) {
                if (value && value.user_id) {
                    this.username = value.username;
                    this.avatar = value.avatar;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin.scss';

    .rating_page{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f2f2f2;
        z-index: 202;
        .tabs {
            margin: 24px auto 0 auto;
            max-width: 980px;
            height: 600px;
            .avatar {

            }
        }
    }
    .profile-info{
        margin: 0 35%;
        
        .headportrait{
            padding:.5rem .4rem;
            @include fj(space-between);         
            align-items:center;
            border-top:1px solid #ddd;
            background:#fff;
            .profileinfopanel-upload{
                opacity: 0.9;
                @include wh(auto,100%);
            }
        }
        .exitlogin{
            width:100%;
            margin:1.3rem auto 0;
            @include sc(.8rem,#fff);
        }
    }
    .info-router{
        display:block;
    }
    .coverpart{
        @include wh(100%,100%);
        @include allcover;
        .cover-background{
            @include wh(100%,100%);
            @include allcover;
            background:#000;
            z-index:100;
            opacity:.2;
        }
        .cover-content{
            width:60%;
            background:$fc;
            padding:17px;
            position:absolute;
            top:20%;
            left: 20%;
            z-index:1000;
            @include borderRadius(5px);
            .sa-icon{
                @include wh(90px,90px);
                border:4px solid #f8bb86;
                @include borderRadius(50%);
                margin:20px auto;
                position:relative;
                .sa-body{
                    @include wh(5px,47px);
                    @include borderRadius(2px);
                    background:#f8bb86;
                    @include cl;
                    top:10px;
                }
                .sa-dot{
                    @include wh(7px,7px);
                    @include borderRadius(50%);
                    background:#f8bb86;
                    @include cl;
                    bottom:10px;
                }
            }
            h2{
                width:100%;
                text-align:center;
                @include sc(30px,#575757);
                font-weight:500;
                margin:25px 0;
            }
            .sa-botton{
                width:100%;
                text-align:center;

                button{
                    display:inline-block;
                    padding:.4rem 1rem;
                    @include borderRadius(5px);
                    @include sc(.6rem,$fc);
                    letter-spacing:1px;
                    margin-top:26px;
                }
                .waiting{
                    background:#C1C1C1;
                    margin-right:.4rem;
                }
                .quitlogin{
                    background:rgb(221, 107, 85);
                }
            }

        }
    }
    @-webkit-keyframes bounceIn {
    from, 20%, 40%, 60%, 80%, 100% {
        -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }

    0% {
        opacity: 0;
        -webkit-transform: scale3d(.3, .3, .3);
        transform: scale3d(.3, .3, .3);
    }

    20% {
        -webkit-transform: scale3d(1.1, 1.1, 1.1);
        transform: scale3d(1.1, 1.1, 1.1);
    }

    40% {
        -webkit-transform: scale3d(.9, .9, .9);
        transform: scale3d(.9, .9, .9);
    }

    60% {
        opacity: 1;
        -webkit-transform: scale3d(1.03, 1.03, 1.03);
        transform: scale3d(1.03, 1.03, 1.03);
    }

    80% {
        -webkit-transform: scale3d(.97, .97, .97);
        transform: scale3d(.97, .97, .97);
    }

    100% {
        opacity: 1;
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
}

@keyframes bounceIn {
    from, 20%, 40%, 60%, 80%, 100% {
        -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }

    0% {
        opacity: 0;
        -webkit-transform: scale3d(.3, .3, .3);
        transform: scale3d(.3, .3, .3);
    }

    20% {
        -webkit-transform: scale3d(1.1, 1.1, 1.1);
        transform: scale3d(1.1, 1.1, 1.1);
    }

    40% {
        -webkit-transform: scale3d(.9, .9, .9);
        transform: scale3d(.9, .9, .9);
    }

    60% {
        opacity: 1;
        -webkit-transform: scale3d(1.03, 1.03, 1.03);
        transform: scale3d(1.03, 1.03, 1.03);
    }

    80% {
        -webkit-transform: scale3d(.97, .97, .97);
        transform: scale3d(.97, .97, .97);
    }

    100% {
        opacity: 1;
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
}
@-webkit-keyframes zoomOut {
    from {
        opacity: 1;
    }

    50% {
        opacity: 0;
        -webkit-transform: scale3d(.3, .3, .3);
        transform: scale3d(.3, .3, .3);
    }

    100% {
        opacity: 0;
    }
}

@keyframes zoomOut {
    from {
        opacity: 1;
    }

    50% {
        opacity: 0;
        -webkit-transform: scale3d(.3, .3, .3);
        transform: scale3d(.3, .3, .3);
    }

    100% {
        opacity: 0;
    }
}
body .coverpart .cover-animate{
    transition:all 1s;
    animation:bounceIn .6s;
}
body .coverpart .cover-animate-leave{
    animation:zoomOut .4s;
}
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
}
</style>
