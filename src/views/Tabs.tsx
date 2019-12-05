import React, { useState, useEffect } from 'react';
import Hammer from 'hammerjs';

interface TabsProps {
    children: React.ReactNode,
    tabs: Array<string>
}

export default function Tabs(props: TabsProps) {
    const [curTabIdx, setCurTabIdx] = useState(0);

    let refTabArea: HTMLElement | null;
    const tabLen = props.tabs.length;

    useEffect(() => {
        const hammer = new Hammer(refTabArea as HTMLElement);
        // 左滑 idx + 1
        hammer.on('swipeleft', () => {
            if (curTabIdx < tabLen - 1) {
                setCurTabIdx(curTabIdx + 1);
            }
        })
        // 右滑 idx - 1
        hammer.on('swiperight', () => {
            if (curTabIdx > 0) {
                setCurTabIdx(curTabIdx - 1);
            }
        })
        return () => hammer.destroy();
    }, [curTabIdx])

    return <div className="zui-tabs-container">
        <div className="zui-tabs-bar-box">
            {
                props.tabs.map((tab, idx) => <div
                    className={'zui-tabs-bar'.concat(curTabIdx === idx ? ' active' : '')}
                    key={idx}
                    style={{ width: `${100/tabLen}%` }}
                    onClick={() => setCurTabIdx(idx)}>
                    {tab}
                </div>)
            }
            <div className="zui-tabs-bar-underline" style={{
                width: `${100/tabLen}%`,
                transform: `translateX(${curTabIdx}00%)`
            }}></div>
        </div>
        <div className="zui-tabs-area-box" ref={ele => refTabArea = ele}>
            <div className="zui-tabs-area"
                style={{
                    width: `${tabLen}00%`,
                    transform: `translateX(-${(curTabIdx/tabLen) * 100}%)`
                }}>
                {props.children}
            </div>
        </div>
    </div>
}
