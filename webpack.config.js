var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: ["./src/main.js"],
    output: {
        path: path.resolve(__dirname, './bin'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ["es2015", "react"]
                    }
                }]
            }
        ]
    },
    devServer: {
        inline: true,
        port: 8080
    }
}
