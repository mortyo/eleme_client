 <template>
  <div class="page">
        <head-top head-title="我的积分" go-back='true'></head-top>
        <section class="content_container">
            <section class="content">
                <header class="content_header">
                    <span class="content_title_style">当前积分</span>
                    <el-tooltip effect="light" placement="bottom-start" class="coupon">
                        <div slot="content">
                            <h3>Q1: 怎么获得积分？</h3>
                            <p>在线支付的订单将获得订单积分奖励：</p>
                            <ul>
                                <li>积分将在用户完成评价后获得。</li>
                                <li>可获得积分=订单金额×10（即1元=10点积分）。</li>
                                <li>订单金额指实际付款金额，不包含活动优惠金额。</li>
                                <li>每位用户每天最多可以获得2000积分，体验商家的订单和评价不会增加积分。</li>
                            </ul>
                            <h3>Q2: 积分用来做什么？</h3>
                            <p>可以在积分商城兑换各种礼品。</p>
                            <h3>Q3: 礼品兑换很多天了还没有收到，该怎么办？</h3>
                            <p>礼品从兑换日起，3个工作日（周末不算）内处理发货，发货后，通常会在3个工作日左右送达。</p>
                            <h3>Q4: 礼品兑换中的手机充值卡兑换，怎么样进行充值，充值之前会和我电话确认嘛？</h3>
                            <p>不会，手机充值卡兑换，是直接充值到您填写的手机号上，充值之前不会和您电话确认，<br>所以您在填写电话的时候，请确认电话是否正确。</p>
                        </div>
                        <el-button icon="el-icon-question" size="mini" round>商家代金券说明</el-button>
                    </el-tooltip>
                </header>
                <p class="content_num">
                    <span>0</span>
                    <span>分</span>
                </p>
                <el-button type="danger" size="medium" round @click="usePoint">积分兑换商品</el-button>
            </section>
        </section>

        <p class="deal_detail">最近30天积分纪录</p>
        <div class="no_log">
            <img src="../../images/no-log.png">
            <p>最近30天无积分纪录</p>
            <p>快去下单赚取大量积分吧</p>
        </div>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import alertTip from 'src/components/common/alertTip'

    export default {
        components: {
            headTop,
            alertTip,
        },
        data(){
            return{
                showAlert: false,
                alertText: null,
            }
        },
        methods: {
            usePoint(){
                this.showAlert = true;
                this.alertText = '快去下单赚取大量积分吧';
            }
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
  
    .page{
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .content_container{
        margin:0 20%;
        padding: .3rem;
        background-color: $blue;
        .content{
            padding: .4rem;
            background-color: #fff;
            border-radius: .15rem;
            .content_header{
                @include fj;
                font-size: .55rem;
                .contetn_description{
                    display: flex;
                    align-items: center;
                    img{
                        @include wh(.6rem, .6rem);
                        margin-right: .2rem;
                    }
                    .content_title_style{
                        color: $blue;
                    }
                }
                .content_title_style{
                    color: #666;
                }
            }
            .content_num{
                span:nth-of-type(1){
                    @include sc(1.8rem, #333);
                }
                span:nth-of-type(2){
                    @include sc(.7rem, #333);
                }
            }
        }
    }
    .deal_detail{
        @include sc(.6rem, #999);
        line-height: 2rem;
        padding-left: .5rem;
        margin: 0 20%;
    }
    .no_log{
        text-align: center;
        margin-top: 1rem;
        img{
            @include wh(8rem, 5rem);
        }
        p{
            margin-top: .5rem;
            @include sc(.7rem, #666);
        }
        p:nth-of-type(2){
            @include sc(.5rem, #999);
        }
    }
</style>
