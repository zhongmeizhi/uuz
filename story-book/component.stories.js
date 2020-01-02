import { storiesOf } from '@storybook/react';

import Button from './button/'
import Picker from './picker/'
import Popup from './popup'
import Scroll from './scroll'
import Sheet from './sheet'
import TestTabs from './tabs'
import TestStep from './step'
import TestCheckbox from './checkbox'
import TestSwitch from './switch'
import TestKeyBoard from './keyboard'
import TestWaterfall from './waterfall'

const componentStory = storiesOf('组件', module);

componentStory.add('按钮 Button',
    Button,
    {
        notes: require('./button/index.md'),
    }
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

componentStory.add('上拉刷新 下拉加载 Scroll',
    Scroll,
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

componentStory.add('键盘 Keyboard',
    TestKeyBoard,
)

componentStory.add('瀑布流 Waterfall',
    TestWaterfall,
    {
        notes: require('./waterfall/index.md'),
    }
)
