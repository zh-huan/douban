const request=require("request");
const cheerio = require('cheerio');
const fs=require("fs");
const url="http://www.douban.com/";
request.get({
    url:   url,   // 请求的URL
    method: 'GET',                   // 请求方法
    headers: {                       // 指定请求头
        'User-Agent': 'request',         // 指定 Accept-Language
    }
},function (error, response, body) {
    console.log(body);
    if (!error && response.statusCode == 200) {
        console.log(body);
      // var $=cheerio.load(body);

    }
})