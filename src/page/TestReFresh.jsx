import React from 'react';

import ReFresh from '@/views/ReFresh.jsx'

class TestReFresh extends React.Component {

  constructor() {
    super();
    this.state = {
      num: 30
    }
  }

  freshHandler = () => {
    this.setState({
      num: 30
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

    return <ReFresh
      height={'100vh'}
      freshHandler={this.freshHandler}
      loadHandler={this.loadHandler}>
      {
        Array(this.state.num).fill(0).map((val, idx) => {
          return <div className="test-content" key={idx}>第{idx + 1}个</div>
        })
      }
    </ReFresh>
  }
}

export default TestReFresh;