import React from 'react';
import Button from '../../src/views/Button';

import { action } from '@storybook/addon-actions';

const Gap = () => <div style={{height: '8px'}}></div>

export default () => <div style={{margin: '33px 16px'}}>
    <Button onClick={action('点击')}>默认按钮</Button>
    <Gap></Gap>
    <Button type="raw" onClick={action('点击')}>Raw按钮</Button>
    <Gap></Gap>
    <Button type="warn" onClick={action('点击')}>警告</Button>
    <Gap></Gap>
    <Button disabled>禁用按钮</Button>
    <Gap></Gap>
    <Button avatar onClick={action('点击')}>avatar 按钮</Button>
    <Gap></Gap>
    <Button width="100px" height="30px" onClick={action('点击')}>自定义宽高</Button>
    <Button width="160px" height="30px" type="warn" onClick={action('点击')}>自定义宽高</Button>
    <Gap></Gap>
    <Button type="raw" width="120px" height="120px" avatar onClick={action('点击')}>
        <img width="120px" src="https://zhongmeizhi.github.io/static/test/4.jpg" alt="乔巴"></img>
    </Button>
</div>
