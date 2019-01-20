"use strict";

module.exports = {
    mode: "development",
    entry: "./index.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    node: {
        global: false,
        process: false,
        Buffer: false,
        __filename: "mock",
        __dirname: "mock",
        setImmediate: false,
        fs: "empty",
    },
    resolveLoader: {
        modules: [
            "node_modules", 
            __dirname + "/node_modules",
        ],
    },
    module: {
        rules: [
            { test: /\.g4/, loader: 'antlr4-webpack-loader' }
        ]
    },
    devServer: {
        contentBase: __dirname,
        compress: true,
        port: 9000
    }
};