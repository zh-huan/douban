<template>
    <div class="section" :class="type">
        <div class="side"></div>
        <div class="main"></div>
    </div>
</template>
<script>
    export default {
        props:{
            type:String,
            contents:Object
        },
        data(){
            return{

            }
        },
        mounted(){
            console.log(this.contents);
        }
    }
</script>