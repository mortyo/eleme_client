 <template>
  <div class="rating_page">
        <head-top head-title="我的优惠" go-back='true'></head-top>

        <section v-if="!showLoading" class="container">
            <router-link to="/benefit/commend" class="commend"><i class="el-icon-share"></i>推荐有奖</router-link>
            <router-link to="/benefit/exchange" class="exchange"><i class="el-icon-coin"></i>兑换红包</router-link>
            <section class="category_title"> 
                <span :class="{choosed: categoryType === 1}" @click="categoryType = 1">红包</span>
                <span :class="{choosed: categoryType === 2}" @click="categoryType = 2">商家代金券</span>
            </section>
            <!-- 红包 -->
            <transition name="router-fade">
                <section v-if="categoryType === 1">
                    <!-- 红包列表 -->
                    <section class="hongbao_container">
                        <header class="hongbao_title">
                            <section class="total_number">
                                有 <span>{{hongbaoList.length}}</span> 个红包即将到期
                            </section>
                            <el-tooltip effect="light" placement="bottom-start">
                                <div slot="content">
                                    <h3 id="q1-">Q1: 怎么获得红包？</h3>
                                    <ul>
                                        <li>通过邀请好友获得</li>
                                        <li>在下单返红包的商家下单获得</li>
                                        <li>抢微信朋友分享的红包获得</li>
                                    </ul>
                                    <h3>Q2: 红包可以做什么？</h3>
                                    <p>可以抵扣在线支付时的实际支付金额。</p>
                                    <h3>Q3: 红包的门槛金额按照什么金额计算？</h3>
                                    <p>红包的的门槛金额按照（选购菜品折后价＋餐盒费）的金额作为计算门槛，即购物车显示的金额（7.3以上版本）。<br>假设红包满30可用，只要选购的菜品现价（折后价）＋餐盒费超过30，就可以使用红包。</p>
                                    <h3>Q4: 一个红包能拆开多次使用吗？</h3>
                                    <p>不能，一个红包只能一次性使用，不能分开使用。</p>
                                    <h3>Q5: 下单的时候使用了红包，但是后来订单取消了，红包还会返还吗？</h3>
                                    <p>会的，订单无效后红包会自动返还到您的账户里。</p>
                                    <h3>Q6: 红包兑换码怎样兑换成红包，怎样查看红包？</h3>
                                    <p>在个人中心 &gt; 我的红包 &gt; 兑换红包，输入兑换码进行兑换。</p>
                                    <h3>Q7: 邀请好友了，为什么没获得红包？</h3>
                                    <p>先检查下您是否在同一设备上进行的邀请？或者被邀请人是否通过您发给对方的链接进行注册？而非自己复制链接注册的。<br>同一设备上邀请或没有按照点击发送的链接邀请都是无效邀请。如果您是正常邀请没获得红包，可以致电客服进行查实。</p>
                                    <h3>Q8: 预订早餐、预订午餐的红包怎么使用？在哪里查询？</h3>
                                    <ul>
                                        <li>预订早餐、预订午餐的红包暂时不支持直接点外卖使用，并且当前点外卖的红包也暂时不支持在预订早餐、预订午餐时使用。</li>
                                        <li>预订早餐、预订午餐的红包从APP首页点击“预订早餐”按钮进入后在右上角的个人中心中查找预订早餐、预订午餐的红包。</li>
                                    </ul>
                                    <h3>Q9: 互斥红包怎么使用？</h3>
                                    <ul>
                                        <li>互斥红包不与其他优惠活动（包含但不限于：新用户专享、满X元减X元、满X元赠XX）同时使用。</li>
                                    </ul>
                                    <h3>Q10: 返红包活动， 红包领取规则是什么?</h3>
                                    <ul>
                                        <li>同一个手机号一天限领取三个。</li>
                                        <li>同一注册用户一天限领取三个。</li>
                                        <li>注册用户红包直接发送至用户账户里。</li>
                                        <li>非注册用户红包以兑换码短信的形式发送至用户手机，注册后凭兑换码兑换即可。</li>
                                        <li>红包的使用周期为1周，自红包发放的第2天开始计算。</li>
                                        <li>同一个手机号一天最多使用两个红包。</li>
                                        <li>未收到红包短信的用户注意查看手机里的拦截短信。</li>
                                        <li>有任何问题请拨打客服电话：10105757。</li>
                                    </ul>
                                </div>
                                <el-button icon="el-icon-question" size="mini" round>余额说明</el-button>
                            </el-tooltip>  
                        </header>
                        <ul class="hongbao_list_ul">
                            <li class="hongbao_list_li" v-for="item in hongbaoList" :key="item.id">
                                <section class="list_item">
                                    <div class="list_item_left">
                                        <span>¥</span>
                                        <span>{{String(item.amount).split('.')[0]}}</span>
                                        <span>.</span>
                                        <span>{{String(item.amount).split('.')[1]||0}}</span>
                                        <p>{{item.description_map.sum_condition}}</p>
                                    </div>
                                    <div class="list_item_right">
                                        <h4>{{item.name}}</h4>
                                        <p>{{item.description_map.validity_periods}}</p>
                                        <p>{{item.description_map.phone}}</p>
                                    </div>
                                    <div class="time_left">{{item.description_map.validity_delta}}</div>
                                </section>
                                <footer class="list_item_footer" v-if="item.limit_map">
                                    <p>{{item.limit_map.restaurant_flavor_ids}}</p>
                                </footer>
                            </li>
                        </ul>
                    </section>
                    <!-- 红包历史 -->
                    <router-link to="/benefit/hbHistory" class="history_hongbao">
                        <span class="check_history">查看历史红包</span>
                    </router-link>
                </section>
            </transition>
            <!-- 商家代金券 -->
            <transition name="router-fade">
                <section v-if="categoryType === 2" class="voucher_container">
                    <el-tooltip effect="light" placement="bottom-start" class="coupon">
                        <div slot="content">
                            <h3>Q1: 什么是商家代金券？</h3>
                            <p>商家代金券是指由商家自己发放代金券，只限在指定的商家使用，可根据条件抵扣相应金额。</p>
                            <h3>Q2: 怎么获得商家代金券？</h3>
                            <ul>
                                <li>进入有「进店领券」或「下单返券」标示的商家即有机会获得代金券。</li>
                                <li>「下单返券」需要在指定商家完成满足返券金额要求的订单后才会返还，代金券可在下次下单时使用。</li>
                            </ul>
                            <h3>Q3: 商家代金券使用条件</h3>
                            <ul>
                                <li>商家代金券仅限在指定商家使用</li>
                                <li>商家代金券仅限在线支付使用</li>
                                <li>每个订单只能使用一张商家代金券，不可与其他代金券叠加使用</li>
                            </ul>
                        </div>
                        <el-button icon="el-icon-question" size="mini" round>商家代金券说明</el-button>
                    </el-tooltip>

                    <section class="unable_use">
                        <img src="../../images/voucher.png" height="170" width="300">
                        <p>无法使用代金券</p>
                        <p>非客户端或客户端版本过低</p>
                        <router-link to="/download" class="download_app">
                        下载或升级客户端
                        </router-link>
                    </section>
                </section>
            </transition>
        </section>

        <loading v-show="showLoading"></loading>
        
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import {mapState} from 'vuex'
    import {getHongbaoNum} from 'src/service/getData'
    import loading from 'src/components/common/loading'

    export default {
        components: {
            headTop,
            loading,
        },
        data(){
            return{
                showLoading: true, //加载动画
                hongbaoList: null, //红包列表
                categoryType: 1, //红包与商家代金券切换

            }
        },
        computed: {
            ...mapState([
                'userInfo',
            ]),
        },
        mounted(){
            this.initData();
        },
        methods: {
            async initData(){
                if (this.userInfo) {
                    let res_hongbaoList = await getHongbaoNum(this.userInfo.user_id);
                    console.log(res_hongbaoList)
                    this.hongbaoList = res_hongbaoList.data;
                    this.showLoading = false;
                }
            }
        },
        //监听userInfo的变化，当userInfo变化时初始化数据
        watch: {
            userInfo: function (value){
                this.initData();
            }
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    .rating_page{
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
        .container{
            margin:0 20%;
            text-align: center;
            .commend:hover{
                color: $blue;
            }
            .exchange:hover{
                color: $blue;
            }
            .category_title{
                display: flex;
                justify-content: space-around;
                align-items: center;
                height: 3rem;
                background-color: #fff;
                span{
                    text-align: center;
                    @include sc(.9rem, #333);
                    padding-bottom: .2rem;
                    border-bottom: 0.1rem solid #fff;
                }
                // 被选中的选项
                .choosed{
                    border-bottom-color: $blue;
                    color: $blue;
                }
            }
            .hongbao_container{
                .hongbao_title{
                    @include fj;
                    font-size: .5rem;
                    line-height: 2rem;
                    .total_number{
                        color: #666;
                        span{
                            color: #ff5340;
                        }
                    }
                }
                .hongbao_list_ul{
                    .hongbao_list_li{
                        background: #fff url(../../images/hongbao.png) repeat-x ;
                        background-size: .5rem .2rem;
                        margin-bottom: 0.5rem;
                        border-radius: 0.25rem;
                        .list_item{
                            @include fj;
                            padding: 1rem 0.5rem .8rem;
                            .list_item_left{
                                font-size: 0;
                                border-right: 0.025rem dotted #ccc;
                                flex: 1;
                                span:nth-of-type(1){
                                    @include sc(.75rem, #ff5340);
                                    font-weight: bold;
                                }
                                span:nth-of-type(2){
                                    @include sc(1.5rem, #ff5340);
                                }
                                span:nth-of-type(3), span:nth-of-type(4){
                                    @include sc(0.8rem, #ff5340);
                                    font-weight: bold;
                                }
                                p{
                                    @include sc(0.4rem, #999);
                                }
                            }
                            .list_item_right{
                                flex: 2;
                                margin-left: 1.5rem;
                                h4{
                                    @include sc(.7rem, #666);
                                    margin-left: -.7rem;
                                }
                                p{
                                    list-style-type: disc;
                                    margin-left: -.7rem;
                                    @include sc(.4rem, #999);   
                                }
                            }
                            .time_left{
                                @include sc(.75rem, #ff5340);
                            }
                        }
                        .list_item_footer{
                            background-color: #f9f9f9;
                            padding: .4rem .4rem;
                            border-bottom-left-radius: 0.25rem;
                            border-bottom-right-radius: 0.25rem;
                            p{
                                list-style-type: disc;
                                @include sc(.4rem, #999);
                                margin-left: .4rem;
                            }
                        }
                    }
                }
                .history_hongbao{
                    padding: .5rem 0 2.8rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .check_history{
                        @include sc(.5rem, #999);
                        margin-right: .2rem;
                    }
                    .history_right{
                        @include wh(.4rem, .4rem);
                        fill: #aaa;
                    }
                }
            }
            .voucher_container{
                .unable_use{
                    text-align: center;
                    margin-top: 4rem;
                    img{
                        @include wh(6rem, 3.4rem);
                    }
                    p:nth-of-type(1){
                        @include sc(.7rem, #666);
                        margin-top: .4rem;
                    }
                    p:nth-of-type(2){
                        @include sc(.5rem, #999);
                        margin-top: .3rem;
                        margin-bottom: .3rem;
                    }
                    .download_app{
                        background-color: #56d176;
                        @include sc(.65rem, #fff);
                        padding: .3rem;
                        border-radius: .15rem;
                    }
                }
            }
        }
    }
    .router-fade-enter-active, .router-fade-leave-active {
        transition: opacity .3s;
    }
    .router-fade-enter, .router-fade-leave-active {
        opacity: 0;
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
