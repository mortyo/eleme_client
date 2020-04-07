 <template>
    <div class="rating_page">
        <div class="main">
            <div class="add_btn">
                <el-button type="primary" icon="el-icon-circle-plus-outline" plain round size="mini" @click="$router.push('/confirmOrder/chooseAddress/addAddress')">增加收货地址</el-button>
            </div>

            <ul class="deliverable_address">
                <li v-for="(item,index) in deliverable" :key="index" @click.prevent.stop="chooseAddress(item, index)" :class="{default_address: defaultIndex == index}">
                    <div>
                        <header>
                            <span>{{item.name}}</span>
                            <span>{{item.sex == 1? '先生' : '女士'}}</span>
                            <span>({{item.phone}})</span>   
                        </header>
                        <div class="address_detail">
                            <span v-if="item.tag" :style="{backgroundColor: iconColor(item.tag)}">{{item.tag}}</span>
                            <p>{{item.address_detail}}</p>   
                        </div>
                    </div>
                </li>
            </ul>

            <section id="out_delivery" v-if="deliverdisable.length">
                <header class="out_header">以下地址超出配送范围</header>
                <ul class="deliverable_address">
                    <li v-for="(item,index) in deliverdisable" :key="index">
                        <div>
                            <header>
                                <span>{{item.name}}</span>
                                <span>{{item.sex == 1? '先生' : '女士'}}</span>
                                <span>{{item.phone}}</span>   
                            </header>
                            <div class="address_detail">
                                <span v-if="item.tag" :style="{backgroundColor: '#ccc', color: '#fff'}">{{item.tag}}</span>
                                <p>{{item.address_detail}}</p>   
                            </div>
                        </div>
                    </li>
                </ul>
            </section>
        </div>

        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>  
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    import { getAddressList} from 'src/service/getData'

    export default {
        data(){
            return{
               	addressList: [], //地址列表
                deliverable: [], //有效地址列表
                deliverdisable: [], //无效地址列表
                id: null, //ID
                sig: null,
                showAlert: false,
                alertText: null,
            }
        },
        computed: {
            ...mapState([
                'userInfo', 'addressIndex', 'newAddress'
            ]),
            //选择地址
            defaultIndex: function (){
                if (this.addressIndex) {
                    return this.addressIndex;
                }else{
                    return 0;
                }
            }
        },
        created(){
            this.id = this.$route.query.id;
            this.sig = this.$route.query.sig;
        },
        mounted(){
            this.initData()
        },
        methods: {
            ...mapMutations([
                'CHOOSE_ADDRESS'
            ]),
            //初始化信息
            initData(){
                if (this.userInfo && this.userInfo.user_id) {
                    getAddressList(this.userInfo.user_id).then((res) => {
                        this.addressList = res.data;
                        //将当前所有地址访问有效无效两种
                        this.addressList.forEach(item => {
                            if (item.is_deliverable) {
                                this.deliverable.push(item);
                            }else{
                                this.deliverdisable.push(item);
                            }
                        })
                    })
                }
            },
            iconColor(name){
                switch(name){
                    case '公司': return '#4cd964';
                    case '学校': return '#3190e8';
                }
            },
            //选择地址
            chooseAddress(address, index){
                this.CHOOSE_ADDRESS({address, index});
                this.$router.go(-1);
            },
        },
        watch: {
            userInfo: function (value) {
                if (value && value.user_id) {
                    this.initData();
                }
            },
            newAddress: function (value) {
                this.initData();
            },
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
  
    .rating_page{
        margin-top: 84px;
        display: flex;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 202;
    }
    .main {
        width: 600px;
        padding: 0 24px;
        .add_btn {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }
        .deliverable_address{
            li{
                background-color: #fff;
                display: flex;
                align-items: center;
                padding: 16px;
                border: 1px solid #CCCCCC;
                border-radius: 5px;
                margin-bottom: 8px;
                opacity: 0.6;
                cursor: pointer;
                header{
                    @include sc(.7rem, #333);
                    span:nth-of-type(1){
                        font-size: 120%;
                        font-weight: bold;
                    }
                }
                .address_detail{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    span{
                        @include sc(.5rem, #fff);
                        border-radius: 3px;
                        margin-right: 4px;
                    }
                    p{
                        @include sc(.6rem, #777);
                    }
                }
            }
            li:hover {
                opacity: 1;
            }
            .default_address{
                opacity: 1;
            }
        }
        #out_delivery{
            .out_header{
                @include sc(.6rem, #666);
                line-height: 1.5rem;
                padding-left: 8px;
                background-color: #f5f5f5;
            }
            *{
                color: #ccc;
            }
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
