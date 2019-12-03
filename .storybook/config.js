import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { configureActions } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import theme from './theme.js';

// 导入全局样式
import '../src/styles/index.scss';

configure(() => [
    require('../story-book/index.stories.js'),
    require('../story-book/button.stories.js'),
], module);

addParameters({
    options: {
        showNav: false,
        showPanel: false,
        enableShortcuts: false,
        isToolshown: false,
        theme,
    },
});

addDecorator(storyFn => <div style={{ margin: '22px' }}>{storyFn()}</div>)

configureActions({
    depth: 100
})

addDecorator(withInfo({
    header: true,
    maxPropsIntoLine: 100,
    maxPropObjectKeys: 100,
    maxPropArrayLength: 100,
    maxPropStringLength: 100,
}))
