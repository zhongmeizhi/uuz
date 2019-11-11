import React from 'react';

class ReFresh extends React.Component {
  constructor(props) {
    super(props);

    this.height = props.height || '100%';
    
    // 下拉刷新相关
    this.isNeedFresh = false; // 是否需要刷新
    this.startPageY = null;
    this.freshAble = false;
    this.freshDistance = props.freshDistance || 90;

    // 上拉加载相关
    this.loadDistance = props.loadDistance || 30;
    this.isNeedLoad = false;
    
    // 需要绑定的状态
    this.state = {
      transform: '',
      transition: '',
      refreshTip: '',
    }
  }

  touchStartHandler = (val) => {
    // 记住手的位置
    this.startPageY = val.touches[0].pageY;

    // 重置
    this.isNeedFresh = false;

    // 是否 可刷新
    // 只有当页面在最顶部的时候 再次下拉就会触发是否刷新选项
    const scrollTop = this.refs.refreshArea.scrollTop;
    this.freshAble = (scrollTop === 0);

    // 关闭有动画效果
    this.setState({transition: ''})
  }

  touchMoveHandler = (val) => {
    if (this.freshAble) {
      // 计算位置
      const curPageY = val.touches[0].pageY;
      const distanceY = (curPageY - this.startPageY) / 2;
      
      let freshParms = {
        transform: `translate(0, ${distanceY - 50}px)`,
      }

      // 下拉动画
      if (this.freshAble && distanceY > 0) {
        if (distanceY > this.freshDistance) {
          this.isNeedFresh = true;
          freshParms.refreshTip = '松开刷新';
        } else {
          this.isNeedFresh = false;
          freshParms.refreshTip = '下拉刷新';
        }
        this.setState(freshParms);
        return;
      }
    }
  }

  touchEndHandler = () => {
    this.freshAble = false;
    this.loadAble = false;
    
    // 需要刷新的时候执行 传入的刷新方法
    if (this.isNeedFresh && typeof this.props.freshHandler === 'function') {
      this.setState({
        refreshTip: '刷新中 >>>',
        transform: `translate(0, 0)`,
        transition: 'transform 3s',
      })

      // 执行刷新方法
      this.props.freshHandler();

      setTimeout(() => {
        this.setState({
          transform: `translate(0, -50px)`,
          transition: 'transform 0.6s',
        })
      }, 300);
      return;
    }

    // 上拉加载
    if (typeof this.props.loadHandler === 'function') {
      // 是否可加载
      const scrollTop = this.refs.refreshArea.scrollTop;
      const areaHeight = this.refs.refreshArea.offsetHeight;
      const domHeight = this.refs.refreshDom.offsetHeight;
      this.isNeedLoad = (domHeight <= this.loadDistance + areaHeight + scrollTop );

      // 加载操作
      this.isNeedLoad && this.props.loadHandler();
      return;
    }
  }

  render() {
    return (
      <div className="reFresh-box">
        {/* 滚动区域 */}
        <div
          ref="refreshArea"
          className="reFresh-area"
          style={{
            height: this.height,
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
          <div ref="refreshDom" className="refresh">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default ReFresh;