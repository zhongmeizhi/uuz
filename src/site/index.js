import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx';
// import * as serviceWorker from './serviceWorker';

import VConsole from 'vconsole';

new VConsole();

ReactDOM.render(<App />, document.getElementById('root'));

// serviceWorker.unregister();
