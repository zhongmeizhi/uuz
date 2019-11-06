import React from 'react';

import ReFresh from '@/utils/ReFresh.jsx'

class TestReFresh extends React.Component {

  constructor() {
    super();
    this.state = {
      num: 30
    }
  }

  freshHandler = () => {
    this.setState({
      num: 50
    })
  }

  loadHandler = () => {
    this.setState((preState) => {
      return {
        num: preState.num + 30
      }
    })
  }

  render() {

    return <div className="test-reFresh">
      <ReFresh
        freshHandler={this.freshHandler}
        loadHandler={this.loadHandler}>
        {
          Array(this.state.num).fill(0).map((val, idx) => {
            return <div className="test-content" key={idx}>{idx}</div>
          })
        }
      </ReFresh>
    </div>
  }
}

export default TestReFresh;