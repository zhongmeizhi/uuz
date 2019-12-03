import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('介绍', module)
    .add('Z-UI',
        () => (
            <div>
                一个UI组件库，Z-UI
            </div>
        ),
        {
            docs: { disabled: true },
        }
    )

// export default {
//     title: '介绍'
// }