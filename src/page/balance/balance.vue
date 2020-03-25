 <template>
  <div class="page">
        <head-top head-title="我的余额" go-back='true'></head-top>

        <section class="content_container">
            <section class="content">
                <header class="content_header">
                    <span class="content_title_style">当前余额</span>
                    <section class="contetn_description">
                        <el-tooltip effect="light" placement="bottom-start">
                            <div slot="content">
                                <h3>Q1: 使用余额的条件</h3>
                                <p>为了保护账户安全，使用余额前必须先绑定手机号。</p>
                                <h3>Q2: 余额可以怎么用？</h3>
                                <p>余额可以在饿了么平台上提现，当余额大于等于待支付金额时可以在支持在线支付的商家中进行消费。<br>提现功能将于2016年12月25日00:00全面开放。</p>
                                <h3>Q3:我要如何提现？</h3>
                                <p>为了保护账户和资金安全，您在提现前需要输入真实姓名和用该姓名开通的银行卡号、选择开户行，<br>并验证已绑定饿了么账号的手机号。每日只能提现1次，每次限额50元。若提现金额超过50元，点击【提现】时系统会提示您已超额，请您修改提现金额。</p>
                                <h3>Q4:为什么会提现失败？</h3>
                                <p>可能原因有：您的姓名、开户行、银行卡号等信息不匹配；您当日的提现次数和金额超过限制；<br>您的账户存在异常，被风控拦截。</p>
                            </div>
                            <el-button icon="el-icon-question" size="mini" round>余额说明</el-button>
                        </el-tooltip>
                    </section>
                </header>
                <p class="content_num">
                    <span>0.00</span>
                    <span>元</span>
                </p>
                <el-button type="primary" @click="tixian">提现</el-button>
            </section>
        </section>

        <p class="deal_detail">交易明细</p>

        <div class="no_log">
            <img src="../../images/no-log.png">
            <p>暂无明细记录</p>
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
            tixian(){
                this.showAlert = true;
                this.alertText = '莫攸倩提'
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
        .content_container{
            margin: 0 20%;
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
            margin: 0 20%;
            @include sc(.6rem, #999);
            line-height: 2rem;
            padding-left: .5rem;
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
        }
    }
</style>
