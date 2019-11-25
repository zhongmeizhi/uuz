# 简介

写UI库的原因：
1. 巩固React
2. 加强对组件化的理解
4. 对一些框架的源码做一些实践，比如 iScroll、hammer、tween之类的
5. 让自己多一些系统性的思考
6. 方便自己写项目的时候 copy `:)`

定位：
* 使用 `Create React App` 作为脚手架
* 使用 `px` 为单位
* 使用 `sass` 作为 `css` 扩展
* 不应该使用 `cssModule`
* 使用 `Ts` 和 `TSX`
* 内含`hammer`手势（将会重写一遍）
* 目前不会发布上npm
* 可能做一个预览页

### 预览

|Tabs|Sheet|Fresh|
|--|--|--|
|![Tabs](https://zhongmeizhi.github.io/static/z-ui/Tabs.gif)|![Sheet](https://zhongmeizhi.github.io/static/z-ui/Sheet.gif)|![Fresh](https://zhongmeizhi.github.io/static/z-ui/Fresh.gif)
|--|--|--|

### 示例代码
```
    // Tabs 使用
    <Tabs tabs={['标题1', 'tab2', '测试3']}>
        <div>test</div>
        <div>测试内容</div>
        <div>内容2</div>
    </Tabs>

    // Sheet 使用
    <Sheet
        titleTxt='sheet的标题'
        button={<Button>点击弹出Sheet</Button>}>
        <div>内容部分1</div>
    </Sheet>

    // Fresh 使用
    <ReFresh
      freshHandler={this.freshHandler}
      loadHandler={this.loadHandler}>
      <div>内容部分</div>
    </ReFresh>
```


进度：
* [x] Button // 激活动画 + disable
* [x] Refresh // 下拉刷新 & 上拉加载
* [x] Sheet 
* [x] Tabs // 支持左右滑动
* [x] Picker
* [x] PickerView
* [ ] List
* [ ] Dialog
* [ ] Toast
* [ ] Switch
* [ ] Progress
* [ ] Carousel


使用的脚手架：[Create React App](https://github.com/facebook/create-react-app).

### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

### `npm run build`

### `npm run eject`
