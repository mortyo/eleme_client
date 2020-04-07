 <template>
    <div class="address_page">
        <div class="main">
            <el-form :model="addForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="收货人">
                    <el-input v-model="addForm.name" placeholder="收货人名字"></el-input>
                    <el-radio-group v-model="addForm.sex">
                        <el-radio label="先生"></el-radio>
                        <el-radio label="女士"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model.number="addForm.phone" placeholder="手机号码"></el-input>
                </el-form-item>
                <el-form-item label="备用号码">
                    <el-input v-model.number="addForm.alternatePhoneNumber" placeholder="备用手机号码（可不填）"></el-input>
                </el-form-item>
                <el-form-item label="送餐地址">
                    <el-input v-model="addForm.name" placeholder="小区/写字楼/学校等"></el-input>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="addForm.name" placeholder="详细地址（如门牌号等）"></el-input>
                </el-form-item>
                <el-form-item label="标签">
                    <el-select v-model="addForm.tag" placeholder="请选择活动区域">
                        <el-option label="无" value="none"></el-option>
                        <el-option label="家" value="home"></el-option>
                        <el-option label="学校" value="school"></el-option>
                        <el-option label="公司" value="company"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">添加</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
            
            <section class="page_text_container">
                <section class="section_list">
                    <span class="section_left">联系人</span>
                    <section class="section_right">
                        <input type="text" name="name" placeholder="你的名字" v-model="name" class="input_style">
                        <div class="choose_sex">
                            <span class="choose_option">
                                <svg class="address_empty_right" @click="chooseSex(1)" :class="{choosed: sex == 1}">
                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
                                </svg>
                                <span>先生</span>
                            </span>
                            <span class="choose_option">
                                <svg class="address_empty_right" @click="chooseSex(2)" :class="{choosed: sex == 2}">
                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
                                </svg>
                                <span>女士</span>
                            </span>
                        </div>
                    </section>
                </section>
                <section class="section_list">
                    <span class="section_left">联系电话</span>
                    <section class="section_right">
                        <div class="phone_add">
                            <input type="text" name="phone" placeholder="你的手机号" v-model="phone" class="input_style">
                            <img src="../../../../images/add_phone.png" height="20" width="20" @click="phone_bk = true">
                        </div>
                        <input v-if="phone_bk" type="text" name="anntherPhoneNumber" placeholder="备选电话" v-model="anntherPhoneNumber" class="input_style phone_bk">
                    </section>
                </section>
                <section class="section_list">
                    <span class="section_left">送餐地址</span>
                    <section class="section_right">
                        <router-link to="/confirmOrder/chooseAddress/addAddress/searchAddress" tag="div" class="choose_address">{{searchAddress? searchAddress.name : '小区/写字楼/学校等'}}</router-link>
                        <input type="text" name="address_detail" placeholder="详细地址（如门牌号等）" v-model="address_detail" class="input_style">

                    </section>
                </section>
                <section class="section_list">
                    <span class="section_left">标签</span>
                    <section class="section_right">
                        <input type="text" name="tag" placeholder="无/家/学校/公司" v-model="tag" class="input_style">
                    </section>
                </section>
            </section>
            <div class="determine" @click="addAddress">确定</div>
        </div>

        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import { postAddAddress } from 'src/service/getData'

    export default {
      data(){
            return{
                addForm: {
                    name: null, //姓名
                    sex: 1, //性别
                    phone: null, //电话
                    address_detail: null, //详细地址
                    tag: '', //备注
                    tag_type: 1, //备注类型
                    phone_bk: false, //是否选择备注电话
                    alternatePhoneNumber: '', //备注电话
                },
                name: null, //姓名
                sex: 1, //性别
                phone: null, //电话
                address_detail: null, //详细地址
                tag: '', //备注
                tag_type: 1, //备注类型
                phone_bk: false, //是否选择备注电话
                anntherPhoneNumber: '', //备注电话
                showAlert: false, //弹出框
                alertText: null, //弹出框信息
                poi_type: 0, //地址类型
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
            //选择性别
            chooseSex(sex){
                this.sex = sex;
            },
            //保存地址信息
            async addAddress(){
                if (!(this.userInfo && this.userInfo.user_id)) {
                    this.showAlert = true;
                    this.alertText = '请登录'
                }else if(!this.name){
                    this.showAlert = true;
                    this.alertText = '请输入姓名'
                }else if(!this.phone){
                    this.showAlert = true;
                    this.alertText = '请输入电话号码'
                }else if(!this.searchAddress){
                    this.showAlert = true;
                    this.alertText = '请选择地址'
                }else if(!this.address_detail){
                    this.showAlert = true;
                    this.alertText = '请输入详细地址'
                }
                if (this.tag == '家') {
                    this.tag_type = 2;
                }else if(this.tag == '学校'){
                    this.tag_type = 3;
                }else if(this.tag == '公司'){
                    this.tag_type = 4;
                }
                postAddAddress(
                    this.userInfo.user_id, 
                    this.searchAddress.name, 
                    this.address_detail, 
                    this.geohash, 
                    this.name, 
                    this.phone, 
                    this.anntherPhoneNumber, 
                    0, 
                    this.sex, 
                    this.tag, 
                    this.tag_type
                ).then((res) => {
                    //保存成功返沪上一页，否则弹出提示框
                    if (res.data.message) {
                        this.showAlert = true;
                        this.alertText = res.data.message;
                    }else {
                        this.CONFIRM_ADDRESS(1);
                        this.$router.go(-1);
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
    .page_text_container{
        background-color: #fff;
        padding: 0 .7rem;
    }
    .section_list{
        display: flex;
        border-bottom: 0.025rem solid #f5f5f5;
        .section_left{
            @include sc(.7rem, #333);
            flex: 2;
            line-height: 2.5rem;
        }
        .section_right{
            flex: 5;
            .input_style{
                width: 100%;
                height: 2.5rem;
                @include sc(.7rem, #999);
            }
            .phone_bk{
                border-top: 0.025rem solid #f5f5f5;
            }
            .phone_add{
                @include fj;
                align-items: center;
            }
            .choose_sex{
                display: flex;
                line-height: 2.5rem;
                border-top: 0.025rem solid #f5f5f5;
                .choose_option{
                    @include sc(.7rem, #333);
                    display: flex;
                    align-items: center;
                    margin-right: .8rem;
                    svg{
                        margin-right: .3rem;
                        @include wh(.8rem, .8rem);
                        fill: #ccc;
                    }
                    .choosed{
                        fill: #4cd964;
                    }
                }
            }
            .choose_address{
                @include sc(.7rem, #999);
                line-height: 2.5rem;
                border-bottom: 0.025rem solid #f5f5f5;
            }
        }
    }
    .determine{
        background-color: #4cd964;
        @include sc(.7rem, #fff);
        text-align: center;
        margin: 0 .7rem;
        line-height: 1.8rem;
        border-radius: 0.2rem;
        margin-top: .6rem;
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
