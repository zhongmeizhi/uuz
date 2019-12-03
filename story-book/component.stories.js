import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from '../src/views/Button';

import popup from './popup'
import picker from './picker/index.jsx'

const componentStory = storiesOf('组件', module);


componentStory.add('按钮 Button',
    () => <>
        <Button onClick={action('点击')}>默认按钮</Button>
        <br></br>
        <Button type="raw" onClick={action('点击')}>Raw按钮</Button>
        <br></br>
        <Button disabled>禁用按钮</Button>
    </>, {notes: ''}
)

componentStory.add('选择器 Picker',
    picker,
    {
    }
)

componentStory.add('弹出层',
    popup,
    {
        notes: require('./popup/index.md'),
    }
)

