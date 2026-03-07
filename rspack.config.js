const path = require('path');
const rspack = require('@rspack/core');

require('dotenv').config();

module.exports = {
    entry: './src/main.tsx',
    mode: 'development',
    target: 'web',
    devServer: {
        port: 5000,
        hot: true,
        static: {
            directory: path.join(__dirname, 'public'),
        },
    },
    experiments: {
        css: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'typescript',
                                tsx: true,
                            },
                            transform: {
                                react: {
                                    runtime: 'automatic',
                                    refresh: true,
                                },
                            },
                        },
                    },
                },
                type: 'javascript/auto',
            },
            {
                test: /\.s[ac]ss$/i,
                type: 'css/auto',
                use: [
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
            {
                test: /\.(ttf|otf|woff|woff2)$/,
                type: 'asset/resource',
            },
            {
                test: /\.svg$/,
                type: 'asset/source',
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
        cssFilename: 'build.css',
        path: path.resolve(__dirname, 'build'),
    },
    plugins: [
        new rspack.HtmlRspackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
            favicon: path.join(__dirname, 'public', 'favicon.ico'),
        }),
        new rspack.DefinePlugin({
            'process.env.EMAILJS_SERVICEID': JSON.stringify(process.env.EMAILJS_SERVICEID),
            'process.env.EMAILJS_TEMPLATEID': JSON.stringify(process.env.EMAILJS_TEMPLATEID),
            'process.env.EMAILJS_USERID': JSON.stringify(process.env.EMAILJS_USERID),
        }),
    ],
};
