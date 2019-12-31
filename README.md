# 简介

写UI库的原因：
1. 巩固 React
2. 学习 React Hooks
3. 加强对组件化的理解
4. 对一些框架的源码做一些实践，比如 iScroll、hammer、tween之类的
5. 让自己多一些系统性的思考
6. 方便自己写项目的时候 copy `:)`


定位：
* 使用 `Create React App` 作为脚手架
* 主要采用 `React Hook`
* 组件使用 `.tsx`
* 测试&&API文档使用`.js` 
* 使用 `sass` 作为 `css` 扩展
* 使用 `px` 为单位
* 不应该使用 `cssModule`
* 内含`hammer`手势（将会重写一遍）
* 目前不会发布上npm
* 移动端UI应该有自己的定制化（TODO）
* 需要做参数的异常处理（TODO）

***

## [Z-UI文档地址](https://zhongmeizhi.github.io/z-ui/)

文档内容正在优化中...

***

### 部分效果图

|Tabs|Sheet|Fresh|
|--|--|--|
|![Tabs](https://zhongmeizhi.github.io/static/z-ui/Tabs.gif)|![Sheet](https://zhongmeizhi.github.io/static/z-ui/Sheet.gif)|![Fresh](https://zhongmeizhi.github.io/static/z-ui/Fresh.gif)|
|Picker|PickerView|Dialog|
|![Picker](https://zhongmeizhi.github.io/static/z-ui/Picker.gif)|![PickerView](https://zhongmeizhi.github.io/static/z-ui/PickerView.gif)|![Dialog](https://zhongmeizhi.github.io/static/z-ui/Dialog.gif)|
|Alert|Confirm|--|
|![Alert](https://zhongmeizhi.github.io/static/z-ui/Alert.gif)|![Confirm](https://zhongmeizhi.github.io/static/z-ui/Confirm.gif)|--|

进度：
* [x] Button // 激活动画 + disable
* [x] Refresh // 下拉刷新 & 上拉加载
* [x] Sheet 
* [x] Tabs // 支持左右滑动
* [x] Picker
* [x] PickerView
* [x] Dialog
* [x] Alert
* [x] Comfirm
* [x] Step
* [ ] Toast
* [ ] Loading
* [x] Checkbox
* [x] Switch
* [x] Keyboard
* [ ] Progress
* [x] Transition
* [ ] List
* [ ] Carousel


使用的脚手架：[Create React App](https://github.com/facebook/create-react-app).

### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

### `npm run build`

### `npm run eject`
