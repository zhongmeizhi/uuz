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

// 刷新距离状态 的枚举值
enum DistanceStatus {
  'EMPTY',
  'HALF',
  'DONE'
}

// 全局属性
interface GlobalAttr {
  startPageY: number, // 手指开始位置
  distanceStatus: DistanceStatus, // 是否到了需要执行刷新方法的时候，
  freshAble: boolean, // 是否可以刷新：只想让页面到达最顶部后再触发
  freshDistance: number // 触发刷新需要的：下拉距离，可以被props覆盖
  loadDistance: number, // 触发加载需要的：距离最底部距离，可以被props覆盖
}

let _attr: GlobalAttr = {
  startPageY: 0,
  distanceStatus: DistanceStatus.DONE,
  freshAble: false,
  freshDistance: 90, // 
  loadDistance: 60,
};

class ReFresh extends React.PureComponent<ReFreshProps, ReFreshState> {

  refFreshArea: HTMLDivElement | any;
  refFreshDom: HTMLDivElement | any;

  constructor(props: ReFreshProps) {
    super(props);
    // this.refFreshArea;
    // this.refFreshDom;
    this.state = {
      transform: '',
      transition: '',
      refreshTip: '',
    }
  }

  // 计算是否需要加载
  getHasNeedLoad = (): boolean => {
    const scrollTop = this.refFreshArea.scrollTop;
    const areaHeight = this.refFreshArea.offsetHeight;
    const domHeight = this.refFreshDom.offsetHeight;
    const isNeedLoad = (domHeight <= _attr.loadDistance + areaHeight + scrollTop);
    return isNeedLoad;
  }

  // 计算刷新状态变化
  computedRefreshSatus(event: React.TouchEvent<HTMLDivElement>): void {
    const curPageY = event.touches[0].pageY;
    const startPageY = _attr.startPageY; // 小写
    const distanceY = (curPageY - startPageY) / 2;

    // 下拉动画
    if (distanceY > 0) {
      let freshParms = {
        transform: `translate(0, ${distanceY - 50}px)`,
        refreshTip: ''
      }
      if (distanceY > _attr.freshDistance) {
        _attr.distanceStatus = DistanceStatus.DONE;
        freshParms.refreshTip = '松开刷新';
      } else {
        _attr.distanceStatus = DistanceStatus.HALF;
        freshParms.refreshTip = '下拉刷新';
      }
      this.setState(freshParms);
    }
  }

  // tip 隐藏（恢复原状）
  hideFreshTip = (): void => {
    _attr.distanceStatus = DistanceStatus.DONE;
    this.setState({
      transform: `translate(0, -50px)`,
      transition: 'transform 0.6s',
    })
  }

  // 开始时，执行一些重置操作
  touchStartHandler = (val: React.TouchEvent<HTMLDivElement>): void => {
    _attr.distanceStatus = DistanceStatus.EMPTY;
    // 记住手的位置
    _attr.startPageY = val.touches[0].pageY;
    // 只有当页面在最顶部的时候 再次下拉就会触发是否刷新选项
    _attr.freshAble = (this.refFreshArea.scrollTop === 0);
    // 关闭有动画效果
    this.setState({transition: ''})
  }

  // 手指移动时，计算刷新的状态变化
  touchMoveHandler = (event: React.TouchEvent<HTMLDivElement>): void => {
    if (_attr.freshAble) {
      this.computedRefreshSatus(event);
    }
  }

  touchEndHandler = (): void => {
    // 需要刷新的时候执行 传入的刷新方法
    if (_attr.distanceStatus === DistanceStatus.DONE &&
        typeof this.props.freshHandler === 'function') {
      this.setState({
        refreshTip: '刷新中 >>>',
        transform: `translate(0, 0)`,
        transition: 'transform 3s',
      })
      // 执行刷新方法
      this.props.freshHandler();
      // 恢复原状
      setTimeout(() => this.hideFreshTip(), 300);
      return;
    }
    
    // 不需要刷新但是有拉出tip的情况，需要恢复原状
    if(_attr.distanceStatus === DistanceStatus.HALF) {
      this.hideFreshTip()
      return;
    };

    // 上拉加载
    if (typeof this.props.loadHandler === 'function') {
      // 计算是否需要加载，然后执行加载操作
      this.getHasNeedLoad() && this.props.loadHandler();
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
          <div ref={ele => this.refFreshDom = ele} className="zui-refresh">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default ReFresh;