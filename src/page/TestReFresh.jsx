import React from 'react';

import ReFresh from '@/utils/ReFresh.jsx'

class TestReFresh extends React.Component {

  freshHandler = () => {
    console.log('刷新一下');
  }

  render() {
    return <div className="test-reFresh">
      <ReFresh freshHandler={this.freshHandler}>
        <div className="test-content">这个是下拉刷新内容</div>
      </ReFresh>
    </div>
  }
}

export default TestReFresh;