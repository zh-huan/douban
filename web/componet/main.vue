<template>
    <div style="padding-top: 35px">
        <div class="header">
            <div class="header-logo"></div>
            <div class="header-search">
                <input type="text" placeholder="书籍、电影、音乐、小组、小站、成员"/>
                <span class="header-search-icon"></span>
            </div>
            <div class="header-list">
                <ul>
                    <li v-for="(headeritem,index) in header.links"><a :class="'link link-'+contentHeader[index]">{{headeritem.text}}</a>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="register" class="reg-new" :style="{'background-image':'url(../src/img/'+register+')'}">
            <div class="wrapper">
                <div class="app">
                    <div class="title">豆瓣6.0</div>
                    <div class="download">
                        <a href="https://www.douban.com/doubanapp/app?channel=nimingye" class="app-link"
                           target="_blank">下载豆瓣 App</a>
                        <div class="app-show-erweima">
                            <span class="erweima" @mouseenter="isShowApp=true"></span>
                            <div class="app-big-erweima" v-show="isShowApp" @mouseleave="isShowApp=false">
                                <img src="../src/static_img/doubanapp_qrcode.png" style="width: 160px;height: 160px;"/>
                                <p class="big-erweima-text">iOS / Android 扫码直接下载</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="user-info">
                    <div class="login-way scan" title="扫码登录" v-show="userinfo.login=='input'"
                         @click="userinfo.login='scan'"></div>
                    <div class="login-way input" title="短信登录/注册" v-show="userinfo.login=='scan'"
                         @click="userinfo.login='input'"></div>
                    <div class="input-login" v-if="userinfo.login=='input'">
                        <div class="input-login-title" :class="{'selected':userinfo.inputType=='register'}"
                             @click="userinfo.inputType='register'">短信登录/注册
                        </div>
                        <div class="input-login-title" :class="{'selected':userinfo.inputType=='login'}"
                             @click="userinfo.inputType='login'">密码登录
                        </div>
                        <div class="register" v-if="userinfo.inputType=='register'">
                            <p class="tip">登录注册表示同意 <a target="_blank"
                                                       href="https://accounts.douban.com/passport/agreement">豆瓣使用协议、隐私政策</a>
                            </p>
                            <div class="account-form">
                                <div class="account-form_item account-form_item-phone">
                                    <input type="text" name="phone-num" placeholder="手机号"/>
                                    <div class="phone-pre">
                                        <div class="phone-pre_value">+86</div>
                                        <div class="phone-pre_list"></div>
                                    </div>

                                </div>
                                <div class="account-form_item">
                                    <input type="text" name="code" placeholder="验证码"/><a
                                        class="account-form_iten-getcode">获取验证码</a>
                                </div>

                                <div class="account-form_submit">
                                    <a class="login-btn">登录豆瓣</a>
                                </div>
                            </div>
                        </div>
                        <div class="login" v-if="userinfo.inputType=='login'">
                            <p class="tip right"><a target="_blank"
                                                    href="https://accounts.douban.com/passport/get_password">找回密码</a>
                            </p>
                            <div class="account-form">
                                <div class="account-form_item">
                                    <input type="text" name="pwd" placeholder="手机号/邮箱"/>
                                </div>
                                <div class="account-form_item">
                                    <input type="password" name="pwd" placeholder="密码"/>
                                </div>
                                <div class="account-form_submit">
                                    <a class="login-btn">登录豆瓣</a>
                                </div>
                            </div>

                        </div>
                        <div class="login-foot">
                            <input type="checkbox" name="auto-login-agin" id="auto-login-agin"/><label
                                for="auto-login-agin">下次自动登录</label>
                            <a target="_blank" href="https://help.douban.com/account?app=1#t1-q8">收不到验证码</a>
                        </div>
                        <div class="login-3rd">

                        </div>
                    </div>
                    <div class="scan-login" v-if="userinfo.login=='scan'">

                    </div>

                </div>


            </div>
        </div>
        <contentComponet v-for="(type,i) in types" :contents="contents[type]" :type="type"></contentComponet>
    </div>
</template>
<script>
    import axios from 'axios';
    import contentComponet from './contentComponet.vue'

    export default {
        data() {
            return {
                isShowApp: false,
                data: {},
                contentHeader: ["book", "movie", "music", "group", "events", "fm", "time", "market"],
                userinfo: {
                    login: "input",
                    inputType: "register"
                }
            }
        },
        components: {
            contentComponet: contentComponet
        },
        computed: {
            header: function () {
                if (!this.data.header)
                    return {};
                return this.data.header;
            },
            contents: function () {
                if (!this.data.content)
                    return {};
                return this.data.content;
            },
            register: function () {
                if (!this.data.register)
                    return {};
                return this.data.register;
            },
            types: function () {
                if (this.data.content) {
                    return Object.keys(this.data.content)
                }
                return [];
            }
        },
        created() {
            axios.get("../src/data/main.json").then(
                resp => {
                    console.log(resp);
                    this.data = resp.data;
                }).catch(function (error) {
                console.log(error);
            });
        },
        mounted() {

        }
    }
</script>
<style lang="stylus" scoped="" type="text/css">
    @import "../common/css/main.styl";
</style>
