<template>
    <div class="section" :class="type">
        <div class="sidenav" v-if="sidenav"></div>
        <div class="side" v-if="side"></div>
        <div class="main" v-if="main">
            <h2 class="title" v-if="main.tile">{{main.tile.text}}<a href="main.more">(更多)</a></h2>
            <div class="albums" v-if="main.albums">
                <ul>
                    <li v-for="(item,i) in main.albums">
                        <img :src="'../src/img/'+item.img"/>
                        <p><a href="item.href">{{item.text}}</a><span class="num">{{item.remark}}</span></p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            type:String,
            contents:Object
        },
        computed:{
            sidenav:function(){
                if(this.contents.sidenav)
                    return this.contents.sidenav;
                return null;
            },
            side:function(){
                if(this.contents.side)
                    return this.contents.side;
                return null;
            },
            main:function(){
                if(this.contents.main)
                    return this.contents.main;
                return null;
            }
        },
        data(){
            return{

            }
        },
        mounted(){
            console.log(this.contents);
        },
        methods:{
            test(n,k,p){

            }
        }
    }
</script>
<style scoped>
    .section{
        width: 950px;
        margin: 0 auto;
        padding-top: 15px;
    }
    .section:nth-child(2n) {
        padding: 40px 0 20px;
        background: #f7f7f7;
    }
    .main .title{
        font: 15px Arial, Helvetica, sans-serif;
        color: #072;
        margin: 0 0 12px 0;
        line-height: 150%;
    }
    .sns li{
        display: inline-block;
        zoom: 1;
        letter-spacing: normal;
        word-spacing: normal;
        width: 170px;
        vertical-align: top;
        font-size: 12px;
        margin: 10px 0 0 10px;
    }
    .sns .albums{
        width:360px;
        color:#999;
    }
    .sns .num{
        padding-left: 5px;
    }

</style>