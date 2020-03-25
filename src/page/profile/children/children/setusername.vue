 <template>
    <div class="rating_page">
        <head-top head-title="修改用户名" go-back='true'></head-top>

        <section class="setname">
            <el-input v-model="inputValue" placeholder="输入用户名" @input="inputThing"></el-input>
            <div>
                <p v-if="earn">用户名只能修改一次（5-24字符之间）</p>
                <p v-else>用户名长度在5到24位之间</p>
            </div>
            <el-button type="primary" @click="resetName">确认修改</el-button>
        </section>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import {mapMutations,mapState} from 'vuex'
    export default {
        components: {
            headTop,
        },
        data(){
            return{
                earn: true,     //输入框提醒
                inputValue: '',       //输入框的内容
            }
        },
        computed:{
            ...mapState([
                'userInfo'
            ])
        },
        methods: {
            ...mapMutations([
                'RETSET_NAME'
            ]),
            inputThing(){
                if(this.inputValue.length <5 || this.inputValue.length>24){
                    this.earn=false;
                    return false;
                }else{
                    this.earn=true;
                    return true;
                }
            },
            resetName(){
                let checkResult = this.inputThing();
                if (!checkResult) {
                  return;
                }
                this.RETSET_NAME(this.inputValue);
                this.$router.go(-1);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .rating_page{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 202;
        background:#f2f2f2;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
        .setname{
            margin:0 35%;
        }
    }
</style>
