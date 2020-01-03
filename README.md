# 简介

> 立志于打造一个高口碑的 移动端 UI库。


定位：
* 采用 `React Hook` + `.tsx` + `sass`
* 使用 `px` 为单位
* 使用 `hammer` 手势（将会重写一遍）
* 测试 && API文档使用`.js` 
* 由于是移动端库，使用了很多 touch 事件
  * PC端不使用仿真会出现无法点击的情况
* 不应该使用 `cssModule`
* 后期可能使用 `FastClick`
* 不打算发布到 npm


***

## [文档地址 https://zhongmeizhi.github.io/z-ui/](https://zhongmeizhi.github.io/z-ui/)

PS：
1. 文档采用 `StroyBook` 搭建，初次打开白屏时间较久
    * 目前没发现更好的：即可以自动展示源码又可以进行UI展示的API文档工具
    * 如果有更好的工具，请留言

***

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
* [x] Transition // 动画组件
* [ ] List
* [ ] Carousel
* [x] Waterfall // 瀑布流


使用的脚手架：[Create React App](https://github.com/facebook/create-react-app).

运行项目：

> npm run storybook

