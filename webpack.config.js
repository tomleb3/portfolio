const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.tsx',
    mode: 'development',
    target: 'web',
    devServer: {
        port: '5000',
        hot: false,
        liveReload: true,
        static: {
            directory: path.join(__dirname, 'public'),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts|\.tsx$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            react: 'preact/compat',
            'react-dom': 'preact/compat',
        },
    },
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'build'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
        }),
    ],
};
