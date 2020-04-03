<template>
    <div class="restContainer">
        <form class="restForm">
            <el-input v-model="phoneNumber" maxlength="11" clearable placeholder="请输入要更改密码的账号"></el-input>
            <el-input v-model="oldPassWord" show-password placeholder="请输入旧密码"></el-input>
            <el-input v-model="newPassWord" show-password placeholder="请输入新密码"></el-input>
            <el-input v-model="confirmPassWord" show-password placeholder="请确认新密码"></el-input>
            <div>
                <el-input v-model="mobileCode" maxlength="4" placeholder="验证码"></el-input>
                <img :src="captchaCodeImg" alt="验证码" @click="getCaptchaCode">
            </div>
        </form>
        <el-button class="login_container" type="primary" @click="resetButton">确认修改</el-button>
    </div>
</template>

<script>
    import { getcaptchas, changePassword } from 'src/service/getData'

    export default {
        data(){
            return {
                phoneNumber: null, //电话号码
                oldPassWord: null,
                newPassWord: null, //新密码
                rightPhoneNumber: false, //输入的手机号码是否符合要求
                confirmPassWord: null, //确认密码
                captchaCodeImg: null, //验证码地址
                mobileCode: null, //短信验证码
                computedTime: 0, //倒数记时
                showAlert: false, //显示提示组件
                alertText: null, //提示的内容
                accountType: 'mobile',//注册方式
            }
        },
        created(){
            this.getCaptchaCode()
        },
        methods: {
            async getCaptchaCode(){
                let res = await getcaptchas();
                this.captchaCodeImg = res.data.code;
            },
            //重置密码
            async resetButton(){
                if (!this.phoneNumber) {
                    this.showAlert = true;
                    this.alertText = '请输入正确的账号';
                    return
                }else if(!this.oldPassWord){
                    this.showAlert = true;
                    this.alertText = '请输入旧密码';
                    return
                }else if(!this.newPassWord){
                    this.showAlert = true;
                    this.alertText = '请输入新密码';
                    return
                }else if(!this.confirmPassWord){
                    this.showAlert = true;
                    this.alertText = '请输确认密码';
                    return
                }else if(this.newPassWord !== this.confirmPassWord){
                    this.showAlert = true;
                    this.alertText = '两次输入的密码不一致';
                    return
                }else if(!this.mobileCode){
                    this.showAlert = true;
                    this.alertText = '请输验证码';
                    return
                }
                // 发送重置信息
                let res = await changePassword(this.phoneNumber, this.oldPassWord, this.newPassWord, this.confirmPassWord, this.mobileCode);
                console.log(res)
                if (res.message) {
                    this.showAlert = true;
                    this.alertText = res.message;
                    this.getCaptchaCode()
                    console.log(res.message)
                    return
                }else{
                    this.showAlert = true;
                    this.alertText = '密码修改成功';
                }
            }  
        }
    }

</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .restForm{
        background-color: #fff;
        margin:0 20%;
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
        .phone_number{
            padding: .3rem .8rem;
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
    .login_container{
        margin: 0 20%;
    }
</style>
