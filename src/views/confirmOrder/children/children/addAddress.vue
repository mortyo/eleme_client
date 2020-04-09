 <template>
    <div class="address_page">
        <div class="main">
            <el-form :model="addForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="收货人">
                    <el-input v-model="addForm.name" placeholder="收货人名字"></el-input>
                    <el-radio v-model="addForm.sex" label=1>先生</el-radio>
                    <el-radio v-model="addForm.sex" label=2>女士</el-radio>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model.number="addForm.phone" placeholder="手机号码"></el-input>
                </el-form-item>
                <el-form-item label="备用号码">
                    <el-input v-model.number="addForm.alternatePhoneNumber" placeholder="备用手机号码（可不填）"></el-input>             
                </el-form-item>
                <el-form-item label="送餐地址">
                    <router-link to="/confirmOrder/chooseAddress/addAddress/searchAddress">
                        <el-input v-model="searchAddress" placeholder="小区/写字楼/学校等"></el-input>
                    </router-link>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="addForm.address_detail" placeholder="详细地址（如门牌号等）"></el-input>
                </el-form-item>
                <el-form-item label="标签">
                    <el-select v-model="addForm.tag" placeholder="请选择标签">
                        <el-option label="无" value="无"></el-option>
                        <el-option label="家" value="家"></el-option>
                        <el-option label="学校" value="学校"></el-option>
                        <el-option label="公司" value="公司"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addAddress()">添加</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    import { postAddAddress } from 'src/api/getData'
    export default {
      data(){
            return{
                addForm: {
                    name: null, //姓名
                    phone: null, //电话
                    alternatePhoneNumber: '', //备注电话
                    address_detail: null, //详细地址
                    sex: null, //性别,1是男，2是女
                    tag: '', //备注
                    tag_type: 1, //备注类型
                },
            }
        },
        computed: {
            ...mapState([
                'searchAddress', 'geohash', 'userInfo',
            ]),
        },
        methods: {
            ...mapMutations([
                'CONFIRM_ADDRESS'
            ]),
            //保存地址信息
            async addAddress(){
                if (!(this.userInfo && this.userInfo.user_id)) {
                    this.$message({
                        showClose: true,
                        message: '请登录',
                        type: 'warning'
                    })
                }else if(!this.addForm.name){
                    this.$message({
                        showClose: true,
                        message: '请输入收货人名字',
                        type: 'warning'
                    })
                }else if(!this.addForm.phone){
                    this.$message({
                        showClose: true,
                        message: '请输入电话号码',
                        type: 'warning'
                    })
                }else if(!this.addForm.searchAddress){
                    this.$message({
                        showClose: true,
                        message: '请输入收货地址',
                        type: 'warning'
                    })
                }else if(!this.addForm.address_detail){
                    this.$message({
                        showClose: true,
                        message: '请输入详细地址',
                        type: 'warning'
                    })
                }
                if (this.addForm.tag == '家') {
                    this.addForm.tag_type = 2;
                }else if(this.addForm.tag == '学校'){
                    this.addForm.tag_type = 3;
                }else if(this.addForm.tag == '公司'){
                    this.addForm.tag_type = 4;
                }
                postAddAddress(
                    this.userInfo.user_id, 
                    this.searchAddress, 
                    this.addForm.address_detail, 
                    this.geohash, 
                    this.addForm.name, 
                    this.addForm.phone, 
                    this.addForm.anntherPhoneNumber, 
                    0, 
                    this.addForm.sex, 
                    this.addForm.tag, 
                    this.addForm.tag_type
                ).then((res) => {
                    //保存成功返沪上一页，否则弹出提示框
                    if (res.data.message) {
                        this.$message({
                            showClose: true,
                            message: res.message,
                            type: 'error'
                        })
                    }else {
                        this.$message({
                            showClose: true,
                            message: res.success,
                            type: 'success'
                        })
                        this.CONFIRM_ADDRESS(1);
                        this.$router.go('/confirmOrder/chooseAddress');
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .address_page{
        margin-top: 84px;
        display: flex;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 204;
        .main {
            width: 600px;
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
