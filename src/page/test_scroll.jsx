import React from 'react';

import Scroll from '@/utils/scroll.jsx'

class TestScroll extends React.Component {
  render() {
    return <div className="test-scroll">
      <Scroll>
        <div>xxx</div>
      </Scroll>
    </div>
  }
}

export default TestScroll;