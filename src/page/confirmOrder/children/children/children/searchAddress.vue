 <template>
    <div class="search_address_page">
        <section class="main">
            <form class="search_form">
                <el-input v-model="searchValue" placeholder="请输入小区/写字楼/学校等"></el-input>
                <el-button type="primary" @click.prevent="searchPlace()">搜索</el-button>
            </form>
            <ul class="address_list" v-if="searchData">
                <li v-for="(item, index) in searchData" :key="index" @click="choooedAddress(item.address)">
                    <h4>{{item.name}}</h4>
                    <p>{{item.address}}</p>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import { cityGuess,searchplace } from 'src/service/getData'
    import {mapMutations} from 'vuex'

    export default {
        data(){
            return{
                city_id: '',
               	searchValue: null, //输入的搜索内容
                searchData: null, //搜索的结果
            }
        },
        mounted(){
            cityGuess().then((res) => {
                this.city_id = res.data.id
            })
        },
        methods: {
            ...mapMutations([
                'CHOOSE_SEARCH_ADDRESS'
            ]),
            //搜索
            async searchPlace(){
                if (this.searchValue) {
                    searchplace(this.city_id,this.searchValue).then((res) => {
                        this.searchData = res.data
                    })
                }
            },
            //选择搜素结果
            choooedAddress(item){
                this.CHOOSE_SEARCH_ADDRESS(item);
                this.$router.go('/confirmOrder/chooseAddress/addAddress');
            },
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
  
    .search_address_page{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 204;
        overflow-y: auto;
        margin-top: 84px;
        .main {
            width: 600px;
            margin: 0 auto;
        }
    }
    .search_form{
        display: flex;
    }
    .address_list{
        padding: 16px;
        li{
            cursor: pointer;
            padding: 16px 0;
            border-bottom: 1px solid #333;
            h4{
                @include sc(.75rem, #555);
            }
            p{
                @include sc(.65rem, #999);
            }
        }
    }
</style>
