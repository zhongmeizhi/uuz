---
title: 开始
publishDate: 2019-05-12
---

在 `bisheng` 中使用 bisheng-theme-blog-site

---

## 安装和初始化

```jsx
ReactDOM.render(<div>Click!</div>, mountNode);
```

请确保电脑上已经安装了最新版的 [yarn](https://yarnpkg.com) 或者 [npm](https://www.npmjs.com/)。

创建并进入文件夹。
```bash
$ mkdir blog-site-demo && cd blog-site-demo
```

使用 npm 创建项目。跟随 npm 提示创建完一个新工程

```bash
$ npm init
```

安装 bisheng 和 bisheng-theme-blog-site 以及 bisheng 插件 bisheng-plugin-description

```bash
$ npm install bisheng bisheng-theme-blog-site bisheng-plugin-description --save
```

在根目录创建 blog 文件夹（用来存放markdown文件的）以及 bisheng.config.js 文件, 文件内容如下

```js
// bisheng.config.js
module.exports = {
  // 这里和bisheng不一样，必须使用object
  source: {
    blog: './blog',
  },
  // 使用bisheng-theme-blog-site
  theme: 'bisheng-theme-blog-site',
  // 开启hash模式
  hash: true,
  lessConfig: {
    //开启 less 的 inline javascript 由于 bisheng-theme-blog-site 中使用的less样式是复制 antd 官网文档中的样式库，antd 有使用这个功能
    javascriptEnabled: true,
  },
  themeConfig: {
    home: '/',
    sitename: 'bisheng-theme-blog-site demo',
  },
  root: '/',
};
```

在 `package.json` 文件中添加script。
```json
 "scripts": {
    "start": "bisheng start",
    "build": "bisheng build"
  },
```

在文件夹 blog 中添加 demo.md 文件
```md
---
title: 基本测试
publishDate: 2019-05-12
---
## demo
```

启动工程
```bash
 npm run start
```

此时浏览器会访问 http://localhost:8000/ ，看到界面就算成功了。