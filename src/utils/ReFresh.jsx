import React from 'react';


class ReFresh extends React.Component {

  constructor(props) {
    super(props);

    this.isFresh = false;
    this.isTouch = false;
    this.startPageY = null;
    this.curPageY = null;

    this.state = {
      transform: '',
      transition: '',
      tip: ''
    }
  }

  touchStartHandler = (val) => {
    this.isTouch = true;
    this.startPageY = val.touches[0].pageY;

    this.setState({
      transition: '',
    })
  }

  touchMoveHandler = (val) => {
    if (this.isTouch) {
      this.curPageY = val.touches[0].pageY;

      const distanceY = (this.curPageY - this.startPageY) / 2;

      let freshParms = {
        transform: `translate(0, ${distanceY}px)`,
      }

      if (distanceY > 90) {
        this.isFresh = true;
        freshParms.tip = '松开刷新';
      } else {
        this.isFresh = false;
        freshParms.tip = '下拉刷新';
      }

      this.setState(freshParms)
    }
  }

  touchEndHandler = (val) => {
    this.isTouch = false;
    this.setState({
      transform: `translate(0, 0)`,
      transition: 'transform 0.6s'
    })
    if (this.isFresh && typeof this.props.freshHandler === 'function') {
      this.props.freshHandler();
    }
  }

  render() {
    return (
      <div 
        className="reFresh-box">
        {/* 滚动区域 */}
        <div className="reFresh-area"
          style={{
            transform: this.state.transform,
            transition: this.state.transition
          }}
          onTouchStart={this.touchStartHandler}
          onTouchMove={this.touchMoveHandler}
          onTouchEnd={this.touchEndHandler}
        >
          {/* 刷新tip */}
          <div className="reFresh-tip">{this.state.tip}</div>
          {/*  */}
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default ReFresh;