import React from 'react';

import ReFresh from '../views/ReFresh'

interface TestFreshProps {
}

interface TestFreshState {
  num: number
}

class TestReFresh extends React.Component<TestFreshProps, TestFreshState> {

  constructor(props: TestFreshProps) {
    super(props);
    this.state = {
      num: 50
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

    return <ReFresh
      className="test-fresh"
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