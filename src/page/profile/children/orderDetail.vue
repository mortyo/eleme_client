 <template>
  <div class="order_detail_page">
        <section v-if="!showLoading" class="container">
            <!-- 订单标题 -->
            <section class="order_title">
                <router-link :to="{path: '/shop', query: {geohash, id: orderDetail.restaurant_id}}">
                    <img :src="imgBaseUrl + orderDetail.restaurant_image_url">
                </router-link>
                <div class="right">
                    <router-link :to="{path: '/shop', query: {geohash, id: orderDetail.restaurant_id}}">
                        商家名称：<span style="color:blue">{{orderDetail.restaurant_name}}</span>
                    </router-link>
                    <p>订单状态：{{orderDetail.status_bar.title}}</p>
                    <p>{{orderDetail.timeline_node.description}}</p>
                    <router-link style="color:blue" :to="{path: '/shop', query: {geohash, id: orderDetail.restaurant_id}}">再来一单</router-link>
                </div>
            </section>
            <!-- 订单列表 -->
            <section class="food_list">
                <header>订单列表</header>
                <ul class="food_list_ul">
                    <li v-for="item in orderDetail.basket.group[0]" :key="item.key">
                        <p class="food_name ellipsis">{{item.name}}</p>
                        <div class="quantity_price">
                            <span>X{{item.quantity}}</span>
                            <span>¥{{item.price}}</span>
                        </div>
                    </li>
                </ul>
                <div class="deliver_fee">
                    <span>餐盒费</span>
                    <span>¥{{orderDetail.basket.packing_fee.price*orderDetail.basket.packing_fee.quantity || 0}}</span>
                </div>
                <div class="deliver_fee">
                    <span>配送费</span>
                    <span>¥{{orderDetail.basket.deliver_fee&&orderDetail.basket.deliver_fee.price || 0}}</span>   
                </div>
                <div class="pay_ment">实付{{orderDetail.total_amount.toFixed(2)}}</div>
            </section>
            <!-- 配送信息 -->
            <section class="order_detail_style">
                <header>配送信息</header>
                <section class="item_style">
                    <p class="item_left">送达时间：</p>
                    <div class="item_right">
                        <p>{{orderData.deliver_time}}</p>
                    </div>
                </section>
                <section class="item_style">
                    <p class="item_left">送货地址：</p>
                    <div class="item_right">
                        <p>{{orderData.consignee}}</p>
                        <p>{{orderData.phone}}</p>
                        <p>{{orderData.address}}</p>
                    </div>
                </section>
                <section class="item_style">
                    <p class="item_left">配送方式：</p>
                    <div class="item_right">
                        <p>蜂鸟专送</p>
                    </div>
                </section>
            </section>
            <!-- 订单信息 -->
            <section class="order_detail_style">
                <header>订单信息</header>
                <section class="item_style">
                    <p class="item_left">订单号：</p>
                    <div class="item_right">
                        <p>{{orderDetail.id}}</p>
                    </div>
                </section>
                <section class="item_style">
                    <p class="item_left">支付方式：</p>
                    <div class="item_right">
                        <p>在线支付</p>
                    </div>
                </section>
                <section class="item_style">
                    <p class="item_left">下单时间：</p>
                    <div class="item_right">
                        <p>{{orderDetail.formatted_created_at}}</p>
                    </div>
                </section>
            </section>
        </section>
        <transition name="loading">
            <loading v-if="showLoading"></loading>
        </transition>
    </div>
</template>

<script>
    import loading from 'src/components/common/loading'
    import { mapState } from 'vuex'
    import { getOrderDetail } from 'src/service/getData'
    import { imgBaseUrl } from 'src/config/env'


    export default {
        components: {
            loading,
        },
        data(){
            return{
                showLoading: true, //显示加载动画
                orderData: null,
                imgBaseUrl
            }
        },
        computed: {
            ...mapState([
                'orderDetail', 'geohash', 'userInfo'
            ]),
        },
        mounted(){
            this.initData();
        },
        methods: {
            async initData(){
                if (this.userInfo && this.userInfo.user_id&&this.orderDetail.user_id) {
                    await getOrderDetail(this.orderDetail.user_id, this.orderDetail.unique_id).then((res) => {
                        this.orderData = res.data;
                        this.showLoading = false;
                        console.log(this.orderData)
                    })
                }else{
                    this.$router.push('/profile')
                }
            },
        },
        // 如果 `userInfo` 发生改变，这个函数就会运行,value为改变后的userInfo
        watch: {
            userInfo: function (value) {
                if (value && value.user_id) {
                    this.initData();
                }
            }
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    .order_detail_page{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 61px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f1f1f1;
        z-index: 2;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
        .container{
            margin: 24px auto 0 auto;
            padding: 0 16px;
            max-width: 600px;
            .order_title{
                display: flex;
                background-color: #fff;
                height: 90px;
                margin-bottom: 8px;
                border-radius: 5px;
                img{
                    width: 90px;
                    height: 90px;
                    border-radius: 5px;
                }
                .right {
                    padding: 8px;
                }
            }
            .food_list{
                background-color: #fff;
                border-radius: 5px;
                header{
                    @include sc(.75rem, #333);
                    padding: .5rem;
                    border-bottom: 1px solid #f5f5f5;
                }
                .food_list_ul{
                    li{
                        @include fj;
                        align-items: center;
                        padding: 0 .5rem;
                        line-height: 2rem;
                        .food_name{
                            @include sc(.6rem, #666);
                            flex: 4;
                        }
                        .quantity_price{
                            flex: 1;
                            @include fj;
                            align-items: center;
                            span:nth-of-type(1){
                                @include sc(.6rem, #ccc);
                            }
                            span:nth-of-type(2){
                                @include sc(.6rem, #666);
                            }
                        }
                    }
                }
                .deliver_fee{
                    @include fj;
                    align-items: center;
                    padding: 0 .5rem;
                    line-height: 2rem;
                    border-top: 1px solid #f5f5f5;
                    span{
                        @include sc(.6rem, #666);
                    }
                }
                .pay_ment{
                    @include sc(.6rem, #fb6b23);
                    border-top: 1px solid #f5f5f5;
                    font-weight: bold;
                    line-height: 2rem;
                    text-align: right;
                    padding-right: .5rem;
                }
            }
            .order_detail_style{
                background-color: #fff;
                margin-top: 0.5rem;
                border-radius: 5px;
                header{
                    @include sc(.75rem, #333);
                    padding: .5rem;
                    border-bottom: 1px solid #f5f5f5;
                }
                .item_style{
                    display: flex;
                    padding: .5rem;
                    p{
                        @include sc(.65rem, #666);
                        line-height: 1rem;
                    }
                }
            } 
        }
    }
    .loading-enter-active, .loading-leave-active {
        transition: opacity .7s
    }
    .loading-enter, .loading-leave-active {
        opacity: 0
    }
</style>
