const path = require('path');

module.exports = {
  lazyLoad: true,
  pick: {
    posts(markdownData) {
      return {
        meta: markdownData.meta,
        description: markdownData.description,
      };
    },
  },
  plugins: [
    'bisheng-plugin-react?lang=jsx',
    'bisheng-plugin-toc?maxDepth=2',
    'bisheng-plugin-description'
  ],
  routes: [{
    path: '/',
    component: './template/Archive',
  }, {
    path: '/posts/:post',
    dataPath: '/:post',
    component: './template/Post',
  }, {
    path: '/posts/:post/:sub',
    dataPath: '/:post/:sub',
    component: './template/Post',
  }, {
    path: '/tags',
    component: './template/TagCloud',
  }],
};
