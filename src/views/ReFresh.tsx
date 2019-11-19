import React from 'react';

interface ReFreshProps {
  className?: String, // 刷新组件的 支持添加className
  freshDistance?: number, // 触发刷新需要的：下拉距离
  loadDistance?: number, // 触发加载需要的：距离最底部距离
  freshHandler: Function | undefined, // 刷新执行的函数
  loadHandler: Function | undefined // 加载执行的函数
}

interface ReFreshState {
  transform: string, // css
  transition: string, // css
  refreshTip: string // 刷新提示文案
}

// 全局属性
interface GlobalAttr {
  isNeedFresh: boolean, // 是否到了需要执行刷新方法的时候，（超过特定距离）
  startPageY?: number, // 手指开始位置
  distanceY?: number, // 手指滑动距离
  freshAble: boolean, // 是否可以刷新：只想让页面到达最顶部后再触发
  freshDistance: number // 触发刷新需要的：下拉距离，可以被props覆盖
  loadDistance: number, // 触发加载需要的：距离最底部距离，可以被props覆盖
  isNeedLoad: boolean // 是否需要刷新
}

let _attr: GlobalAttr = {
  isNeedFresh: false,
  startPageY: undefined,
  distanceY: undefined,
  freshAble: false,
  freshDistance: 90, // 
  loadDistance: 30,
  isNeedLoad: false
};

class ReFresh extends React.PureComponent<ReFreshProps, ReFreshState> {

  refFreshArea: any;
  refFreshDom: any;

  constructor(props: ReFreshProps) {
    super(props);

    // this.refFreshArea;
    // this.refFreshDom;
    
    // 需要绑定的状态
    this.state = {
      transform: '',
      transition: '',
      refreshTip: '',
    }
  }

  // tip 隐藏（恢复原状）
  hideFreshTip = () => {
    _attr.distanceY = undefined;
    this.setState({
      transform: `translate(0, -50px)`,
      transition: 'transform 0.6s',
    })
  }

  touchStartHandler = (val: any): void => {
    // 记住手的位置
    _attr.startPageY = val.touches[0].pageY;

    // 重置
    _attr.isNeedFresh = false;

    // 是否 可刷新
    // 只有当页面在最顶部的时候 再次下拉就会触发是否刷新选项
    const scrollTop = this.refFreshArea.scrollTop;
    _attr.freshAble = (scrollTop === 0);

    // 关闭有动画效果
    this.setState({transition: ''})
  }

  touchMoveHandler = (val: any): void => {
    if (_attr.freshAble) {
      // 计算位置
      const curPageY = val.touches[0].pageY;
      const startPageY = _attr.startPageY as number; // 小写
      const distanceY = _attr.distanceY = (curPageY - startPageY) / 2;

      // 下拉动画
      if (_attr.freshAble && distanceY > 0) {
        let freshParms = {
          transform: `translate(0, ${distanceY as number - 50}px)`,
          refreshTip: ''
        }
        if (distanceY > _attr.freshDistance) {
          _attr.isNeedFresh = true;
          freshParms.refreshTip = '松开刷新';
        } else {
          _attr.isNeedFresh = false;
          freshParms.refreshTip = '下拉刷新';
        }
        this.setState(freshParms);
        return;
      }
    }
  }

  touchEndHandler = () => {
    _attr.freshAble = false;
    
    // 需要刷新的时候执行 传入的刷新方法
    if (_attr.isNeedFresh &&
      typeof this.props.freshHandler === 'function') {
      this.setState({
        refreshTip: '刷新中 >>>',
        transform: `translate(0, 0)`,
        transition: 'transform 3s',
      })

      // 执行刷新方法
      this.props.freshHandler();

      setTimeout(() => {
        // 恢复原状
        this.hideFreshTip();
      }, 300);
      return;
    }
    
    // 不需要刷新但是有拉出tip的情况，需要恢复原状
    if (_attr.distanceY) this.hideFreshTip();

    // 上拉加载
    if (typeof this.props.loadHandler === 'function') {
      // 是否可加载
      const scrollTop = this.refFreshArea.scrollTop;
      const areaHeight = this.refFreshArea.offsetHeight;
      const domHeight = this.refFreshDom.offsetHeight;
      _attr.isNeedLoad = (domHeight <= _attr.loadDistance + areaHeight + scrollTop );

      // 加载操作
      _attr.isNeedLoad && this.props.loadHandler();
      return;
    }
  }

  render() {

    const freshBoxClassName: string = `zui-refresh-box ${this.props.className || ''}`;

    const freshAreaStyle: Object = {
      transform: this.state.transform,
      transition: this.state.transition
    }

    return (
      <div className={freshBoxClassName}>
        {/* 滚动区域 */}
        <div
          ref={ele => this.refFreshArea = ele}
          className="zui-refresh-area"
          style={freshAreaStyle}
          onTouchStart={this.touchStartHandler}
          onTouchMove={this.touchMoveHandler}
          onTouchEnd={this.touchEndHandler}
        >
          {/* 刷新tip */}
          <div className="zui-refresh-tip">{this.state.refreshTip}</div>

          {/* 真正的内容 */}
          <div ref={ele => this.refFreshDom = ele} className="refresh">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default ReFresh;