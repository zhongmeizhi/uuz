---
title: 选择框 Checkbox
publishDate: 2020-01-13
---

```jsx

import Checkbox from '../../../src/views/Checkbox.tsx';
import {useState} from 'react';

const Test = () => {

    const [checked, setChecked] = useState(false);
    const [checked2, setChecked2] = useState(true);
    const [checked3, setChecked3] = useState(true);

    return <div>
        <Checkbox checked={checked} onChange={setChecked}><span>选择框1</span></Checkbox>
        <br></br>
        <Checkbox checked={checked2} onChange={setChecked2} disabled><span>选择框2</span></Checkbox>
        <br></br>
        <Checkbox checked={checked3} onChange={setChecked3} type="round"><span>选择框3</span></Checkbox>
    </div>
}

ReactDOM.render(<Test></Test>, mountNode);
```

### 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ------ | ------ |
| --   | --   | --   | --     | --     |