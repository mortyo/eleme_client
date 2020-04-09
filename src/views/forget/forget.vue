<template>
    <div>
        <form class="restForm">
            <el-input class="input" v-model="username" maxlength="11" clearable autofocus placeholder="请输入要更改密码的账号"></el-input>
            <el-input class="input" v-model="oldPassWord" show-password placeholder="请输入旧密码"></el-input>
            <el-input class="input" v-model="newPassWord" show-password placeholder="请输入新密码"></el-input>
            <el-input class="input" v-model="confirmPassWord" show-password placeholder="请确认新密码"></el-input>
            <div class="captcha">
                <el-input v-model="captchaCode" maxlength="4" placeholder="验证码"></el-input>
                <img :src="captchaCodeImg" alt="验证码" @click="getCaptchaCode">
            </div>
            <el-button id="resetbtn" type="primary" @click="resetButton">确认修改</el-button>
        </form>
    </div>
</template>

<script>
    import { getcaptchas, changePassword } from 'src/api/getData'

    export default {
        data(){
            return {
                username: null, //电话号码
                oldPassWord: null,
                newPassWord: null, //新密码
                confirmPassWord: null, //确认密码
                captchaCodeImg: null, //验证码地址
                captchaCode: null, //验证码
            }
        },
        created(){
            this.getCaptchaCode()
        },
        methods: {
            async getCaptchaCode(){
                await getcaptchas().then((res) => {
                    this.captchaCodeImg = res.data.code;
                });
            },
            //重置密码
            async resetButton(){
                if (!this.username) {
                    this.$message({
                        showClose: true,
                        message: '账号为空，请输入帐号',
                        type: 'warning'
                    });
                    return
                }else if(!this.oldPassWord){
                    this.$message({
                        showClose: true,
                        message: '旧密码为空，请输入旧密码',
                        type: 'warning'
                    });
                    return
                }else if(!this.newPassWord){
                    this.$message({
                        showClose: true,
                        message: '新密码为空，请输入新密码',
                        type: 'warning'
                    });
                    return
                }else if(!this.confirmPassWord){
                    this.$message({
                        showClose: true,
                        message: '确认为空，请输入确认密码',
                        type: 'warning'
                    });
                    return
                }else if(this.newPassWord !== this.confirmPassWord){
                    this.$message({
                        showClose: true,
                        message: '两次密码不一样，请输入正确的密码',
                        type: 'warning'
                    });
                    return
                }else if(!this.captchaCode){
                    this.$message({
                        showClose: true,
                        message: '验证码为空，请输入验证码',
                        type: 'warning'
                    });
                    return
                }
                // 发送重置信息
                await changePassword(this.username, this.oldPassWord, this.newPassWord, this.confirmPassWord, this.captchaCode).then((res) => {
                    if (res.message) {
                        this.$message({
                            showClose: true,
                            message: res.message,
                            type: 'warning'
                        })
                        this.getCaptchaCode()
                        return
                    }else{
                        this.$message({
                            showClose: true,
                            message: '修改成功，页面跳转中...',
                            type: 'success'
                        });
                        this.$router.push('/login').catch(err => {
                            console.log('输出报错',err)
                        });
                    }
                })
            }  
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    .restForm{
        background-color: #fff;
        width: 300px;
        padding: 25px;
        border: #d8dee2 solid 1px;
        border-radius: 5px;
        margin: 60px auto;
        .input {
            margin-bottom: 8px;
        }
        .captcha {
            display: flex;
            margin-bottom: 8px;
            img {
                margin: 0 16px;
                cursor: pointer;
            }
        }
        #resetbtn {
            width: 100%;
        }
    }
</style>
