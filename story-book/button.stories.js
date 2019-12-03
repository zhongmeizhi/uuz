import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from '../src/views/Button';
import buttonNotes from './md/button.md'

storiesOf('组件', module)
    .add('按钮',
        () => (
            <>
                <Button onClick={() => {}}>默认按钮</Button>
                <br></br>
                <Button type="raw" onClick={action('点击')}>Raw按钮</Button>
                <br></br>
                <Button disabled onClick={() => {}}>禁用按钮</Button>
            </>
        ),
        { 
            notes: buttonNotes,
        }
    )

// export default {
//     title: '组件'
// }