# 项目名称
## 目录
[toc]
## 项目介绍
## 使用技术
## 快速上手
```
git clone xxx
cd xxx
npm install
npm run dev
```
## 代理配置
```
https://a.b.com http://localhost: 80
```
## 线上地址
- 开发环境：https://
- 测试环境：https://
- 正式环境：https://
## 分支管理
主要分支：
| 分支    |     环境 |
| ------- | -------: |
| develop | 开发环境 |
| test    | 测试环境 |
| master  | 正式环境 |

如何开发：
开发者需根据需求创建特性分支（比如：feat_xxx_xx）,开发完成后合并到develop分支进行联调，提交mr至test提测......
## 目录结构
```
├─public
│      favicon.ico
│      index.html
└─src
    │  App.vue
    │  Error.vue
    │  main.js
    ├─assets
    │  ├─img
    │  └─style
    │      ├─css
    │      └─font
    ├─components // 所有公用组件
    │      
    ├─config
    │      index.js  // 一些配置
    ├─router
    │      index.js // 路由
    ├─store
    │      index.js  
    ├─utils
    │      tools.js // 工具类
    └─views   // 所有页面文件
```
## 如何部署
## 代码规范
## 接口文档
## 注意事项
## 项目接口人
