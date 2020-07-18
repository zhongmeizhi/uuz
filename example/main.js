import { createApp } from '../src/index.js';

// demo-ref
// import App from './src/demo-ref';

// demo-reactive
// import App from './src/demo-reactive';

// demo-computed
import App from './src/demo-computed';


const ele = document.querySelector('#app');
createApp(App).mount(ele);