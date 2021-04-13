const webpack = require("webpack");
const withSass = require("@zeit/next-sass");
const withImages = require('next-images')
const prod = process.env.NODE_ENV === 'production';
const test = process.env.NODE_ENV === 'testing';

const repoName = '/volt-mx-tutorials';

module.exports = withImages(withSass({
    cssModules: true,
    cssLoaderOptions: {
      localIdentName: prod ? "[hash:base64:5]" : test ? "[path]_[local]" : "[path]_[local]--[hash:base64:5]",
      sourceMap: true
    },
    assetPrefix: prod ? repoName : '',
    publicRuntimeConfig: {
      asset: prod ? repoName : ''
    },
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
  })
);

