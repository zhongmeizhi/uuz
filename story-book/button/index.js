import React from 'react';
import Button from '../../src/views/Button';

import { action } from '@storybook/addon-actions';

const Gap = () => <div style={{height: '8px'}}></div>

export default () => <div>
    <Button onClick={action('点击')}>默认按钮</Button>
    <Gap></Gap>
    <Button type="raw" onClick={action('点击')}>Raw按钮</Button>
    <Gap></Gap>
    <Button type="warn" onClick={action('点击')}>警告</Button>
    <Gap></Gap>
    <Button disabled>禁用按钮</Button>
    <Gap></Gap>
    <Button width="120px" height="30px" onClick={action('点击')}>自定义宽高</Button>
    <Button width="150px" height="40px" type="warn" onClick={action('点击')}>自定义宽高</Button>
</div>
