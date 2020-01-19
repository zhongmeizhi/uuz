import React, {useState, useEffect, useRef} from 'react';

import SwiperMaster from '../controller/swiper';
import { getValOrDefault } from '../utils/base';

interface SwiperProps {
    children: React.ReactNodeArray,
    height: string
}

export default function Swiper ({children, height}: SwiperProps) {

    // const [curSwiperIdx, setCurTabIdx] = useState(0);
    const [swiperMaster, setSwiperMaster] = useState();
    const [swiperPoint, setSwiperPoint] = useState({ x: 0, y: 0});
    const [tansitionStyle, setTansitionStyle] = useState('');

    const refSwiper = useRef(null);

    useEffect(() => {
        const len = children.length;
        const swiperMaster = new SwiperMaster({
            curIdx: 0,
            direction: 'x',
            len: len
        });
        setSwiperMaster(swiperMaster);

        const refItem = refSwiper.current as any;
        swiperMaster.setSwiperRange(refItem.offsetWidth);
    }, [])

    const swiperStyle: React.CSSProperties = {
        height: getValOrDefault(height, '')
    }

    const touchStartHandler = (event: React.TouchEvent<HTMLDivElement>) => {
        swiperMaster.start(event);
        setTansitionStyle('');
    }

    const touchMoveHandler = (event: React.TouchEvent<HTMLDivElement>) => {
        const point = swiperMaster.move(event);
        setSwiperPoint(point);
    }

    const touchEndHander = (event: React.TouchEvent<HTMLDivElement>) => {
        const point = swiperMaster.end(event);
        setSwiperPoint(point);
        setTansitionStyle('all 0.3s');
    }

    return <div className="zui-swiper"
        ref={refSwiper}
        onTouchStart={touchStartHandler}
        onTouchMove={touchMoveHandler}
        onTouchEnd={touchEndHander}
        style={swiperStyle}>
        <div className="zui-swiper-body" style={{
            transform: `translate(${swiperPoint.x}px, 0)`,
            transition: tansitionStyle
        }}>
            { children }
        </div>
    </div>
}


interface SwiperItem {
    children: React.ReactNode
}

Swiper.Item = ({children}: SwiperItem) => {
    return <div className="zui-swiper-item">{children}</div>
};
