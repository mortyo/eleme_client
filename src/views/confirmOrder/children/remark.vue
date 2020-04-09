 <template>
    <div class="rating_page">
        <section v-if="!showLoading">
            <section class="quick_remark" v-if="remarkList.length">
                <header class="header_style">快速备注</header>
                <ul class="remark_arr_list_ul">
                    <li v-for="(item,index) in remarkList" :key="index">
                        <span  v-for="(remarkTtem, remarkIndex) in item" :key="remarkIndex" :class="{first: remarkIndex == 0, last: remarkIndex == item.length - 1,choosed: remarkText[index]&&(remarkText[index][0] == remarkIndex)}" @click="chooseRemark(index, remarkIndex, remarkTtem)">
                            {{remarkTtem}}
                        </span>
                        <div v-if="item.length == 1">
                            <span v-for="remark_item in item" :key="remark_item">{{remark_item}}</span>
                        </div>
                        <div v-else-if="item.length>1">
                            <span v-for="remark_item in item" :key="remark_item">{{remark_item}}</span>
                        </div>
                    </li>
                </ul>
                {{remarkText}}
            </section>
            <section class="input_remark quick_remark">
                <header class="header_style">其他备注</header>
                <textarea class="input_text" v-model="inputText" placeholder="请输入备注内容(可不填)"></textarea>
                <el-button type="primary" @click="confirmRemark">确定</el-button>
            </section>
        </section>
        <loading v-if="showLoading"></loading>
    </div>
</template>

<script>
    import {getRemark} from 'src/api/getData'
    import loading from 'src/components/common/loading'
    import {mapMutations} from 'vuex'

    export default {
      data(){
            return{
                id: null,
                sig: null,
                remarkList: null,
                showLoading: true,
                remarkText: {},
                inputText: null,
            }
        },
        created(){
            this.id = this.$route.query.id;
            this.sig = this.$route.query.sig;
        },
        mounted(){
            this.initData();
        },
        mixins: [],
        components: {
            loading,
        },
        props:[],
        methods: {
            ...mapMutations([
                'CONFIRM_REMARK'
            ]),
            //初始化信息
            async initData(){
                let res_remarkList = await getRemark(this.id, this.sig);
                this.remarkList = res_remarkList.data.remarks;
                console.log(this.remarkList)
                this.showLoading = false;
            },
            //选择备注
            chooseRemark(index, remarkIndex, text){
                this.remarkText[index] = [remarkIndex, text];
                this.remarkText = Object.assign({}, this.remarkText);
            },
            //确认选择
            confirmRemark(){
                this.CONFIRM_REMARK({remarkText: this.remarkText, inputText: this.inputText});
                this.$router.go(-1);
            }
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
  
    .rating_page{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 204;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .header_style{
        @include sc(.65rem, #333);
        line-height: 2rem;
    }
    .quick_remark{
        background-color: #fff;
        margin-top: .4rem;
        margin-left: 20%;
        margin-right: 20%;
        padding: 0 .6rem 1rem;
        ul{
            display: flex;
            flex-wrap: wrap;
            li{
                margin-right: .6rem;
                margin-bottom: .6rem;
                span{
                    @include sc(.6rem, #333);
                    padding: .3rem .6rem;
                    border: 0.025rem solid #3190e8;
                    border-left: 0;
                }
                .first{
                    border-left: 1px solid #3190e8;
                    border-radius: .2rem;
                    background: blue;
                }
                .last{
                    border-top-right-radius: .2rem;
                    border-bottom-right-radius: .2rem;
                    background: cadetblue;
                }
                .choosed{
                    color: #fff;
                    background-color: #3190e8;
                }
            }
        }
    }
    .input_remark{
        background-color: #fff;
        .input_text{
            width: 100%;
            background-color: #f9f9f9;
            border: 0.025rem solid #eee;
            resize: none;
            min-height: 4.5rem;
            border-radius: .2rem;
            @include sc(.6rem, #666);
            padding: .5rem;
        }
    }
</style>
