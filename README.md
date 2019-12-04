# 简介

写UI库的原因：
1. 巩固React
2. 加强对组件化的理解
4. 对一些框架的源码做一些实践，比如 iScroll、hammer、tween之类的
5. 让自己多一些系统性的思考
6. 方便自己写项目的时候 copy `:)`


定位：
* 使用 `Create React App` 作为脚手架
* 部分使用 `React Hook`
* 使用 `Ts` 和 `TSX`
* 使用 `sass` 作为 `css` 扩展
* 使用 `px` 为单位
* 不应该使用 `cssModule`
* 内含`hammer`手势（将会重写一遍）
* 目前不会发布上npm，
* 移动端UI应该有自己的定制化

***

## [Z-UI文档地址](https://zhongmeizhi.github.io/z-ui/)

***

### 使用预览

|Tabs|Sheet|Fresh|
|--|--|--|
|![Tabs](https://zhongmeizhi.github.io/static/z-ui/Tabs.gif)|![Sheet](https://zhongmeizhi.github.io/static/z-ui/Sheet.gif)|![Fresh](https://zhongmeizhi.github.io/static/z-ui/Fresh.gif)|
|Picker|PickerView|Dialog|
|![Picker](https://zhongmeizhi.github.io/static/z-ui/Picker.gif)|![PickerView](https://zhongmeizhi.github.io/static/z-ui/PickerView.gif)|![Dialog](https://zhongmeizhi.github.io/static/z-ui/Dialog.gif)|
|Alert|Confirm|--|
|![Alert](https://zhongmeizhi.github.io/static/z-ui/Alert.gif)|![Confirm](https://zhongmeizhi.github.io/static/z-ui/Confirm.gif)|--|


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

    // Picker 和 PickerView 使用
    <Picker
        data={[ [{value: '1', label: 'test1'}], [{value: '11', label: '测试1'}] ]}
        values={['1', '11']}
        onChange={this.changeHandler}>
    </Picker>

    // Dialog 使用
    dialog.show(<TestContent></TestContent>);

    // Alert 使用
    alert.show({
        title: <div>这里是标题</div>,
        content: <TestContent></TestContent>,
        onClose: () => {
            setAlertTxt('收到关闭 Alert 回调');
        }
    });

    // Confirm 使用
    confirm.show({
        title: '标题咯',
        content: '哒哒哒。拉面好吃吗？阔落好喝吗？听说猪肉又涨价了。滴滴滴。滴滴滴滴滴滴。滴滴滴',
        onCancel: () => {
            setConfirmTxt('取消 Confirm');
        },
        onConfirm: () => {
            setConfirmTxt('确认 Confirm');
        }
    });
```


进度：
* [x] Button // 激活动画 + disable
* [x] Refresh // 下拉刷新 & 上拉加载
* [x] Sheet 
* [x] Tabs // 支持左右滑动
* [x] Picker
* [x] PickerView
* [x] Dialog
* [x] Alert
* [ ] Comfirm
* [ ] Transition
* [ ] Toast
* [ ] Loading
* [ ] List
* [ ] Switch
* [ ] Progress
* [ ] Carousel


使用的脚手架：[Create React App](https://github.com/facebook/create-react-app).

### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

### `npm run build`

### `npm run eject`
