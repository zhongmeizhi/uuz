import React, { useState, useEffect } from 'react';

import SwiperControl from '../controller/swiper';
import { getClassName, getValOrDefault } from '../utils/base';
import EventControl from '../controller/event';

type UseEvent = React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>;

interface SwiperProps {
    children: React.ReactNodeArray,
    width: string,
    height: string,
    direction: 'x' | 'y',
    className: string
}

export default function Swiper ({
            children, width, height,
            direction = 'x', className
        }: SwiperProps) {
    
    const [curSwiperIdx, setCurTabIdx] = useState(0);
    const [swiperPoint, setSwiperPoint] = useState({ x: 0, y: 0});
    const [tansitionStyle, setTansitionStyle] = useState('');

    const swiperControl = new SwiperControl({
        curIdx: 0,
        direction,
        len: children.length
    });

    let refSwiper: HTMLDivElement | null;

    const swiperClassNames = {
        [className]: !!className,
        [`zui-swiper-${direction}`]: true
    }

    const swiperStyle: React.CSSProperties = {
        width: getValOrDefault(width, ''),
        height: getValOrDefault(height, '')
    }

    const onStartHander = (event: UseEvent) => {
        swiperControl.start(event);
        setTansitionStyle('');
    }

    const onMoveHander = (event: UseEvent) => {
        const point = swiperControl.move(event);
        setSwiperPoint(point);
    }

    const onEndHander = () => {
        const point = swiperControl.end();
        setCurTabIdx(swiperControl.getIndex());
        setSwiperPoint(point);
        setTansitionStyle('all 0.3s');
    }

    useEffect(() => {
        if (direction === 'x') {
            swiperControl.setSwiperRange(refSwiper!.offsetWidth);
        } else {
            swiperControl.setSwiperRange(refSwiper!.offsetHeight);
        }

        const eventControl = new EventControl(refSwiper as HTMLDivElement);
        eventControl.createEventList(onStartHander, onMoveHander, onEndHander);
        eventControl.listenerAllOfEle();

        return () => {
            eventControl.removeAllOfEle();
        };
    }, [])

    return <div className={'zui-swiper'.concat(getClassName(swiperClassNames))}
        ref={ele => refSwiper = ele}
        style={swiperStyle}>
        <div className="zui-swiper-body" style={{
            transform: `translate(${swiperPoint.x}px, ${swiperPoint.y}px)`,
            transition: tansitionStyle
        }}>
            { children }
        </div>
        <SwiperNav
            len={children.length}
            curActiveIdx={curSwiperIdx}
        ></SwiperNav>
    </div>
}

Swiper.Item = ({children}: {children: React.ReactNode}): JSX.Element => {
    return <div className="zui-swiper-item">{children}</div>
};

function SwiperNav({len, curActiveIdx}: {
            len: number,
            curActiveIdx: number
        }): JSX.Element {
    return <div className="zui-swiper-nav-box">
        {
            Array(len).fill('').map((val, idx) => 
            <span
                key={idx}
                className={'zui-swiper-nav'.concat(curActiveIdx === idx ? ' active' : '')}
            ></span>)
        }
    </div>
}
