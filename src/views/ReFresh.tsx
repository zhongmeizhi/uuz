import React, { useState, useEffect } from 'react';

interface ReFreshProps {
  className?: String, // 刷新组件的 支持添加className
  freshDistance?: number, // 触发刷新需要的：下拉距离
  loadDistance?: number, // 触发加载需要的：距离最底部距离
  freshHandler: Function | undefined, // 刷新执行的函数
  loadHandler: Function | undefined // 加载执行的函数
  children?: React.ReactNode
}

// 刷新距离状态 的枚举值
enum DistanceStatus {
  'EMPTY',
  'HALF',
  'DONE'
}

const _attr = {
  startPageY: 0,
  distanceStatus: DistanceStatus.DONE,
  freshAble: false,
  freshDistance: 90, // 
  loadDistance: 60,
  domHeight: 0
}

export default function ReFresh(props: ReFreshProps) {
  const [refreshTip, setRefreshTip] = useState('');
  const [freshAreaStyle, setFreshAreaStyle] = useState({transform: '', transition: ''});

  let refFreshArea: HTMLDivElement | any;
  let refFreshDom: HTMLDivElement | any;

  let freshBoxClassName = `zui-refresh-box ${props.className || ''}`;
  
  // 副作用处理
  useEffect(() => {
    _attr.domHeight = refFreshDom.offsetHeight;
  })

  const getHasNeedLoad = (): boolean => {
    const areaHeight = refFreshArea.offsetHeight;
    const scrollTop = refFreshArea.scrollTop;
    const isNeedLoad = (_attr.domHeight <= _attr.loadDistance + areaHeight + scrollTop);
    return isNeedLoad;
  }
  
  const computedRefreshSatus = (event: React.TouchEvent<HTMLDivElement>): void => {
    const curPageY = event.touches[0].pageY;
    const startPageY = _attr.startPageY; // 小写
    const distanceY = (curPageY - startPageY) / 2;
    // 下拉动画
    if (distanceY > 0) {
      setFreshAreaStyle({
        transform: `translate(0, ${distanceY - 50}px)`,
        transition: ''
      })
      if (distanceY > _attr.freshDistance) {
        _attr.distanceStatus = DistanceStatus.DONE;
        setRefreshTip('松开刷新');
      } else {
        _attr.distanceStatus = DistanceStatus.HALF;
        setRefreshTip('下拉刷新');
      }
    }
  }
  
  // tip 隐藏（恢复原状）
  const hideFreshTip = (): void => {
    _attr.distanceStatus = DistanceStatus.DONE;
    setFreshAreaStyle({
      transform: `translate(0, -50px)`,
      transition: 'transform 0.6s'
    })
  }

  const touchStartHandler = (val: React.TouchEvent<HTMLDivElement>): void => {
    if (typeof props.freshHandler === 'function') {
      setFreshAreaStyle({
        transform: ``,
        transition: ''
      })
      _attr.distanceStatus = DistanceStatus.EMPTY;
      _attr.startPageY = val.touches[0].pageY;
      _attr.freshAble = (refFreshArea.scrollTop === 0);
    } else {
      _attr.freshAble = false;
    }
  }

  const touchMoveHandler = (event: React.TouchEvent<HTMLDivElement>): void => {
    _attr.freshAble && computedRefreshSatus(event);
  }

  const touchEndHandler = (): void => {
    // 需要刷新的时候执行 传入的刷新方法
    if (_attr.distanceStatus === DistanceStatus.DONE &&
        typeof props.freshHandler === 'function') {
      setFreshAreaStyle({
        transform: `translate(0, 0)`,
        transition: 'transform 3s'
      })
      setRefreshTip('刷新中 >>>');

      props.freshHandler();
      setTimeout(() => hideFreshTip(), 300);
      return;
    }
    
    if(_attr.distanceStatus === DistanceStatus.HALF) {
      hideFreshTip()
      return;
    }

    if (typeof props.loadHandler === 'function') {
      getHasNeedLoad() && props.loadHandler();
      return;
    }
  }

  return <>
      <div className={freshBoxClassName}>
        {/* 滚动区域 */}
        <div
          ref={ele => refFreshArea = ele}
          className="zui-refresh-area"
          style={freshAreaStyle}
          onTouchStart={touchStartHandler}
          onTouchMove={touchMoveHandler}
          onTouchEnd={touchEndHandler}
        >
          {/* 刷新tip */}
          <div className="zui-refresh-tip">{refreshTip}</div>
          {/* 真正的内容 */}
          <div ref={ele => refFreshDom = ele} className="zui-refresh">
            {props.children}
          </div>
        </div>
      </div>
  </>
}
