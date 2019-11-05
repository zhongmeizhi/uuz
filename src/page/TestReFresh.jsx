import React from 'react';

import ReFresh from '@/utils/ReFresh.jsx'

class TestReFresh extends React.Component {

  constructor() {
    super();
    this.state = {
      txt: '下拉刷新',
      idx: 0
    }
  }

  freshHandler = () => {
    this.setState((preState) => {
      return {
        txt: '下拉刷新执行完成',
        idx: preState.idx + 1
      }
    })
  }

  render() {
    const testTxt = `${this.state.txt}刷新次数${this.state.idx}`;

    return <div className="test-reFresh">
      <ReFresh freshHandler={this.freshHandler}>
        {
          Array(100).fill(0).map((val, idx) => {
            return <div className="test-content" key={idx}>{idx} - {testTxt}</div>
          })
        }
      </ReFresh>
    </div>
  }
}

export default TestReFresh;