import React from 'react';


class ReFresh extends React.Component {

  constructor(props) {
    super(props);

    this.isNeedFresh = false; // 是否需要刷新
    this.startPageY = null;

    this.state = {
      transform: '',
      transition: '',
      refreshTip: '',
      loadTip: '上拉加载'
    }
  }

  touchStartHandler = (val) => {
    // 记住手的位置
    this.startPageY = val.touches[0].pageY;
    // 不能有动画效果
    this.setState({transition: ''})
  }

  touchMoveHandler = (val) => {
    // 计算位置
    const curPageY = val.touches[0].pageY;
    const distanceY = (curPageY - this.startPageY) / 2;

    let freshParms = {
      transform: `translate(0, ${distanceY}px)`,
    }

    const DISTANSE = 90;

    console.log([this.refs.refreshDom], 'this.$refs.refreshArea')
    console.log(this.refs.refreshDom.offsetTop, 'this.$refs.refreshArea')
    if (this.$refs) {
      if (distanceY > DISTANSE) {
        this.isNeedFresh = true;
        freshParms.refreshTip = '松开刷新';
      } else {
        this.isNeedFresh = false;
        freshParms.refreshTip = '下拉刷新';
      }
    }

    this.setState(freshParms)
  }

  touchEndHandler = (val) => {
    this.setState({
      transform: `translate(0, 0)`,
      transition: 'transform 0.6s'
    })
    
    // 需要刷新的时候执行 传入的刷新方法
    if (this.isNeedFresh && typeof this.props.freshHandler === 'function') {
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
          <div className="tip reFresh-tip">{this.state.refreshTip}</div>

          {/* 真正的内容 */}
          <div ref="refreshDom">
            {this.props.children}
          </div>

          {/* 加载tip */}
          <div className="tip load-tip">{this.state.loadTip}</div>
        </div>
      </div>
    )
  }
}

export default ReFresh;