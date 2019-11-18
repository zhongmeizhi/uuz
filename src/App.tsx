import React from 'react';
import './styles/test.scss';

import TestSheet from './test-page/TestSheet.jsx';
import TestPicker from './test-page/TestPicker'
import TestReFresh from './test-page/TestReFresh'

function App() {
  return (
    <div className="App">
      <TestSheet></TestSheet>
      <TestPicker></TestPicker>
      <TestReFresh></TestReFresh>
    </div>
  );
}

export default App;
