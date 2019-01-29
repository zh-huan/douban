const webpack = require("webpack");

const path = require("path");
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const seen = new Set();
const nameLength = 4;

module.exports = {

    //页面入口文件配置
    entry: {
        cdaPlugin: "./static_dev/cda_app/script/enter/cdaPlugin.js",
    },
    //入口文件输出配置
    output: {
        path: path.resolve(__dirname, ""),
        filename: "static_dist/cdaPlugin/script/[name].min.js",
        publicPath: "/mtex/",
        chunkFilename: "static_dist/cdaPlugin/script/[name].[chunkhash:8].min.js"
    },
    /*
    devtool: "source-map",
            //source-map 把映射文件生成到单独的文件，最完整最慢
            //cheap-module-source-map 在一个单独的文件中产生一个不带列映射的Map
            //eval-source-map 使用eval打包源文件模块,在同一个文件中生成完整sourcemap
            //cheap-module-eval-source-map sourcemap和打包后的JS同行显示，没有映射列
    devServer:{
        contentBase:'./static_dev',
        port:8076,
        compress:true,// 服务器压缩
        open:false,// 自动打开浏览器
        host:'0.0.0.0',
    },
    */
    plugins: [
        new VueLoaderPlugin(),
        new webpack.NamedChunksPlugin(chunk => {
            if (chunk.name) {
                return chunk.name;
            }
            const modules = Array.from(chunk.modulesIterable);
            if (modules.length > 1) {
                const hash = require("hash-sum");
                const joinedHash = hash(modules.map(m => m.id).join("_"));
                let len = nameLength;
                while (seen.has(joinedHash.substr(0, len))) len++;
                seen.add(joinedHash.substr(0, len));
                return `chunk-${joinedHash.substr(0, len)}`;
            } else {
                return modules[0].id;
            }
        })
    ],
    optimization: {
        //runtimeChunk: 'single'
        moduleIds: 'hashed',
        splitChunks: {
            chunks: "async",//可填 async, initial, all. 顾名思义，async针对异步加载的chunk做切割，initial针对初始chunk，all针对所有chunk。
            minSize: 300000000,//我们切割完要生成的新chunk要>30kb，否则不生成新chunk。
            minChunks: 10000,//共享该module的最小chunk数
            maxAsyncRequests: 1,//最多有1个异步加载请求该module
            maxInitialRequests: 1,//初始化的时候最多有1个请求该module
            automaticNameDelimiter: '~',//名字中间的间隔符
            name: true,//chunk的名字，如果设成true，会根据被提取的chunk自动生成。
            cacheGroups: {//这个就是重点了，我们要切割成的每一个新chunk就是一个cache group。
                vendors: {
                    test: /[\\/]node_modules[\\/]/,//和CommonsChunkPlugin里的minChunks非常像，用来决定提取哪些module，可以接受字符串，正则表达式，或者函数，函数的一个参数为module，第二个参数为引用这个module的chunk(数组).
                    priority: -10//优先级高的chunk为被优先选择(说出来感觉好蠢),优先级一样的话，size大的优先被选择
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true//当module未变时，是否可以使用之前的chunk.
                }
            }
        }
    },
    module: {
        //加载器配置
        rules: [
            {
                test: require.resolve('./static_dev/vue_frame/script/lib/jquery.js'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                },{
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
            {
                test:/\.js$/,
                exclude:/(node_modules|static_dev\script\lib)/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:['env'],
                        plugins:[
                            "syntax-dynamic-import",
                            //"transform-object-rest-spread",
                            //"transform-class-properties",
                            "transform-runtime",
                        ]
                    }
                }
            },
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