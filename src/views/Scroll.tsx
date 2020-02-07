import React from 'react';
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

export default  class Scroll extends React.PureComponent<ReScrollProps, any> {
  freshBoxClassName: string;
  refScrollArea?: HTMLDivElement | null;
  refScrollBody?: HTMLDivElement | null;
  eventControl?: EventControl;
  scrollControl: ScrollControl;
  freshStore: {[key: string]: Function};
  Begin_Distance: number;
  End_Distance: number;
  oldDistance: number;
  scrollBottleneck: number;
  // scrolling: boolean;

  constructor(props: ReScrollProps) {
    super(props);
    this.freshBoxClassName = `zui-scroll-box ${props.className || ''}`;
    this.Begin_Distance = -50;
    this.End_Distance = 26;
    this.scrollControl = new ScrollControl(); // 滚动控制器只返回距离和状态，不操作dom
    this.freshStore = {
      'update': this.updateScroll,
      'reset': this.hideScrollTip,
      'none': () => {}
    }
    this.oldDistance = 0;
    this.scrollBottleneck = 0;
    // this.scrolling = false
    // state
    this.state = {
      transform: {
        distance: this.Begin_Distance,
        time: 0
      },
      scrollTip: ''
    }
  }

  hideScrollTip = (): void => {
    this.setState({
      transform: {
        distance: this.Begin_Distance,
        time: 0.5
      }
    })
  }

  updateScroll = () => {
    this.props.freshHandler!();
    // this.scrolling = true;
    this.setState({
      scrollTip: '刷新完成>>>',
      transform: {
        distance: 0,
        time: 2
      }
    })
    setTimeout(() => {
      this.hideScrollTip()
    }, 300);
  }

  // 可滚动距离
  getScrollBottleneck = () => {
    const body = this.refScrollBody!.offsetHeight;
    const box = this.refScrollArea!.offsetHeight;
    return  body - box + this.Begin_Distance;
  }

  //  滚动缓冲
  scrollMat = () => {
    const expectMat = this.scrollControl.getExpectMat();
    if (expectMat) {
      // this.scrolling = true;
      let finalPonit = this.state.transform.distance + expectMat;
      if (finalPonit > this.Begin_Distance) {
        // 不能低于起点
        finalPonit = this.Begin_Distance
      } else if (finalPonit < -this.scrollBottleneck) {
        // 不能超过终点
        finalPonit = -this.scrollBottleneck;
      }
      this.setState({
        transform: {
          distance: finalPonit,
          time: 0.5
        }
      })
    }
  }

  onStartHandler = (event: UseEvent): void => {
    this.setState({
      transform: {
        distance: this.state.transform.distance,
        time: 0
      }
    })
    this.scrollControl.start(event);
    if (this.state.transform.distance === this.Begin_Distance) {
      this.scrollControl.canRefresh()
    } else {
      this.scrollControl.banRefresh()
    }
    this.oldDistance = this.state.transform.distance;
    this.scrollBottleneck = this.getScrollBottleneck();
    this.scrollControl.markBeginTime();
  }

  onMoveHandler = (event: UseEvent) => {
    event.preventDefault();
    const point = this.scrollControl.move(event);
    const distanceY = point.y;
    // 下拉动画
    if (distanceY > 0 && this.scrollControl.isRefreshable) {
      const scrollTip = this.scrollControl.markScrollTip();
      this.setState({ scrollTip })
    }
    const newDistance = this.oldDistance + distanceY;
    let finalDistance;
    if (newDistance > this.Begin_Distance && !this.scrollControl.isRefreshable) {
      // 顶点
      finalDistance = this.Begin_Distance;
    } else if (this.scrollBottleneck <= (-newDistance)) {
      // 终点
      finalDistance = -this.scrollBottleneck - this.End_Distance;
    } else {
      if (distanceY > 0) {
        // 下拉刷新移动一半
        finalDistance = this.oldDistance + distanceY/2;
      } else {
        finalDistance = newDistance;
      }
    }
    this.setState({
      transform: {
        distance: finalDistance,
        time: 0
      }
    })
  }

  onEndHandler = (): void => {
    this.scrollControl.end();
    // 需要刷新的时候执行 传入的刷新方法
    if (typeof this.props.freshHandler === 'function') {
      const status = this.scrollControl.getUpdateStatus();
      if (status !== 'none') {
        this.freshStore[status]();
        this.scrollControl.resetRefreshStatus();
        return;
      };
    }

    // 滚动缓冲
    this.scrollMat();

    if (typeof this.props.loadHandler === 'function') {
      if (this.scrollBottleneck <= (-this.state.transform.distance)) {
        this.props.loadHandler();
      }
    }
  }

  // transitionEndHandler = () => {
  //   this.scrolling = false;
  // }

  componentDidMount() {
    this.eventControl = new EventControl(this.refScrollArea!);
    this.eventControl.createEventList(this.onStartHandler, this.onMoveHandler, this.onEndHandler);
    this.eventControl.listenerAllOfEle();
  }

  componentWillUnmount() {
    this.eventControl!.removeAllOfEle();
  }
  
  render() {
    return <div
      className={this.freshBoxClassName}
      // onTransitionEnd={this.transitionEndHandler}
      ref={ele => this.refScrollArea = ele}>
        {/* 滚动区域 */}
        <div
          className="zui-scroll-area"
          ref={ele => this.refScrollBody = ele}
          style={{
            transform: `translate(0, ${this.state.transform.distance}px)`,
            transition: `transform ${this.state.transform.time}s`
          }}
        >
          {/* 刷新tip */}
          <div className="zui-scroll-tip">{this.state.scrollTip}</div>
          {/* 真正的内容 */}
          <div className="zui-scroll">
            {this.props.children}
          </div>
          <div className="zui-scroll-load-tip">加载更多内容</div>
        </div>
      </div>
  }
}

// import React, { useState, useEffect, useRef } from 'react';
// import EventControl from '../controller/event';
// import ScrollControl from '../controller/scroll';

// interface ReScrollProps {
//   className?: String, // 刷新组件的 支持添加className
//   freshDistance?: number, // 触发刷新需要的：下拉距离
//   loadDistance?: number, // 触发加载需要的：距离最底部距离
//   freshHandler: Function | undefined, // 刷新执行的函数
//   loadHandler: Function | undefined // 加载执行的函数
//   children?: React.ReactNode
// }

// type UseEvent = React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>;

// export default function Scroll(props: ReScrollProps) {

//   const Begin_Distance = -50;

//   const [scrollTip, setScrollTip] = useState('');
//   const [transform, setTransform] = useState({distance: Begin_Distance, time: 0});
//   const [scrollBottleneck, setScrollBottleneck] = useState(0);
//   const [scrollControl] = useState(new ScrollControl());
//   const [bindFlag, setBindFlag] = useState(0);

//   let refScrollArea: HTMLDivElement | null;
//   let refScrollBody = useRef(null);

//   let freshBoxClassName = `zui-scroll-box ${props.className || ''}`;
  
//   const hideScrollTip = (): void => {
//     setTransform({
//       distance: Begin_Distance,
//       time: 0.5
//     })
//   }
  
//   const updateScroll = () => {
//     props.freshHandler!();
//     setTransform({
//       distance: 0,
//       time: 2
//     })
//     setScrollTip('刷新中 >>>');
//     setTimeout(() => {
//       hideScrollTip()
//       setBindFlag(bindFlag + 1);
//     }, 300);
//   }

//   const freshStore = {
//     'update': updateScroll,
//     'reset': hideScrollTip,
//     'none': () => {}
//   }

//   const onStartHandler = (event: UseEvent): void => {
//     if (transform.distance === Begin_Distance) {
//       scrollControl.canRefresh()
//     } else {
//       scrollControl.banRefresh()
//     }
//     scrollControl.start(event);
//     console.log('开始')
//   }

//   const onMoveHandler = (event: UseEvent) => {
//     event.preventDefault();
//     const point = scrollControl.move(event);
//     const distanceY = point.y;
//     // 下拉动画
//     if (distanceY > 0 && scrollControl.isRefreshable) {
//       const tip = scrollControl.markScrollTip();
//       setScrollTip(tip);
//     }

//     const newDistance = transform.distance + distanceY;
//     if (newDistance > Begin_Distance && !scrollControl.isRefreshable) {
//       setTransform({
//         distance: Begin_Distance,
//         time: 0
//       })
//     } else {
//       setTransform({
//         distance: transform.distance + distanceY,
//         time: 0
//       })
//     }
//   }

//   const onEndHandler = (): void => {
//     // 需要刷新的时候执行 传入的刷新方法
//     if (typeof props.freshHandler === 'function') {
//       const status = scrollControl.getUpdateStatus();
//       if (status !== 'none') {
//         freshStore[status]();
//         scrollControl.end();
//         return;
//       };
//     }

//     if (typeof props.loadHandler === 'function') {
//       const scrollEle = (refScrollBody.current as any);
//       console.log(scrollEle.offsetHeight, scrollBottleneck, (-transform.distance))
//       if (scrollEle.offsetHeight <= scrollBottleneck + (-transform.distance)) {
//         props.loadHandler();
//         setBindFlag(bindFlag + 1);
//       }
//     }
//   }

//   useEffect(() => {
//     setScrollBottleneck(refScrollArea!.offsetHeight);
//     setBindFlag(bindFlag + 1);
//   }, [])

//   useEffect(() => {
//     const eventControl = new EventControl(refScrollArea!);
//     eventControl.createEventList(onStartHandler, onMoveHandler, onEndHandler);
//     eventControl.listenerAllOfEle();
//     return () => {
//         eventControl.removeAllOfEle();
//     }
//   }, [bindFlag])

//   return <div
//     className={freshBoxClassName}
//     ref={ele => refScrollArea = ele}>
//       {/* 滚动区域 */}
//       <div
//         className="zui-scroll-area"
//         ref={refScrollBody}
//         style={{
//           transform: `translate(0, ${transform.distance}px)`,
//           transition: `transform ${transform.time}s`
//         }}
//       >
//         {/* 刷新tip */}
//         <div className="zui-scroll-tip">{scrollTip}</div>
//         {/* 真正的内容 */}
//         <div className="zui-scroll">
//           {props.children}
//         </div>
//       </div>
//     </div>
// }