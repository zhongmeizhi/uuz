import React from 'react';
import './styles/test.scss';

import TestSheet from './test-page/TestSheet';
// import TestPicker from './test-page/TestPicker.jsx'
import TestReFresh from './test-page/TestReFresh.jsx'

function App() {
  return (
    <div className="App">
      <TestSheet></TestSheet>
      {/* <TestPicker></TestPicker> */}
      <TestReFresh></TestReFresh>
    </div>
  );
}

export default App;
