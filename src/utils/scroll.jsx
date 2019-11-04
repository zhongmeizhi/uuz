import React from 'react';

let isTouch = false;
let startPageX;
let startPageY;
let curPageX;
let curPageY;

class Scroll extends React.Component {

  constructor() {
    super();
    this.state = {
      transform: '',
      transition: ''
    }
  }

  touchStartHandler = (val) => {
    isTouch = true;
    startPageX = val.touches[0].pageX;
    startPageY = val.touches[0].pageY;
  }

  touchMoveHandler = (val) => {
    if (isTouch) {
      curPageX = val.touches[0].pageX;
      curPageY = val.touches[0].pageY;

      const distanceX = curPageX - startPageX;
      const distanceY = curPageY - startPageY;

      this.setState({
        transform: `translate(${distanceX}px, ${distanceY}px)`
      })
    }
  }

  touchEndHandler = (val) => {
    isTouch = false;
  }

  render() {
    return <div 
      className="scroll-box"
      style={{
        transform: this.state.transform,
        transition: this.state.transition
      }}
      onTouchStart={this.touchStartHandler}
      onTouchMove={this.touchMoveHandler}
      onTouchEnd={this.touchEndHandler}>
      <div className="scroll">{this.props.children}</div>
    </div>
  }
}

export default Scroll;