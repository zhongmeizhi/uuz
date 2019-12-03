import { create } from '@storybook/theming/create';

export default create({
    base: 'dark',

    colorPrimary: '#108ee9',
    colorSecondary: '#108ee9',

    // UI
    appBg: '#f2f4f5',
    appContentBg: '#f2f4f5',
    appBorderColor: '#108ee9',
    appBorderRadius: 4,

    // Typography
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',

    // Text colors
    textColor: '#108ee9',
    textSelectedColor: 'blue',
    textInverseColor: 'blue',

    // Toolbar default and active colors
    barTextColor: 'black',
    barSelectedColor: '#108ee9',
    barBg: '#f2f4f5',

    // Form colors
    inputBg: 'white',
    inputBorder: '#108ee9',
    inputTextColor: '#108ee9',
    inputBorderRadius: 4,

    brandTitle: 'Z-UI',
    brandUrl: 'https://zhongmeizhi.github.io/z-ui/',
    brandImage: 'https://zhongmeizhi.github.io/fultter-example-app/preview/meihong1.jpg',
});