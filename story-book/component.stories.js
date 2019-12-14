import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from '../src/views/Button';

import Picker from './picker/'
import Popup from './popup'
import Refresh from './refresh'
import Sheet from './sheet'
import TestTabs from './tabs'
import TestStep from './step'
import TestCheckbox from './checkbox'
import TestSwitch from './switch'

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

componentStory.add('弹出层 Dialog Alert Confirm',
    Popup,
    {
        notes: require('./popup/index.md'),
    }
)

componentStory.add('选择器 Picker',
    Picker,
)

componentStory.add('上拉刷新 下拉加载 Refresh',
    Refresh,
    {
        decorator: null
    }
)

componentStory.add('底部弹窗 Sheet',
    Sheet,
)

componentStory.add('标签页 Tabs',
    TestTabs,
)

componentStory.add('步骤条 Steps',
    TestStep,
)

componentStory.add('选择框 Checkbox',
    TestCheckbox,
)

componentStory.add('开关 Switch',
    TestSwitch,
)
