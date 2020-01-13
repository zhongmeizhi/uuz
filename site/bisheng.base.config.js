const path = require('path');

module.exports = {
  port: 2333,
  exclude: /should-be-ignore/,
  source: {
    blog: './blog',
  },
  theme: 'bisheng-theme-blog-site',
  lessConfig: {
    javascriptEnabled: true,
  },
  webpackConfig(config) {
    return config;
  },
  // plugins: ['bisheng-plugin-react?lang=jsx'],
  plugins: [path.join(__dirname, '..', 'node_modules', 'bisheng-plugin-react?lang=jsx')],
  themeConfig: {
    home: '/blog-site/',
    sitename: 'Z-UI文档',
  },
  root: '/blog-site/',
  hash: true,
};