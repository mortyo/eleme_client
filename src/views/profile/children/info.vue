 <template>
    <div class="info_page">
        <el-tabs class="tabs" type="border-card" tab-position="left">
            <!-- 修改用户名 -->
            <el-tab-pane>
                <span slot="label"><i class="el-icon-user"></i> 用户信息</span>
                <p>当前用户名：{{username}}</p>
                <el-input v-model="resetname" placeholder="请输入新的用户名" clearable style="width:200px"></el-input>
                <el-button type="primary" @click="reset_Name()">确认修改</el-button>
            </el-tab-pane>
            <!-- 修改头像 -->
            <el-tab-pane>
                <span slot="label"><i class="el-icon-s-custom"></i> 头像修改</span>
                <img :src="imgBaseUrl + this.userInfo.avatar" style="width:180px;height:180px;">
                <input type="file" class="profileinfopanel-upload" style="display: block">
                <el-button type="primary" @click="uploadAvatar()">确认上传</el-button>
            </el-tab-pane>
            <!-- 收货地址 -->
            <el-tab-pane>
                <span slot="label"><i class="el-icon-map-location"></i> 收货地址</span>
                <el-button @click="add_address_btn()" type="primary"  size="mini" style="margin-bottom:4px">增加地址</el-button>
                    <!-- 添加地址对话框 -->
                    <el-dialog title="添加地址" :visible.sync="add_address_show" :modal-append-to-body="false">
                        <el-form>
                            收货人<el-input v-model="username" placeholder="名字"></el-input>
                            手机号码<el-input v-model="phone" placeholder="手机号码"></el-input>
                            地址<el-input v-model="addAddress" placeholder="地址"></el-input>
                            详细地址<el-input v-model="detailedaddress" placeholder="详细地址"></el-input>                
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="add_address_show = false">取 消</el-button>
                            <el-button type="primary" @click="add_address_show = false;add_address()">确 定</el-button>
                        </div>
                    </el-dialog>
                <ul>
                    <li v-for="item in addressList" :key="item.id" class="addresslist">
                        <div>
                            <p>地址：{{item.address}}</p>
                            <!-- <p>详细地址：{{item.address_detail}}</p> -->
                            <p>电话：{{item.phone}}</p>
                            <!-- <p>tag:{{item.tag}}</p>
                            <p>创建时间：{{item.created_at}}</p> -->
                        </div>
                        <div>
                            <el-button type="primary" @click="edit_address()" size="mini">编辑</el-button>
                            <el-button slot="reference" type="primary" @click="delete_address(item.id)" size="mini">删除</el-button>
                        </div>
                    </li>
                </ul>
            </el-tab-pane>
            <!-- 修改密码 -->
            <el-tab-pane>
                <span slot="label"><i class="el-icon-unlock"></i> 修改密码</span>
                <form class="restForm">
                    <p v-if="username">当前账号：{{username}}</p>
                    <el-input class="input" v-model="oldPassWord" show-password placeholder="请输入旧密码"></el-input>
                    <el-input class="input" v-model="newPassWord" show-password placeholder="请输入新密码"></el-input>
                    <el-input class="input" v-model="confirmPassWord" show-password placeholder="请确认新密码"></el-input>
                    <div class="captcha">
                        <el-input v-model="captchaCode" maxlength="4" placeholder="验证码"></el-input>
                        <img :src="captchaCodeImg" alt="验证码" @click="getCaptchaCode">
                    </div>
                    <el-button id="resetbtn" type="primary" @click="resetButton">确认修改</el-button>
                </form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {mapState,mapMutations,mapActions} from 'vuex'
    import { 
        changeAvatar, //改变头像
        getAddressList,  //获取收货地址
        postAddAddress,  //增加地址
        deleteAddress,  //删除地址
        getcaptchas,  //获取验证码
        changePassword ,//修改密码
    } from 'src/api/getData'
    import axios from 'axios'
    import {imgBaseUrl} from 'src/config/env'
    import {removeStore} from 'src/config/mUtils'

    export default {
        data(){
            return{
                username:'',    //当前用户名
                resetname:'', //要重置的用户名
                imgBaseUrl,
                //收货地址列表
                addressList: [],  
                add_address_show:false,
                edit_address_show:false,
                phone: '',
                phone_bk:'', //备用手机号
                addAddress: '',
                detailedaddress: '',
                message:'', //信息
                // 修改密码
                OldPassword: '',
                NewPassword: '',
                ConfirmPassword: '',
                CaptchaCode: '',
                captchaCodeImg: ''
            }
        },
        computed:{
            // 使用对象展开运算符将 mapState 混入 computed 对象中
            ...mapState([
                'userInfo','state_Address','geohash'
            ]),
        },
        //生命周期
        created(){
            this.getCaptchaCode()
        },
        mounted(){
            this.getAddress()
        },
        methods: {
            ...mapActions([
                'saveAddress'
            ]),
            //改用户名
            reset_Name(){
                this.$message({
                    showClose: true,
                    message: '没有修改用户名这个接口，等我后面写服务器的时候再加，嘻嘻',
                    type: 'success'
                });
            },
            //改头像
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
                        if (res.status == 1) {
                            this.userInfo.avatar = res.image_path;
                        }
                    }catch (error) {
                        this.$message.error('上传失败，请重新上传');
                        throw new Error(error);
                    }
                }
            },
            // 修改收货地址
            getAddress(){
                this.addressList = this.state_Address.data
            },
            add_address_btn(){
                this.add_address_show = true
            },
            add_address(){
                postAddAddress(
                    this.userInfo.user_id, 
                    this.addAddress, 
                    this.detailedaddress, 
                    this.geohash='geohash', 
                    this.username,
                    this.phone, 
                    this.phone_bk, 
                    0, 1, '公司', 4).then((res) => {
                        console.log(res.data)
                })
            },
            edit_address(){
                alert('没有编辑地址的接口(～﹃～)~zZ')
            },
            delete_address(id){
                this.$confirm('此操作将删除该地址信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then( async () => {
                    await deleteAddress(this.userInfo.user_id,id).then((res) => {
                        console.log(res.data)
                    });
                    this.saveAddress();
                    this.addressList = this.state_Address.data;
                    this.$nextTick(() => {
                        console.log('数据更新了')
                    })
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            //修改密码
            async getCaptchaCode(){
                await getcaptchas().then((res) => {
                    this.captchaCodeImg = res.data.code;
                });
            },
            resetButton(){
                changePassword(this.username, this.OldPassWord, this.NewPassWord, this.ConfirmPassWord, this.CaptchaCode).then((res) => {
                    alert('改密码这个接口貌似不管用。。。')
                });
            },
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

    .info_page{
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f2f2f2;
        z-index: 2;
        .tabs {
            margin: 24px auto 0 auto;
            max-width: 980px;
            height: 600px;
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
            .addresslist {
                display: flex;
                justify-content:space-between;
                padding: 4px;
                margin-bottom: 4px;
                border: #d8dee2 1px solid;
                border-radius: 5px;
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
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
