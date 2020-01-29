module.exports = {
  port: 2333,
  exclude: /should-be-ignore/,
  source: './posts',
  theme: './theme',
  lessConfig: {
    javascriptEnabled: true,
  },
  webpackConfig(config) {
    return config;
  },
  themeConfig: {
    home: '/',
    sitename: 'Z-UI文档',
    github: 'https://github.com/zhongmeizhi/z-ui'
  },
  root: '/',
  hash: true,
};