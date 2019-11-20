import React, { PureComponent } from 'react';

import Hammer from 'hammerjs';
import { isDef } from '../utils/base';

interface TabsProps {
    children: React.ReactNode,
    tabs: Array<string>,
    height?: string
}

interface TabsState {
    curTabIdx: number
}

interface RenderStyleObject {
    containerStyle: Object,
    tabBarStyle: Object,
    tabLineStyle: Object,
    tabAreaStyle: Object
}

class Tabs extends PureComponent<TabsProps, TabsState> {

    refTabArea: HTMLDivElement | any;

    constructor(props: TabsProps) {
        super(props);
        this.state = {
            curTabIdx: 0
        }
    }

    componentDidMount() {
        // 添加左右滑 动画
        if(this.refTabArea) {
            const tabLen = this.props.tabs.length;
            const hammer = new Hammer(this.refTabArea);
            // 左滑 idx + 1
            hammer.on('swipeleft', () => {
                let curTabIdx = this.state.curTabIdx;
                if (curTabIdx + 1 !== tabLen) {
                    this.setState({
                        curTabIdx: curTabIdx + 1
                    })
                }
            })
            // 右滑 idx - 1
            hammer.on('swiperight', () => {
                let curTabIdx = this.state.curTabIdx;
                if (curTabIdx !== 0) {
                    this.setState({
                        curTabIdx: curTabIdx - 1
                    })
                }
            })
        }
    }

    switchTab = (idx: number) => this.setState({ curTabIdx: idx})

    /*  动态样式 */
    computedStyle(tabLen: number, curIdx: number): RenderStyleObject {
        let containerStyle = {};
        if (isDef(this.props.height)) {
            containerStyle = {
                height: this.props.height
            };
        }
        const tabBarWidth = `${100/tabLen}%`;
        const tabLineStyle = {
            width: tabBarWidth,
            transform: `translateX(${curIdx}00%)`
        }
        const tabAreaStyle = {
            width: `${tabLen}00%`,
            transform: `translateX(-${(curIdx/tabLen) * 100}%)`
        }
        return {
            containerStyle,
            tabBarStyle: {
                width: tabBarWidth
            },
            tabLineStyle,
            tabAreaStyle
        }
    }

    render() {
        const tabLen = this.props.tabs.length;
        const curIdx = this.state.curTabIdx;

        const { containerStyle, tabBarStyle, tabLineStyle, tabAreaStyle} = this.computedStyle(tabLen, curIdx);

        return <div className="zui-tabs-container" style={containerStyle}>
            <div className="zui-tabs-bar-box">
                {
                    this.props.tabs.map((tab, idx) => <div
                        className={'zui-tabs-bar '.concat(curIdx === idx ? 'active' : '')}
                        key={idx}
                        style={tabBarStyle}
                        onClick={this.switchTab.bind(this, idx)}>
                        {tab}
                    </div>)
                }
                <div className="zui-tabs-bar-underline" style={tabLineStyle}></div>
            </div>
            <div className="zui-tabs-area-box" ref={ele => this.refTabArea = ele}>
                <div className="zui-tabs-area"
                    style={tabAreaStyle}>
                    {this.props.children}
                </div>
            </div>
        </div>
    }
}

export default Tabs;