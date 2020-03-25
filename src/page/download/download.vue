 <template>
  <div class="download_page">
        <head-top head-title="下载" go-back='true'></head-top>

        <section class="dowload_container">
            <img src='../../images/app.png' class="logo_img">
            <p>手机用户请扫码下载APP</p>
        </section>

    </div>
</template>

<script>
    import headTop from 'src/components/header/head'

    export default {
        components: {
            headTop
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
  
    .download_page{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
        z-index: 202;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .dowload_container{
        text-align: center;
        .logo_img{
           border-radius: 1rem;
            margin-top: 1rem;
        }
        p{
            @include sc(.8rem, #666);
            margin-bottom: 1rem;
        }
    }
</style>
