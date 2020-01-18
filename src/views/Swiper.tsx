import React, {useState, useEffect} from 'react';

import Hammer from 'hammerjs';
import { getValOrDefault } from '../utils/base';

interface SwiperProps {
    children: React.ReactNode,
    height: string
}

export default function Swiper ({children, height}: SwiperProps) {

    const [curSwiperIdx, setCurTabIdx] = useState(0);
    let refSwiper: HTMLElement | null;

    const swiperStyle: React.CSSProperties = {
        height: getValOrDefault(height, '')
    }

    useEffect(() => {
        const hammer = new Hammer(refSwiper as HTMLElement);
        // 左滑 idx + 1
        hammer.on('swipeleft', () => {
            setCurTabIdx(curSwiperIdx + 1);
        })
        // 右滑 idx - 1
        hammer.on('swiperight', () => {
            setCurTabIdx(curSwiperIdx - 1);
        })
        return () => hammer.destroy();
    }, [curSwiperIdx])

    return <div className="zui-swiper"
        ref={ele => refSwiper = ele}
        style={swiperStyle}>
        <div className="zui-swiper-body" style={{
            transform: `translate(-${curSwiperIdx}00%, 0)`
        }}>
            {
                [1,2,3,4].map(val => <SwiperItem key={val}>{val}</SwiperItem>)
            }
        </div>
    </div>
}


interface SwiperItem {
    children: React.ReactNode
}

const SwiperItem = ({children}: SwiperItem) => {
    return <div className="zui-swiper-item">{children}</div>
}

