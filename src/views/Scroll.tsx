import React from 'react';
import EventControl from '../controller/event';
import ScrollControl from '../controller/scroll';
import MarbleLoading from './MarbleLoading';

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
  refScrollWarp?: HTMLDivElement | null;
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
      scrollTip: '',
      isLoading: false
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

  loadAnm = () => {
    if (!this.state.isLoading) {
      this.setState({
        isLoading: true,
      })
      setTimeout(() => {
        this.setState({
          isLoading: false,
        })
      }, 500)
    }
  }

  // 可滚动距离
  getScrollBottleneck = () => {
    const body = this.refScrollBody!.offsetHeight;
    const box = this.refScrollWarp!.offsetHeight;
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
    const isRefreshAble = this.state.transform.distance === this.Begin_Distance;
    this.scrollControl.setRefreshAble(isRefreshAble);
    
    this.oldDistance = this.state.transform.distance;
    this.scrollBottleneck = this.getScrollBottleneck();
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
    if (!this.scrollControl.isRefreshable &&
        newDistance > this.Begin_Distance) { // 顶点
      finalDistance = this.Begin_Distance;
    } else if (this.scrollBottleneck <= (-newDistance)) { // 终点
      finalDistance = -this.scrollBottleneck - this.End_Distance;
    } else {
      if (distanceY > 0) { // 下拉刷新移动一半
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
        this.loadAnm();
      }
    }
  }

  // transitionEndHandler = () => {
  //   this.scrolling = false;
  // }

  componentDidMount() {
    this.eventControl = new EventControl(this.refScrollWarp!);
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
      ref={ele => this.refScrollWarp = ele}>
        {/* 滚动区域 */}
        <div
          className="zui-scroll-area"
          ref={ele => this.refScrollBody = ele}
          style={{
            transform: `translate(0, ${this.state.transform.distance}px)`,
            transition: `transform ${this.state.transform.time}s ease-out`
          }}
        >
          {/* 刷新tip */}
          <div className="zui-scroll-tip">{this.state.scrollTip}</div>
          {/* 真正的内容 */}
          <div className="zui-scroll">
            {this.props.children}
          </div>
        </div>
        {
          this.state.isLoading ?
            <MarbleLoading className="zui-load-tip"></MarbleLoading>
            : null
        }
      </div>
  }
}
