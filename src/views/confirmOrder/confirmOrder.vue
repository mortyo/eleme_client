<template>
    <div class="confirmOrderContainer">        
        <section v-if="!showLoading" class="container">
            <router-link :to='{path: "/confirmOrder/chooseAddress", query: {id: checkoutData.cart.id, sig: checkoutData.sig}}' class="address_container">
                <div class="address_empty_left">
                    <div class="add_address" v-if="!choosedAddress">请添加一个收货地址</div>
                    <div v-else class="address_detail_container">
                        <header>
                            <span>{{choosedAddress.name}}</span>
                            <span>{{choosedAddress.sex == 1? '先生':'女士'}}</span>
                            <span>({{choosedAddress.phone}})</span>
                        </header>
                        <div class="address_detail">
                            <span v-if="choosedAddress.tag" :style="{backgroundColor: iconColor(choosedAddress.tag)}">{{choosedAddress.tag}}</span>
                            <p>{{choosedAddress.address_detail}}</p>
                        </div>
                    </div>
                </div>
            </router-link>

            <section class="delivery_model">
                <p class="deliver_text">送达时间</p>
                <section class="deliver_time">
                    <p>尽快送达 | 预计 {{checkoutData.delivery_reach_time}}</p>
                    <p v-if="checkoutData.cart.is_deliver_by_fengniao">蜂鸟专送</p>
                </section>
            </section>

            <section class="pay_way">
                <header class="header_style">
                    <span>支付方式</span>
                    <div class="more_type" @click="showPayWayFun">
                        <span>在线支付</span>
                    </div>
                </header>
                <section class="hongbo">
                    <span>红包</span>
                    <span>暂时只在饿了么 APP 中支持</span>
                </section>
            </section>

            <section class="food_list">
                <header v-if="checkoutData.cart.restaurant_info">
                    <span>店铺：</span>
                    <img :src="imgBaseUrl + checkoutData.cart.restaurant_info.image_path">
                    <span>{{checkoutData.cart.restaurant_info.name}}</span>
                </header>
                <ul class="food_list_ul" v-if="checkoutData.cart.groups">
                    <li v-for="item in checkoutData.cart.groups[0]" :key="item.id" class="food_item_style">
                        <p class="food_name">{{item.name}}</p>
                        <div class="num_price">
                            <span>x {{item.quantity}}</span>
                            <span>¥{{item.price}}</span>
                        </div>
                    </li>
                </ul>
                <div class="food_item_style" v-if="checkoutData.cart.extra">
                    <p class="food_name">{{checkoutData.cart.extra[0].name}}</p>
                    <div class="num_price">
                        <span></span>
                        <span>¥ {{checkoutData.cart.extra[0].price}}</span>
                    </div>
                </div>
                <div class="food_item_style">
                    <p class="food_name">配送费</p>
                    <div class="num_price">
                        <span></span>
                        <span>¥ {{checkoutData.cart.deliver_amount || 0}}</span>
                    </div>
                </div>
                <div class="total_price">
                    <div class="num_price">
                        <span>共 ¥{{checkoutData.cart.total}}</span>
                    </div>
                </div>
            </section>

            <div class="remark">
                <span>订单备注</span>
                <div class="more_type">
                    <span class="ellipsis">{{remarkText||inputText? remarklist: '口味、偏好等'}}</span>
                </div>
                <el-button type="primary" @click="show_remark = true" size="mini">修改</el-button>
                <el-dialog title="备注信息" :visible.sync="show_remark">
                    <section v-if="remarkList.length">
                        <header>快速备注</header>
                        <ul>
                            <li v-for="(item,index) in remarkList" :key="index">
                                {{item}}
                            </li>
                        </ul>
                    </section>
                    <el-input
                        type="textarea"
                        maxlength="60"
                        show-word-limit
                        :autosize="{ minRows: 2, maxRows: 2}"
                        placeholder="请输入备注信息"
                        v-model="remark_text"
                        >
                    </el-input>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="show_remark = false">取 消</el-button>
                        <el-button type="primary" @click="show_remark = false">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
            <div class="remark">
                <span>发票抬头</span>
                <span>
                    {{checkoutData.invoice.status_text}}
                </span>
                <el-switch v-model="changed_invoice" @change="changeInvoice()"></el-switch>
            </div>

            <router-link :to='{path: "/confirmOrder/remark", query: {id: checkoutData.cart.id, sig: checkoutData.sig}}'>修改</router-link>
            <router-link :to="checkoutData.invoice.is_available? '/confirmOrder/invoice': ''" class="hongbo" :class="{support_is_available: checkoutData.invoice.is_available}">发票</router-link>

            <section class="confirm">
                <p>待支付 ¥{{checkoutData.cart.total}}</p>
                <el-button type="primary" @click="confrimOrder">确认下单</el-button>
            </section>




            <transition name="fade">
                <div class="cover" v-if="showPayWay" @click="showPayWayFun"></div>
            </transition>

            <transition name="slid_up">
                <div class="choose_type_Container" v-if="showPayWay">
                    <header>支付方式</header>
                    <ul>
                        <li v-for="item in checkoutData.payments" :key="item.id" :class="{choose: payWayId == item.id}">
                            <span>{{item.name}}<span v-if="!item.is_online_payment">{{item.description}}</span></span>
                            <el-button type="primary" @click="choosePayWay(item.is_online_payment, item.id)">11</el-button>
                        </li>
                    </ul>
                </div>
            </transition>
        </section>
        <loading v-if="showLoading"></loading>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    import loading from 'src/components/common/loading'
    import {
        checkout, 
        placeOrders, 
        getAddressList,
        getRemark,  //备注
    } from 'src/api/getData'

    import {imgBaseUrl} from 'src/config/env'

    export default {
        components: { loading },
        data(){
            return {
                geohash: '', //geohash位置信息
                shopId: null, //商店id值
                showLoading: true, //显示加载动画
                checkoutData: null,//数据返回值
                shopCart: null,//购物车数据
                imgBaseUrl, //图片域名
                showPayWay: false,//显示付款方式
                payWayId: 1, //付款方式
                showAlert: false, //弹出框
                alertText: null, //弹出框内容
                //备注对话框
                show_remark:false,
                remark_text: '',
                remarkList: [],
                //发票，true需要，false不需要
                changed_invoice: ''
            }
        },
        computed: {
            ...mapState([
                'cartList', 'remarkText', 'inputText', 'invoice', 'choosedAddress', 'userInfo'
            ]),
            //备注页返回的信息进行处理
            remarklist: function (){
                let str = new String;
                if (this.remarkText) {
                    Object.values(this.remarkText).forEach(item => {
                        str += item[1] + '，';
                    })
                }
                //是否有自定义备注，分开处理
                if (this.inputText) {
                    return str + this.inputText;
                }else{
                    return str.substr(0, str.lastIndexOf('，')) ;
                }
            },
        },
        created(){
            //获取上个页面传递过来的geohash值
            this.geohash = this.$route.query.geohash;
            //获取上个页面传递过来的shopid值
            this.shopId = this.$route.query.shopId;
            this.INIT_BUYCART();
            this.SAVE_SHOPID(this.shopId);
            //获取当前商铺购物车信息
            this.shopCart = this.cartList[this.shopId];
        },
        mounted(){
            if (this.geohash) {
                this.initData();
                this.SAVE_GEOHASH(this.geohash);
            }
        },
        methods: {
            ...mapMutations([
                'INIT_BUYCART', 
                'SAVE_GEOHASH', 
                'CHOOSE_ADDRESS', 
                'NEED_VALIDATION', 
                'SAVE_CART_ID_SIG', 
                'SAVE_ORDER_PARAM', 
                'ORDER_SUCCESS', 
                'SAVE_SHOPID',
                'CONFIRM_REMARK',   //确认备注信息
                'CONFIRM_INVOICE',  //确认发票
            ]),
            //初始化数据
            async initData(){
                let newArr = new Array;
                Object.values(this.shopCart).forEach(categoryItem => {
                    Object.values(categoryItem).forEach(itemValue=> {
                        Object.values(itemValue).forEach(item => {
                            newArr.push({
                                attrs: [],
                                extra: {},
                                id: item.id,
                                name: item.name,
                                packing_fee: item.packing_fee,
                                price: item.price,
                                quantity: item.num,
                                sku_id: item.sku_id,
                                specs: [item.specs],
                                stock: item.stock,
                            })
                        })
                    })
                })
                //检验订单是否满足条件
                await checkout(this.geohash, [newArr], this.shopId).then((res) => {
                    this.checkoutData = res.data;
                    console.log(this.checkoutData)
                });
                this.SAVE_CART_ID_SIG({cart_id: this.checkoutData.cart.id, sig:  this.checkoutData.sig})
                this.initAddress();
                //获取备注信息
                await getRemark(this.checkoutData.id, this.checkoutData.sig).then((res) => {
                    let remarkArr = res.data.remarks;
                    remarkArr.forEach((arr) => {
                        arr.forEach((remark) => {
                            this.remarkList.push(remark)
                        })
                    })  
                });
                this.showLoading = false;
            },
            //获取地址信息，第一个地址为默认选择地址
            async initAddress(){
                if (this.userInfo && this.userInfo.user_id) {
                    let res_addressRes = await getAddressList(this.userInfo.user_id);
                    const addressRes = res_addressRes.data;
                    if (addressRes instanceof Array && addressRes.length) {
                        this.CHOOSE_ADDRESS({address: addressRes[0], index: 0});
                    }
                }
            },
            //显示付款方式
            showPayWayFun(){
                this.showPayWay = !this.showPayWay;
            },
            //选择付款方式
            choosePayWay(is_online_payment, id){
                if (is_online_payment) {
                    this.showPayWay = !this.showPayWay;
                    this.payWayId = id;
                }
            },
            //地址备注颜色
            iconColor(name){
                switch(name){
                    case '公司': return '#4cd964';
                    case '学校': return '#3190e8';
                }
            },
            //确认备注信息
            // chooseRemark(index, remarkIndex, text){

            // },
            // confirmRemark(){
            //     this.CONFIRM_REMARK({remarkText: this.remarkText, inputText: this.inputText});
            // },
            //确认订单
            //改变发票触发事件
            changeInvoice(){
                this.changed_invoice = !this.changed_invoice
            	this.CONFIRM_INVOICE(this.changed_invoice);
            },
            async confrimOrder(){
                //用户未登录时弹出提示框
                if (!(this.userInfo && this.userInfo.user_id)) {
                    this.$confirm('当前未登录账号, 是否登录?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$router.push('/login')
                    }).catch(err)
                    return
                    //未选择地址则提示
                }else if(!this.choosedAddress){
                    this.$message({
                        showClose: true,
                        message: '当前还没填写收货地址，请去填写',
                        type: 'warning'
                    })
                    return
                }
                //保存订单
                this.SAVE_ORDER_PARAM({
                    user_id: this.userInfo.user_id,
                    cart_id: this.checkoutData.cart.id,
                    address_id: this.choosedAddress.id,
                    description: this.remarklist,
                    entities: this.checkoutData.cart.groups,
                    geohash: this.geohash,
                    sig: this.checkoutData.sig,
                });
                //发送订单信息
                placeOrders(
                    this.userInfo.user_id, 
                    this.checkoutData.cart.id, 
                    this.choosedAddress.id, 
                    this.remarklist, 
                    this.checkoutData.cart.groups, 
                    this.geohash, 
                    this.checkoutData.sig
                ).then((res) => {
                    //第一次下单的手机号需要进行验证，否则直接下单成功
                    if (res.need_validation) {
                        this.NEED_VALIDATION(res.data);
                        this.$router.push('/confirmOrder/userValidation');
                    }else{
                        this.ORDER_SUCCESS(res.data);
                        this.$router.push('/confirmOrder/payment');
                    }
                });
            },
        },
        watch: {
            userInfo: function (value) {
                if (value && value.user_id) {
                    this.initAddress();
                }
            },
        }
    }

</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .confirmOrderContainer{
        margin-top: 24px;
    }
    .container{
        width: 600px;
        margin: 0 auto;
    }
    .address_container{
        display: flex;
        align-items: center;
        padding: 16px;
        border: 1px solid #CCCCCC;
        border-radius: 5px;
        margin-bottom: 16px;
        background-color: #fff;
        .address_empty_left{
            display: flex;
            align-items: center;
            .add_address{
                @include sc(.7rem, #333);
            }
            .address_detail_container{
                margin-left: 12px;
                header{
                    @include sc(.65rem, #333);
                    span:nth-of-type(1){
                        font-size: .8rem;
                        font-weight: bold;
                    }
                }
                .address_detail{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    span{
                        @include sc(.5rem, #fff);
                        border-radius: .15rem;
                        background-color: #ff5722;
                        height: .6rem;
                        line-height: .6rem;
                        padding: 0 .2rem;
                        margin-right: .3rem;
                    }
                    p{
                        @include sc(.55rem, #777);
                    }
                }
            }
        }
    }
    .delivery_model{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border: 1px solid #CCCCCC;
        border-radius: 5px;
        margin-bottom: 16px;
        background-color: #fff;
        .deliver_text{
            @include sc(.8rem, #333);
            font-weight: bold;
        }
        .deliver_time{
            display: flex;
            align-items: center;
            p:nth-of-type(1){
                @include sc(.7rem, $blue);
            }
            p:nth-of-type(2){
                @include sc(.5rem, #fff);
                background-color: $blue;
                border-radius: 3px;
                margin-left: 16px;
            }
        }
    }
    .pay_way{
        padding: 16px;
        border: 1px solid #CCCCCC;
        border-radius: 5px;
        margin-bottom: 16px;
        background-color: #fff;
        .header_style{
            display: flex;
            justify-content: space-between;
            align-items: center;
            span:nth-of-type(1){
                @include sc(.7rem, #666);
            }
            .more_type{
                span:nth-of-type(1){
                    @include sc(.6rem, #aaa);
                    display: inline-block;
                    text-align: right;
                }
            }
        }
        .hongbo{
            display: flex;
            justify-content: space-between;
            span{
                @include sc(.6rem, #aaa);
                line-height: 2rem;
            }
            span:nth-of-type(2){
                color: #aaa;
            }
        }
        .support_is_available{
            span{
                color: #666;
            }
        }
    }
    .food_list{
        padding: 16px;
        border: 1px solid #CCCCCC;
        border-radius: 5px;
        margin-bottom: 16px;
        background-color: #fff;
        header{
            padding-bottom: 16px;
            border-bottom: 1px solid #f5f5f5;
            img{
                @include wh(20px, 20px);
                vertical-align: middle;
            }
            span{
                @include sc(.8rem, #333);
            }
        }
        .food_list_ul{
            padding-top: .5rem;
        }
        .food_item_style{
            @include fj;
            line-height: 32px;
            padding: 0 12px;
            span,p{
                @include sc(.65rem, #666);
            }
            .food_name{
                width: 11rem;
            }
            .num_price{
                width: 50%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span:nth-of-type(1){
                    color: #f60;
                }
            }
        }
        .total_price{
            border-top: 1px solid #f5f5f5;
            text-align: end;
            line-height: 32px;
            padding: 0 12px;
        }
    }
    .remark {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border: 1px solid #CCCCCC;
        border-radius: 5px;
        margin-bottom: 16px;
        background-color: #fff;
    }
    .confirm {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        p {
            margin-right: 16px;
            color: #ff6600;
        }
    }

    .cover{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0,0,0,.3);
        z-index: 203;
    }
    .choose_type_Container{
        background-color: #fff;
        position: fixed;
        // bottom: 0;
        width: 100%;
        z-index: 204;
        header{
            background-color: #fafafa;
            @include sc(.7rem, #333);
            text-align: center;
            line-height: 2rem;
        }
        ul{
            li{
                @include fj;
                padding: 0 .7rem;
                line-height: 2.5rem;
                align-items: center;
                span{
                    @include sc(.7rem, #ccc);
                }
                svg{
                    @include wh(.8rem, .8rem);
                    fill: #eee;
                }
            }
            .choose{
                span{
                    color: #333;
                }
                svg{
                    fill: #4cd964;
                }
            }
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
    .slid_up-enter-active, .slid_up-leave-active {
        transition: all .3s;
    }
    .slid_up-enter, .slid_up-leave-active {
        transform: translate3d(0,10rem,0)
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
