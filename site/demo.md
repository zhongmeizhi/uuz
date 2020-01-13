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

const Test = () => <Gap>
    <Button onClick={action('点击')}>默认按钮</Button>
</Gap>

ReactDOM.render(<Test></Test>, mountNode);
```

### 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ------ | ------ |
| --   | --   | --   | --     | --     |