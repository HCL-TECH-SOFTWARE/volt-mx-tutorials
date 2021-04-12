const webpack = require("webpack");
const withSass = require("@zeit/next-sass");
const prod = process.env.NODE_ENV === 'production';
const test = process.env.NODE_ENV === 'testing';

module.exports = withSass({
  cssModules: true,
  cssLoaderOptions: {
    localIdentName: prod ? "[hash:base64:5]" : test ? "[path]_[local]" : "[path]_[local]--[hash:base64:5]",
    sourceMap: true
  },
  assetPrefix: prod ? '/volt-mx-tutorials/' : '',
  exportPathMap: () => ({
    '/': { page: '/' },
    "/hikes": {
      page: '/hikes'}
  }),
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: "empty",
        net: "empty",
        tls: "empty"
      };
    }
    return config;
  }
});

