---
title: 按钮 Button
publishDate: 2020-01-13
---

```jsx

import Button from '../../../src/views/Button.tsx';
import Gap from '../../../src/test-component/Gap.tsx';

function action(val) {
    console.log(val);
}

const Test = () => (<Gap>
    <Button onClick={action('点击')}>默认按钮</Button>
    <Button type="raw" onClick={action('点击')}>Raw按钮</Button>
    <Button type="warn" onClick={action('点击')}>警告</Button>
    <Button disabled>禁用按钮</Button>
    <Button avatar onClick={action('点击')}>avatar 按钮</Button>
    <Button width="120px" height="30px" onClick={action('点击')}>自定义宽高</Button>
    <Button width="150px" height="40px" type="warn" onClick={action('点击')}>自定义宽高</Button>
    <Button type="raw" width="120px" height="120px" avatar onClick={action('点击')}>
        <img width="120px" src="https://zhongmeizhi.github.io/static/test/4.jpg" alt="乔巴"></img>
    </Button>
</Gap>)

ReactDOM.render(<Test></Test>, mountNode);
```

### 属性

| 参数  | 说明 | 类型   | 可选值           | 默认值  |
| ----- | ---- | ------ | ---------------- | ------- |
| type  | 类型 | string | raw/warn/primary | primary |
| width | 宽度 | string | --                | 100%    |