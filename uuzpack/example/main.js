import { createApp } from './uuz.esm.js';
import './styles/reset.css'

// demo-ref
// import App from './demo/demo-ref.js';

// demo-reactive
import App from './demo/demo-reactive.uuz';

// demo-computed
// import App from './demo/demo-computed.js';


const ele = document.querySelector('#app');
createApp(App).mount(ele);