import React, { useState, useRef, useEffect } from 'react'

import { ReactComponent as NoticeSvg } from '../static/notice.svg'

interface NoticeProps {
    text: string,
    scroll: boolean
}

export default function Notice({text, scroll = true} : NoticeProps) {

    const [translateX, setTranslateX] = useState(0);
    const [refWidth, setWidth] = useState();
    const refItem = useRef(null);

    let intervalHandler: number;

    function step() {
        if (refWidth === -translateX) {
            setTranslateX(0);
        } else {
            setTranslateX(translateX - 1);
        }
        intervalHandler = window.requestAnimationFrame(step);
        // intervalHandler = setTimeout(step, 120);
    }
      
    useEffect(() => {
        if (scroll) {
            setWidth((refItem.current as any).offsetWidth);

            intervalHandler = window.requestAnimationFrame(step);
            // setTimeout(step, 120);
        }
        return () => {
            intervalHandler && window.cancelAnimationFrame(intervalHandler)
        };
    }, [translateX])

    return <div className="zui-notice">
        <div className="zui-notice-icon">
            <NoticeSvg
                width="15px"
                height="auto"
                fill="red"
            ></NoticeSvg>
        </div>
        <div className="zui-notice-box">
            <div style={{transform: `translateX(${translateX}px)`}}>
                <div className="zui-notice-item" ref={refItem}>
                    {text}
                </div>
                <div className="zui-notice-item">
                    {text}
                </div>
            </div>
        </div>
    </div>
}
