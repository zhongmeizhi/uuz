import React from 'react';
import { action } from '@storybook/addon-actions';

import Button from '../src/views/Button';

export const button = () => <>
    <Button onClick={action('点击')}>默认按钮</Button>
    <br></br>
    <Button type="raw" onClick={action('点击')}>Raw按钮</Button>
    <br></br>
    <Button disabled>禁用按钮</Button>
</>
