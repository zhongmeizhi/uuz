import React from 'react';
import './styles/test.scss';

import TestReFresh from './test-page/TestReFresh'
import TestSheet from './test-page/TestSheet';
import TestPicker from './test-page/TestPicker'

import './styles/index.scss'

function App() {
  return (
    <div className="App">
      <TestReFresh></TestReFresh>
      <br></br>
      <TestSheet></TestSheet>
      <br></br>
      <TestPicker></TestPicker>
    </div>
  );
}

export default App;
