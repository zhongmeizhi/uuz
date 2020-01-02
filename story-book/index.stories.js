import React from 'react';
import { storiesOf } from '@storybook/react';

const Z_UI = () => (
    <div style={{textAlign: 'center', fontWeight: 'bold', fontSize: '16px', margin: '33px 16px'}}>
        <p>[]~(￣▽￣)~* 这里是Z-UI的API文档</p>
        <div style={{fontSize: '22px', fontWeight: 'bold', margin: '33px 0', color: '#108ee9'}}>
            <p>使用了移动端Touch事件</p>
            <p>如果是PC端，请使用仿真模式打开</p>
        </div>
        <ul>
            <li>说明见Notes按钮(简单的案例没写)</li>
            <li>API使用见Show Info按钮</li>
            <li>样例触发事件见Actions</li>
        </ul>
    </div>
)


storiesOf('介绍', module)
    .add('Z-UI', Z_UI, {props: []}
    )