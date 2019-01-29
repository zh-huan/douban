const webpack = require("webpack");
const path = require("path");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
    //页面入口文件配置
    entry: {
        index: "./index.js",
    },
    //入口文件输出配置
    output: {
        path: path.resolve(__dirname, './dist'), // 项目的打包文件路径
        publicPath: '/dist/', // 通过devServer访问路径
        filename: "[name].min.js",
    },
    devtool: "source-map",
    //source-map 把映射文件生成到单独的文件，最完整最慢
    //cheap-module-source-map 在一个单独的文件中产生一个不带列映射的Map
    //eval-source-map 使用eval打包源文件模块,在同一个文件中生成完整sourcemap
    //cheap-module-eval-source-map sourcemap和打包后的JS同行显示，没有映射列
    devServer:{
      //  contentBase: './static_dev',
        port: 8899,
        compress: true,// 服务器压缩
        open: true,// 自动打开浏览器
        host: '0.0.0.0',
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    module: {
        //加载器配置
        rules: [
            {test:/\.vue$/,use:'vue-loader'},
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            },
            {
                test: /\.styl(us)?$/,
                use: ['vue-style-loader','css-loader','stylus-loader'],
            },
            {
                test: /\.(png|jpg|gif|eot|svg|ttf|woff)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1,
                            fallback: 'file-loader',
                            name: '[name].[hash:7].[ext]',
                            outputPath:'static_dist/cdaPlugin/images/',
                        }
                    }
                ],
            }
        ]
    },
    resolve: {
        //模块别名定义
        alias: {
            'vue': 'vue/dist/vue.js',
        }
    }
};