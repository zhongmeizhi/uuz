import React from 'react';

import styles from '../styles/index.module.scss';

interface ReFreshProps {
  freshDistance: Number,
  loadDistance: Number,
  height: String,
  freshHandler: Function | undefined,
  loadHandler: Function | undefined
}

interface ReFreshState {
  transform: String,
  transition: String,
  refreshTip: String
}

interface GlobalAttr {
  height: String,
  isNeedFresh: Boolean,
  startPageY?: Number,
  distanceY?: Number,
  freshAble: Boolean,
  freshDistance: Number
  loadDistance: Number,
  isNeedLoad: Boolean
}

let _attr: GlobalAttr = {
  height: '100%',
  isNeedFresh: false,
  startPageY: undefined, // 记录开始手指位置
  distanceY: undefined, // 记录距离
  freshAble: false,
  freshDistance: 90,
  loadDistance: 30,
  isNeedLoad: false
};

class ReFresh extends React.Component<ReFreshProps, ReFreshState> {

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
    const freshAreaStyle: Object = {
      height: _attr.height,
      transform: this.state.transform,
      transition: this.state.transition
    }

    return (
      <div className={styles.reFreshBox}>
        {/* 滚动区域 */}
        <div
          ref={ele => this.refFreshArea = ele}
          className={styles.reFreshArea}
          style={freshAreaStyle}
          onTouchStart={this.touchStartHandler}
          onTouchMove={this.touchMoveHandler}
          onTouchEnd={this.touchEndHandler}
        >
          {/* 刷新tip */}
          <div className={styles.reFreshTip}>{this.state.refreshTip}</div>

          {/* 真正的内容 */}
          <div ref={ele => this.refFreshDom = ele} className={styles.refresh}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default ReFresh;