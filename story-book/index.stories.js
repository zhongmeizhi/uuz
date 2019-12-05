import React from 'react';
import { storiesOf } from '@storybook/react';

const Z_UI = () => (
    <div style={{textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>
        <p>[]~(￣▽￣)~* 这里是Z-UI的API文档</p>
        <h2 style={{fontSize: '22px', fontWeight: 'bold', margin: '33px 0', color: '#108ee9'}}>这是一个移动端 UI 库，使用了Touch事件，请使用手机或调试模式打开本网站</h2>
        <ul>
            <li>样例见Canvas按钮</li>
            <li>说明见Notes按钮(简单的案例没写)</li>
            <li>API使用见Show Info按钮</li>
            <li>样例触发事件见Actions</li>
        </ul>
    </div>
)


storiesOf('介绍', module)
    .add('Z-UI', Z_UI, {props: []}
    )