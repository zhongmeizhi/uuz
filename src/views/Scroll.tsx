import React, { useState, useEffect, useRef } from 'react';
import EventControl from '../controller/event';
import ScrollControl from '../controller/scroll';

interface ReScrollProps {
  className?: String, // 刷新组件的 支持添加className
  freshDistance?: number, // 触发刷新需要的：下拉距离
  loadDistance?: number, // 触发加载需要的：距离最底部距离
  freshHandler: Function | undefined, // 刷新执行的函数
  loadHandler: Function | undefined // 加载执行的函数
  children?: React.ReactNode
}

type UseEvent = React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>;

export default function Scroll(props: ReScrollProps) {
  const [scrollTip, setScrollTip] = useState('');
  const [freshAreaStyle, setScrollAreaStyle] = useState({transform: '', transition: ''});
  const [bottleneck, setBottleneck] = useState(0);
  const [scrollControl] = useState(new ScrollControl());
  const [bindFlag, setBindFlag] = useState(0);

  let refScrollArea = useRef(null);
  let refScrollBody = useRef(null);

  let freshBoxClassName = `zui-scroll-box ${props.className || ''}`;
  
  const hideScrollTip = (): void => {
    setScrollAreaStyle({
      transform: `translate(0, -50px)`,
      transition: 'transform 0.5s'
    })
  }
  
  const updateScroll = () => {
    props.freshHandler!();
    setBindFlag(bindFlag + 1);
    setScrollAreaStyle({
      transform: `translate(0, 0)`,
      transition: 'transform 2s'
    })
    setScrollTip('刷新中 >>>');
    setTimeout(() => hideScrollTip(), 300);
  }

  const freshStore = {
    'update': updateScroll,
    'reset': hideScrollTip,
    'none': () => {}
  }

  const onStartHandler = (event: UseEvent): void => {
    setScrollAreaStyle({
      transform: `translate(0, -50px)`,
      transition: ''
    })
    if ((refScrollBody.current as any).scrollTop === 0) {
      scrollControl.canRefresh()
    } else {
      scrollControl.banRefresh()
    }
    scrollControl.start(event);
    console.log('点击')
  }

  const onMoveHandler = (event: UseEvent): void => {
    const point = scrollControl.move(event);
    const distanceY = point.y;
    // 下拉动画
    if (distanceY > 0 && scrollControl.isRefreshable) {
      setScrollAreaStyle({
        transform: `translate(0, ${distanceY - 50}px)`,
        transition: ''
      })
      const tip = scrollControl.markScrollTip();
      setScrollTip(tip);
    }
    console.log(distanceY, '移动')
  }

  const onEndHandler = (): void => {
    // 需要刷新的时候执行 传入的刷新方法
    if (typeof props.freshHandler === 'function') {
      const status = scrollControl.getUpdateStatus();
      if (status !== 'none') {
        freshStore[status]();
        scrollControl.end();
        return;
      };
    }

    if (typeof props.loadHandler === 'function') {
      const scrollEle = (refScrollBody.current as any);
      console.log(bottleneck, 'bottleneck')
      if (scrollEle.scrollHeight < bottleneck + scrollEle.scrollTop) {
        props.loadHandler();
        setBindFlag(bindFlag + 1);
      }
    }
  }

  useEffect(() => {
    setBottleneck((refScrollArea.current as any).offsetHeight + 500);
    setBindFlag(bindFlag + 1);
  }, [])

  useEffect(() => {
    const eventControl = new EventControl(refScrollArea.current as any);
    eventControl.createEventList(onStartHandler, onMoveHandler, onEndHandler);
    eventControl.listenerAllOfEle();
    return () => {
        eventControl.removeAllOfEle();
    }
  }, [bindFlag])

  return <div
    className={freshBoxClassName}
    ref={refScrollArea}>
      {/* 滚动区域 */}
      <div
        className="zui-scroll-area"
        ref={refScrollBody}
        style={freshAreaStyle}
      >
        {/* 刷新tip */}
        <div className="zui-scroll-tip">{scrollTip}</div>
        {/* 真正的内容 */}
        <div className="zui-scroll">
          {props.children}
        </div>
      </div>
    </div>
}
