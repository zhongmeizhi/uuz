---
title: 键盘 Keyboard
publishDate: 2020-01-13
---

```jsx

import Keyboard from '../../../src/views/Keyboard.tsx';
import Button from '../../../src/views/Button.tsx';
import React, {useState} from 'react';

const Test = () => {
    const [value, setValue] = useState('');

    return <div>
        <Keyboard
            onChange={setValue}
            header={<div className="test-value-box">{value}</div>}
            emitButton={<Button>打开键盘</Button>}
        ></Keyboard>
    </div>
}

ReactDOM.render(<Test></Test>, mountNode);
```

### 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ------ | ------ |
| --   | --   | --   | --     | --     |