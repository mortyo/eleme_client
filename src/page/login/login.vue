<template>
    <div class="container">
        <form class="loginForm">
            <label for="account">请输入账号</label>
            <el-input id="account" class="input" tabindex="1" v-model.lazy="userAccount" prefix-icon="el-icon-user" placeholder="账号" clearable autofocus></el-input>
            <label for="password">请输入密码</label>
            <router-link to="/forget" class="forget">忘记密码？</router-link>
            <el-input id="password" class="input" tabindex="2" v-model="passWord" prefix-icon="el-icon-lock" placeholder="密码" show-password></el-input>
            <div class="captchaCode">
                <el-input v-model="codeNumber" class="code_input" tabindex="3" placeholder="验证码"></el-input>
                <img v-show="captchaCodeImg" :src="captchaCodeImg" @click="getCaptchaCode">
                <p @click="getCaptchaCode">换一张</p>
            </div>
            <el-button ba type="primary" id="login" tabindex="4" round @click="Login">登录</el-button>
        </form>
        <p class="login_tips">
            Tip：未注册过的账号，登录时将自动注册，注册过的用户可凭账号密码登录
        </p>
    </div>
</template>

<script>
    import { mapState,mapMutations } from 'vuex'
    import { getcaptchas, accountLogin } from '../../service/getData'

    export default {
        data(){
            return {
                userInfoList: null, //获取到的用户信息
                userAccount: null, //用户名
                passWord: null, //密码
                captchaCodeImg: null, //验证码地址
                codeNumber: null, //验证码
            }
        },
        computed:{
            ...mapState([
                'userInfo'
            ])
        },
        created(){
            this.getCaptchaCode();
        },
        mounted(){
            if(this.userInfo&&this.userInfo.user_id){
                this.$router.push('/profile')   //当有用户登录时跳转到profile页面
            }
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
                    //element 消息提示
                    this.$message({
                        type: 'warning',
                        showClose: true,
                        message: '请输入：用户名 👇👇👇'
                    });
                    return  //重新开始
                }else if(!this.passWord){
                    this.$message({
                        type: 'warning',
                        showClose: true,
                        message: '请输入：密码 👇👇👇'
                    });
                    return
                }else if(!this.codeNumber){
                    this.$message({
                        type: 'warning',
                        showClose: true,
                        message: '请输入：验证码 👇👇👇'
                    });
                    return
                }
                //用户名登录
                let res = await accountLogin(this.userAccount, this.passWord, this.codeNumber);
                this.userInfoList = res.data
                console.log(res.data)
                //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
                if (!this.userInfoList.user_id) {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: this.userInfoList.message
                    });
                    this.getCaptchaCode();
                }else{
                    this.$message({
                        type: 'success',
                        showClose: true,
                        message: '密码正确，登录成功！',
                    });
                    this.RECORD_USERINFO(this.userInfoList);
                    this.$router.go(-1);
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    .loginForm{
        background-color: #fff;
        width: 300px;
        padding: 25px;
        border: #d8dee2 solid 1px;
        border-radius: 5px;
        margin: 60px auto;
        label {
            margin: 5px;
        }
        .input {
            display: block;
            width: 300px;
        }
        .forget{
            @include sc(.6rem, #3b95e9);
        }
        .captchaCode {
            width: 300px;
            height: 40px;
            margin-top: 21px;
            .code_input {
                width: 100px;
                position: relative;
                top: -15px;
            }
            img {
                height: 40px;
                cursor: pointer;
            }
            p {
                color:  #3b95e9;
                float: right;
                line-height: 200%;
                cursor: pointer;
            }
        }
        #login {
            margin-top: 21px;
            width: 100%;
        }
    }
    .login_tips{
        text-align: center;
        color: #E6A23C;
    }
</style>
