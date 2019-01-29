const request = require("request");
const http = require("http");
const cheerio = require('cheerio');
const fs = require("fs");
const mongodb = require("mongodb");
const server = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true});
const db = new mongodb.Db('douban', server, {safe: true});
const url = "http://www.douban.com/";
request.get({
    url: url,   // 请求的URL
    method: 'GET',                   // 请求方法
    headers: {                       // 指定请求头
        'User-Agent': 'request',         // 指定 Accept-Language
    }
}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        let $ = cheerio.load(body);
        let header=getHeader($("#anony-nav"));
        let register=getRegister($("#anony-reg-new"));
        let $divs=$(".section");
        let content=getContent($divs);
        let info={
            header:header,
            register:register,
            content:content
        }
        let infoStr=JSON.stringify(info);
        let file="../web/src/data/main.js";
        fs.writeFile(file, infoStr,function(err){
            if(err) console.log(err);
        });
    }
})
/**----------头部---------------**/
function getHeader($nav) {
    let tile = $nav.find("h1").text();
    let links = [];
    let $links = $nav.find("ul").find("li");
    for(let i=0;i<$links.length;i++){
        let $item=$links.eq(i);
        let $a=$item.find("a");
        links.push({
            text: $a.text(),
            url: $a.attr("href")
        })
    }
    let form = {
        action: $nav.find("form").attr("action"),
        method: $nav.find("form").attr("method")
    };
    let header = {
        tile: tile,
        links: links,
        form: form
    }
    return header;
    // db.open(function (err, db) {
    //     if (!err) {
    //         db.collection('indexHeader', {safe: true}, function (err, collection) {
    //             collection.insert(header, function (err, result) {
    //                 console.log(result);
    //             });
    //         });
    //     } else {
    //         console.log(err);
    //     }
    // })
}
/**----------注册---------------**/
function getRegister($new) {
    let registImg = $new.css("background-image");
    let url=getUrl(registImg);
    let name=getImgName(url);
    saveImage(url,name);
    return name;
}

function getContent($divs){
    let countent={};
    for(let i=0;i<$divs.length;i++){
        let $item=$divs.eq(i);
        let id=$item.attr("id").replace("anony-","");
        var data={ };
        let sidenav=getSidenav(id,$item);
        if(sidenav)
            data.sidenav=sidenav;
        let side=getSide(id,$item);
        if(side)
            data.side=side;
        let main=getMain(id,$item);
        if(main)
            data.main=main;
        countent[id]=data;
    }
    return countent;
}
function getSidenav (id,$div){
    let $sidenav=$div.find(".sidenav");
    if(!$sidenav.length)
        return;
    let sidenav={};
    let title=getsHeader($sidenav);
    if(title){
        sidenav["title"]=title;
    }
   let sideLinks=getsideLinks($sidenav);
    if(sideLinks&&sideLinks.length){
        sidenav["sideLinks"]=sideLinks;
    }
    let appList=getAppList($sidenav);
    if(appList&&appList.length){
        sidenav["appList"]=appList;
    }
    return sidenav;
}
function getSide(id,$div){
    let $side=$div.find(".side");
    if(!$side.length){
        return;
    }
    let side={};
    let iframe=getIframe($side);
    if(iframe){
        side["iframe"]=iframe;
    }
    let $online=$side.find(".online");
    let online=getOnline($online);
    if(online)
        side["online"]=online;
    return side;
}
function getMain(id,$div){
    let main={};
    let $main=$div.find(".main");
    switch (id) {
        case "sns":
            main=getSnsMain($main);
            break;
        case "time":
            main=getTimeMain($main);
            break;
        case "video":
            main=getVideoMain($main);
            break;
        case "movie":
            main=getMovieMain($main);
            break;
        case "group":
            main=getGroupMain($main);
            break;
        case "book":
            main=getBookMain($main);
            break;
        case "music":
            main=getMusicMain($main);
            break;
        case "market":
            main=getMarketMain($main);
            break;
        case "events":
            main=getEventMain($main);
        default:
            return;
    }
    return main;
}
function getSnsMain($div){
    let sns={};
    let $mod=$div.find(".mod");
    let tile=getModHeader($mod);
    sns["tile"]=tile;
    let $albums=$mod.find(".albums");
    let albums=[];
    for(let i=0;i<$albums.find("li").length;i++){
        let $item=$albums.find("li").eq(i);
        let $pic=$item.find(".pic");
        let album=getPic($pic);
        album["text"]=$item.find("a").eq(1).text();
        album["remark"]=$item.find(".num").text();
        albums.push(album);
    }
    sns["albums"]=albums;
    let $notes=$mod.find(".notes");
    let notes=[];
    for(let i=0;i<$notes.find("li").length;i++){
        let $item=$notes.find("li").eq(i);
        console.log($item.html());
        if(i===0){
            let $title=$item.find(".title");
            let title={
                href:$title.find("a").attr("href"),
                text:$title.find("a").text(),
            }
            let author=$item.find(".author").text();
            let remark=$item.find("p").text();
            let note={
                title:title,
                author:author,
                remark:remark
            };
            notes.push(note);
           continue;
        }else{

            let note={
                href:$item.find("a").attr("href"),
                text:$item.find("a").text()
            }
            notes.push(note);
        }
    }
    sns["notes"]=notes;
    return sns;
}

function getTimeMain($div){
    let timeMain={};
    let title=getModHeader($div);
    timeMain["title"]=title;
    let times=[];
    for(let i=0;i<$div.find("li").length;i++){
        let $item=$div.find("li").eq(i);
        let url=getUrl($item.find("a").eq(0).find("img").attr("src"));
        let name=getImgName(url);
        saveImage(url,name);
        let timeItem={
            href:$item.find("a").eq(0).attr("href"),
            src:name,
            text:$item.find("a").eq(0).find("img").attr("alt"),
            type:$item.find(".type").text(),
        }
        times.push(timeItem);
    }
    timeMain["times"]=times;
    return timeMain;
}

function getVideoMain($div){

    let videos=[];
    let $titles=$div.children("a");
    let $list=$div.children(".video-list");
    for(let i=0;i<$titles.length;i++){
        let $title=$titles.eq(i);
        let $listitem=$list.eq(i);
        let title={
            href:$title.attr("href"),
            text:$title.text()
        }
        let videoList=[];
        for(let j=0;j<$listitem.find("li").length;j++){
            let $liItem=$listitem.find("li").eq(j);
            if($liItem.find(".video-cover").find("a").length){
                let url=getUrl($liItem.find(".video-cover").find("a").css("background-image"));
               let name=getImgName(url);
               saveImage(url,name);
                let item={
                    href:$liItem.find(".video-title").attr("href"),
                    text:$liItem.find(".video-title").text(),
                    back:"",
                }
                console.log(item);
                videoList.push(item);
            }

        }
        let videoitem={
            title:title,
            videoList:videoList
        }
        videos.push(videoitem);
    }
    return videos;
}

function getMovieMain($div){
    let title=$div.find("h2").text();
    let $movieList=$div.find(".list");
    let movieList=[];
    for(let i=0;i<$movieList.find("li").length;i++){
        let $movieItem=$movieList.find("li").eq(i);
        let $pic=$movieItem.find(".pic");
        let pic=getPic($pic);
        let $title=$movieItem.find(".title")
        let title={
            text:$title.text()
        };
        let $rating=$movieItem.find(".rating");
        let rating={
            start:$rating.find("span").attr("class").replace("allstar",""),
            num:$rating.text()
        }
        let $buy=$movieItem.find("bn-ticket");
        let bug={
            text:$buy.text(),
            href:$buy.attr("href")
        }
        let movieItem={
            pic:pic,
            title:title,
            rating:rating,
            bug:bug
        }
        movieList.push(movieItem);
    }
    return {
        title:title,
        movieList:movieList
    }
}

function getGroupMain($div){
    let title=$div.find("h2").text();
    let $groupList=$div.find(".list");
    let grouplist=[];
    for(let i=0;i<$groupList.find("li").length;i++){
        let $groupItem=$groupList.find("li").eq(i);
        let $pic=$groupItem.find(".pic");
        let pic=getPic($pic);
        let $info=$div.find(".info");
        let info={
            href:$info.find("a").attr("href"),
            text:$info.find("a").text(),
            subText:$info.text().replace($info.find("a").text(),"")
        };
        let groupItem={
            pic:pic,
            info:info
        }
        grouplist.push(groupItem);
    }
    return {
        title:title,
        grouplist:grouplist
    }
}

function getBookMain($div){
    let bookList=[];
    let $modList=$div.find(".mod");
    for(let i=0;i<$modList.length;i++){
        let $mod=$modList.eq(i);
        let header=getModHeader($mod);
        let modContent=[];
        for(let j=0;j<$mod.find("li").length;j++){
            let $item=$mod.find("li").eq(j);
            let $pic=$item.find(".pic");
            let pic=getPic($pic);
            let $title=$item.find(".title");
            let title={
                text:$title.find("a").text(),
                href:$title.find("a").attr("href")
            }
            let $author=$item.find(".author");
            let author=$author.text();
            let $read=$item.find(".bn-link");
            let read=$read.attr("href");
            modContent.push({
                pic:pic,
                title:title,
                author:author,
                read:read
            });
        }
        bookList.push({
            header:header,
            modContent:modContent
        })
    }
    return bookList;
}

function getMusicMain($div){
    let $titles=$div.children("h2");
    let $lists=$div.children(".list");
    let musics=[];
    for(let i=0;i<$titles.length;i++){
        let $title=$titles.eq(i);
        let title={
            text:$title.text(),
            more:$title.find(".pl").length?$title.find(".pl").find("a").attr("href"):""
        }
        let $list=$lists.eq(i);
        let list=[];
        for(let j=0;j<$list.find("li").length;j++){
            let $item=$list.eq(j);
            let item={};
            let $pic=$item.find(".pic");
            if($pic.length){
                let pic=getPic($pic);
                item["pic"]=pic;
            }
            let $title=$item.find(".title");
            if($title.find("a").length){
                item["title"]={
                    text:$title.find("a").text(),
                    href:$title.find("a").attr("href")
                }
            }else{
                item["title"]=$title.text();
            }
            let $artist=$item.find(".artist");
            if($artist.length){
                item["artist"]=$artist.text();
            }
            let $rating=$item.find(".rating");
            if($rating.length){
                item["artist"]={
                    star:$rating.find("span").attr("class").replace("allstar",""),
                    num:$rating.text()
                }
            }
            list.push(item);
        }
        let  music={
            title:title,
            list:list
        }
        musics.push(music);
    }
    return musics;
}

function getMarketMain($div){
    let title=getModHeader($div);
    let $list=$div.find(".main-sku");
    let list=[];
    for(let i=0;i<$list.length;i++){
        let $item=$list.eq(0);
        let item={};
        let $img=$item.find("market-spu-pic");
        if($img.length){
            let url=getUrl($img.css("background-image"));
            let name=getImgName(url);
            saveImage(url,name);
            item["img"]=name;
        }
        let $footer=$item.find(".market-spu-footer");
        item["price"]=$footer.find("market-spu-price").text();
        item["href"]=$footer.find("a").attr("href");
        item["atext"]=$footer.find("a").text();
        list.push(item);
    }
    return {
        title:title,
        list:list
    }
}
function getEventMain($div){
    let title=getModHeader($div);
    let $list=$div.find(".events-list");
    let list=[];
    for(let i=0;i<$list.find("li").length;i++){
        let $item=$list.find("li").eq(i);
        let $pic=$item.find(".pic");
        let pic=getPic($pic);
        let $info=$item.find(".info");
        let info={
            title:$info.find("a").attr("title"),
            datetime:$info.find(".datetime").text(),
            address:$info.find("address").attr("title"),
            follow:$info.find(".follow")
        }
        let item={
            pic:pic,
            info:info
        }
        list.push(item);
    }
    return {
        title:title,
        list:list
    }
}
/***公共方法****/
//去掉前后空格，换行
function formatText(text){
    if(!text)
        return "";
    return text.replace(/(^\s*)|(\s*$)/g, "").replace(/<\/?.+?>/g,"").replace(/[\r\n]/g, "");
}
function getUrl(url){
    if(!url)
        return "";
    return url.replace("url(","").replace(")","");
}
function getImgName(url) {
    if(!url)
        return "";
    return url.substring(url.lastIndexOf("/")+1);
}
function getPic($pic){
    if($pic.find("a").find("img").length){
        let src=$pic.find("a").eq(0).find("img").attr("data-origin");
        let name=src.substring(src.lastIndexOf("/")+1);
        saveImage(src,name);
        return {
            href:$pic.find("a").attr("href"),
            img:name,
            alt:$pic.find("a").find("img").attr("alt")
        };
    }

}
function saveImage(url,name) {
    if(!url||!name)
        return;
    url=url.replace("url(","").replace(")","").replace("https:","http:");
    let file='../web/src/img/'+name;
    http.get(url, function(res){
        var imgData = "";
        res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
        res.on("data", function(chunk){
            imgData+=chunk;
        });
        res.on("end", function(){
            fs.writeFile(file, imgData, "binary", function(err){
                if(err){
                    console.log(err);
                }
            });
        });
    });
}
//sidenav-获取title信息
function getsHeader($div){
    let $sheader=$div.find(".section-title");
    if(!$sheader.length){
        return null;
    }
    return {
        text:$sheader.find("a").text(),
        href:$sheader.find("a").attr("href")
    }
}
//sidenav-获取应用信息
function getAppList($div){
    let $appList=$div.find(".apps-list");
    if(!$appList.length||!$appList.find("li").length){
        return null;
    }
    let appList=[];
    for(let i=0;i<$appList.length;i++){
        let $appItem=$appList.eq(i);
        appList.push({
            href:$appItem.find(".lnk-icon").attr("href"),
            icon:$appItem.find(".lnk-icon").find("i").attr("style"),
            text:$appItem.text()
        });
    }
    return appList;
}
//sidenav-获取连接信息
function getsideLinks($div){
    let $sidelinks=$div.find(".side-links");
    if(!$sidelinks.length||!$sidelinks.find("li").length){
        return null;
    }
    let links=[];
    for(let i=0;i<$sidelinks.find("li");i++){
        let $linkitem=$sidelinks.find("li").eq(i);
        links.push({
            href:$linkitem.find('a').attr("href"),
            text:$linkitem.find('a').text(),
            img:$linkitem.find('img').length?$linkitem.find('img').attr("src"):""
        })
    }
    return links;
}

function getIframe($div){
    if(!$div.find("#dale_anonymous_homepage_right_top")){
        return;
    }
    let $iframe=$div.find("#dale_anonymous_homepage_right_top").find("iframe");
    if($iframe&&$iframe.length){
        return {
            src:$iframe.attr("src")
        }
    }
}
function getOnline($div){
    let $online=$div.find("online");
    if(!$online.length){
        return;
    }
    let $mods=$online.find(".mod");
    return getMods($mods);
}
function getMods($mods){
    if(!$mods||!$mods.length){
        return;
    }
    let mods=[];
    for(let i=0;i<$mods.length;i++){
        let $modItem=$mods.eq(i);
        let mod=getMod($modItem);
        mods.push(mod);
    }
    return mods;
}
function getMod($mod){
    let mod={};
    let modTitle=getModHeader($mod);
    if(modTitle)
        mod.modTitle=modTitle;
    let modContent=getModContent($mod);
    if(modContent)
        mod.modContent=modContent;
    return mod;
}
function getModHeader($mode){
    let $header=$mode.find("h2");
    if(!$header.length)
        return;
    return {
        text:$header.text(),
        more:$header.find(".pl").length?$header.find(".pl").find("a").attr("href"):""
    };
}
function getModContent($mod){
    let mod={};
    let $list=$mod.find(".list");
    let $list1=$mod.find(".list1");
    let $cates=$mod.find(".cate");
    let list=getModList($list,mod);
    if(list&&list.length)
        mod["list"]=list;
    let cates=getModeCate($cates,mod);
    if(cates&&cates.length)
        mod["cates"]=cates;
    let list1=getModList1($list1,mod);
    if(list1&&list1.length)
        mod["list1"]=list1;
    return mod;
}
function getModList($list,mod){
    if(!$list||!$list.length)
        return;
    if($list.hasClass("tags")&&$list.find("li").length){
        let tags=[];
        for(let i=0;i<$list.find("li").length;i++){
            let $item=$list.find("li").eq(i);
            let tagItem={
                text:$item.text(),
                href:$item.attr("href")
            }
            tags.push(tagItem);
        }
        mod["tags"]=tags;
    }
}
function getModeCate($cate,mod){
    if(!$cate.length)
        return;
    let cateItems=[];
    for(let i=0;i<$cate.length;i++){
        let $cateItem=$cate.eq(i);
        let $li=$cateItem.find("li");
        if(!$li.length)
            continue;
        let cateLable="";
        let li=[];
        for(let j=0;j<$li.length;j++){
            let $liitem=$li.eq(j);
            if($liitem.hasClass("cate-label")){
                cateLable=$liitem.text();
            }else{
                if($liitem.find("a").length){
                    let liitem={
                        a:{
                            text:$liitem.find("a").text(),
                            href:$liitem.find("a").attr("href"),
                        }
                    }
                    li.push(liitem);
                }
            }
            cateItems.push({
                cateLable:cateLable,
                cateli:li
            });
        }
    }
    mod["cate"]=cateItems;
}
function getModList1($list1,mod){
    if(!$list1.length)
        return;
    let list1=[];
    for(let i=0;i<$list1.find("li").length;i++){
        let $item=$list1.find("li").eq(i);
        let $pic=$item.find(".pic");
        let pic=getPic($pic);
        let $content=$item.find(".content");
        let content={
            text:$content.find("a").text(),
            href:$content.find("a").attr("href"),
            desc:$content.find(".content").html()
        };
        let item={
            pic:pic,
            content:content
        }
        list1.push(item);
    }
    return list1;
}