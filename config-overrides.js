const webpack = require("webpack")
// const NodePolyfillPlugin÷ = require("node-polyfill-webpack-plugin")

module.exports = function override(config, env) {
    //do stuff with the webpack config...
    config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve("buffer"),
        util: require.resolve("util"),
    }
    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]
    config.plugins = [
        ...config.plugins,
        // new NodePolyfillPlugin(),
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        }),
    ]
    // console.log(config.resolve)
    // console.log(config.plugins)

    return config
}
