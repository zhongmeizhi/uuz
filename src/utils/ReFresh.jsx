import React from 'react';


class ReFresh extends React.Component {

  constructor(props) {
    super(props);

    this.isNeedFresh = false; // 是否需要刷新
    this.isNeedLoad = false; // 是否需要加载
    this.startPageY = null;

    this.state = {
      transform: '',
      transition: '',
      refreshTip: '',
      loadTip: ''
    }
  }

  touchStartHandler = (val) => {
    // 记住手的位置
    this.startPageY = val.touches[0].pageY;

    // 不能有动画效果
    this.setState({transition: ''})
  }

  touchMoveHandler = (val) => {
    const scrollTop = this.refs.refreshArea.scrollTop;
    // 如果页面已经到达顶部，那么可以触发下拉刷新功能
    if (scrollTop === 0) {
      // 计算位置
      const curPageY = val.touches[0].pageY;
      const distanceY = (curPageY - this.startPageY) / 2;
      
      let freshParms = {
        transform: `translate(0, ${distanceY}px)`,
      }
  
      const DISTANSE = 90;
  
      if (distanceY > DISTANSE) {
        this.isNeedFresh = true;
        freshParms.refreshTip = '松开刷新';
      } else {
        this.isNeedFresh = false;
        freshParms.refreshTip = '下拉刷新';
      }
  
      this.setState(freshParms);

      return;
    }

    //  TODO 代码合并
    const areaHeight = this.refs.refreshArea.offsetHeight;
    const domHeight = this.refs.refreshDom.offsetHeight;
    if (areaHeight - domHeight <= scrollTop) {
      // 计算位置
      const curPageY = val.touches[0].pageY;
      const distanceY = (curPageY - this.startPageY) / 2;
      
      let freshParms = {
        transform: `translate(0, ${distanceY}px)`,
      }
  
      const DISTANSE = 90;
  
      if (-distanceY > DISTANSE) {
        this.isNeedLoad = true;
        freshParms.loadTip = '松开加载';
      } else {
        this.isNeedLoad = false;
        freshParms.loadTip = '上拉加载';
      }
  
      this.setState(freshParms);

      return;
    }
  }

  touchEndHandler = (val) => {
    this.setState({
      transform: `translate(0, 0)`,
      transition: 'transform 0.6s',
      refreshTip: '开始刷新',
      loadTip: '开始加载'
    })
    
    // 需要刷新的时候执行 传入的刷新方法
    if (this.isNeedFresh && typeof this.props.freshHandler === 'function') {
      this.props.freshHandler();
      return;
    }
    // 增加上拉加载
    if (this.isNeedLoad && typeof this.props.loadHandler === 'function') {
      this.props.loadHandler();
      return;
    }
  }

  render() {
    return (
      <div 
        className="reFresh-box">
        {/* 刷新tip */}
        <div className="tip reFresh-tip">{this.state.refreshTip}</div>

        {/* 滚动区域 */}
        <div
          ref="refreshArea"
          className="reFresh-area"
          style={{
            transform: this.state.transform,
            transition: this.state.transition
          }}
          onTouchStart={this.touchStartHandler}
          onTouchMove={this.touchMoveHandler}
          onTouchEnd={this.touchEndHandler}
        >

          {/* 真正的内容 */}
          <div
            ref="refreshDom"
            className="refresh"
            >
            {this.props.children}
          </div>

        </div>
        {/* 加载tip */}
        <div className="tip load-tip">{this.state.loadTip}</div>
      </div>
    )
  }
}

export default ReFresh;