<template>
    <div class="loginContainer">
        <head-top :head-title="'密码登录'" goBack="true"></head-top>
        <div class="container">
            <form class="loginForm">
                <el-input v-model.lazy="userAccount" placeholder="账号" clearable></el-input>
                <el-input v-model="passWord" placeholder="密码" show-password></el-input>
                <el-input v-model="codeNumber" placeholder="验证码"></el-input>
                <div class="img_change_img">
                    <img v-show="captchaCodeImg" :src="captchaCodeImg">
                    <div class="change_img" @click="getCaptchaCode">
                        <p>看不清</p>
                        <p>换一张</p>
                    </div>
                </div>
            </form>
            <p class="login_tips">
                温馨提示：未注册过的账号，登录时将自动注册
            </p>
            <p class="login_tips">
                注册过的用户可凭账号密码登录
            </p>
            <el-button type="primary" @click="Login">登录</el-button>
            <router-link to="/forget" class="to_forget">重置密码？</router-link>

            <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
        </div>
    </div>
</template>

<script>
    import headTop from '../../components/header/head'
    import alertTip from '../../components/common/alertTip'
    import { mapMutations } from 'vuex'
    import { getcaptchas, accountLogin } from '../../service/getData'

    export default {
        data(){
            return {
                userInfo: null, //获取到的用户信息
                userAccount: null, //用户名
                passWord: null, //密码
                captchaCodeImg: null, //验证码地址
                codeNumber: null, //验证码
                showAlert: false, //显示提示组件
                alertText: null, //提示的内容
            }
        },
        created(){
            this.getCaptchaCode();
        },
        components: {
            headTop,
            alertTip,
        },
        methods: {
            ...mapMutations([
                'RECORD_USERINFO',
            ]),
            //获取验证吗，线上环境使用固定的图片，生产环境使用真实的验证码
            async getCaptchaCode(){
                let res = await getcaptchas();
                this.captchaCodeImg = res.data.code;
            },
            //发送登录信息
            async Login(){
                if (!this.userAccount) {
                    this.showAlert = true;
                    this.alertText = '请输入手机号/邮箱/用户名';
                    return
                }else if(!this.passWord){
                    this.showAlert = true;
                    this.alertText = '请输入密码';
                    return
                }else if(!this.codeNumber){
                    this.showAlert = true;
                    this.alertText = '请输入验证码';
                    return
                }
                //用户名登录
                let res = await accountLogin(this.userAccount, this.passWord, this.codeNumber);
                this.userInfo = res.data
                
                //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
                if (!this.userInfo.user_id) {
                    this.showAlert = true;
                    this.alertText = this.userInfo.message;
                    if (!this.loginWay) this.getCaptchaCode();
                }else{
                    this.RECORD_USERINFO(this.userInfo);
                    this.$router.go(-1);

                }
            },
            closeTip(){
                this.showAlert = false;
            }
        }
    }

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    .container{
        text-align: center;
        margin: 0 40%
    }
    .loginForm{
        background-color: #fff;
        margin-top: .6rem;
        .input_container{
            display: flex;
            justify-content: space-between;
            padding: .6rem .8rem;
            border-bottom: 1px solid #f1f1f1;
            input{
                @include sc(.7rem, #666);
            }
            button{
                @include sc(.65rem, #fff);
                font-family: Helvetica Neue,Tahoma,Arial;
                padding: .28rem .4rem;
                border: 1px;
                border-radius: 0.15rem;
            }
            .right_phone_number{
                background-color: #4cd964;
            }
        }
        .captcha_code_container{
            height: 2.2rem;
            .img_change_img{
                display: flex;
                align-items: center;
                img{
                    @include wh(3.5rem, 1.5rem);
                    margin-right: .2rem;
                }
                .change_img{
                    display: flex;
                    flex-direction: 'column';
                    flex-wrap: wrap;
                    width: 2rem;
                    justify-content: center;
                    p{
                        @include sc(.55rem, #666);
                    }
                    p:nth-of-type(2){
                        color: #3b95e9;
                        margin-top: .2rem;
                    }
                }
            }
        }
    }
    .login_tips{
        @include sc(.5rem, red);
        padding: .4rem .6rem;
        line-height: .5rem;
        a{
            color: #3b95e9;
        }
    }
    .to_forget{
        @include sc(.6rem, #3b95e9);
        margin-right: .3rem;
    }
</style>
