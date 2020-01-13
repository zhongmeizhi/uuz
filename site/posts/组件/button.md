---
title: 按钮
publishDate: 2019-05-12
---

# 按钮


```jsx

import Button from '../../../src/views/Button.tsx';

function action(val) {
    console.log(val);
}


ReactDOM.render(<div>
    <Button onClick={action('点击')}>默认按钮</Button>
    <br/>
    <Button type="raw" onClick={action('点击')}>Raw按钮</Button>
    <br/>
    <Button type="warn" onClick={action('点击')}>警告</Button>
    <br/>
    <Button disabled>禁用按钮</Button>
    <br/>
    <Button avatar onClick={action('点击')}>avatar 按钮</Button>
    <br/>
    <Button width="120px" height="30px" onClick={action('点击')}>自定义宽高</Button>
    <Button width="150px" height="40px" type="warn" onClick={action('点击')}>自定义宽高</Button>
    <br/>
    <Button type="raw" width="120px" height="120px" avatar onClick={action('点击')}>
        <img width="120px" src="https://zhongmeizhi.github.io/static/test/4.jpg" alt="乔巴"></img>
    </Button>
</div>, mountNode);

```
