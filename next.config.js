const webpack = require("webpack");
const withSass = require("@zeit/next-sass");
const withImages = require('next-images')
const prod = process.env.NODE_ENV === 'production';
const test = process.env.NODE_ENV === 'testing';
const categories = require('./hikes/categories.json')

let tours = {
  "/": { page: '/' },
  "/hikes": { page: '/hikes'}
};

categories.forEach(category => {
  category.categoryTours.forEach(t => {
    tours[`/${t.alias}`] = { page: "/tour" }
  })
})

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
    exportPathMap: () => (tours),
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

